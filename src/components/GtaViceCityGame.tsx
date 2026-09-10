import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Shield, 
  Heart, 
  DollarSign, 
  Crosshair, 
  Flame, 
  Car, 
  Zap, 
  Radio as RadioIcon, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles,
  Key,
  Compass
} from 'lucide-react';
import { Weapon, Vehicle, Language } from '../types';
import { WEAPONS_CATALOG, VEHICLES_CATALOG, VICE_CITY_CHEATS } from '../data/viceCityData';
import { viceAudio } from '../utils/audioSynth';

interface GtaViceCityGameProps {
  lang: Language;
  onOpenCheats: () => void;
  onOpenRadio: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  range: number;
  dist: number;
  damage: number;
  color: string;
  isExplosive?: boolean;
}

interface WorldCar {
  id: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  maxSpeed: number;
  color: string;
  name: string;
  health: number;
  isPolice?: boolean;
  isTank?: boolean;
}

interface WorldPed {
  x: number;
  y: number;
  angle: number;
  speed: number;
  health: number;
  color: string;
  isHostile?: boolean;
}

interface Pickup {
  x: number;
  y: number;
  type: 'health' | 'armor' | 'cash' | 'bribe' | 'weapon';
  value: number;
}

export const GtaViceCityGame: React.FC<GtaViceCityGameProps> = ({
  lang,
  onOpenCheats,
  onOpenRadio,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Player State
  const [health, setHealth] = useState(100);
  const [armor, setArmor] = useState(100);
  const [cash, setCash] = useState(2500);
  const [wantedLevel, setWantedLevel] = useState(0);
  const [currentWeaponIdx, setCurrentWeaponIdx] = useState(2); // Colt .45 default
  const [inVehicle, setInVehicle] = useState(false);
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleHealth, setVehicleHealth] = useState(100);
  const [activeCheatNotice, setActiveCheatNotice] = useState<string | null>(null);
  const [missionNotice, setMissionNotice] = useState<string | null>(
    lang === 'ar' ? 'مهمة: تفقد يخت الكولونيل كورتيز في أوشن بيتش (العلامة الصفراء)' : 'Mission: Check Colonel Cortez yacht at Ocean Beach'
  );

  // Keyboard and Control states
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const touchControlsRef = useRef({
    joystickX: 0,
    joystickY: 0,
    gas: false,
    brake: false,
    drift: false,
    fire: false,
  });

  // Game Engine Coordinates & Objects
  const gameStateRef = useRef({
    // Tommy
    playerX: 450,
    playerY: 400,
    playerAngle: 0,
    playerSpeed: 0,
    onFootSpeed: 3.5,
    health: 100,
    armor: 100,
    cash: 2500,
    wantedLevel: 0,

    // Current Driving Vehicle (if any)
    drivingCar: null as WorldCar | null,

    // Entities
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    cars: [
      { id: 'c1', x: 420, y: 360, angle: 0, speed: 0, maxSpeed: 7.5, color: '#f43f5e', name: 'Infernus', health: 100 },
      { id: 'c2', x: 600, y: 550, angle: Math.PI / 2, speed: 1.5, maxSpeed: 6.5, color: '#06b6d4', name: 'Cheetah', health: 100 },
      { id: 'c3', x: 800, y: 350, angle: 0, speed: 2, maxSpeed: 5.5, color: '#eab308', name: 'PCJ-600', health: 100 },
      { id: 'p1', x: 950, y: 800, angle: -Math.PI / 2, speed: 2.2, maxSpeed: 6.8, color: '#2563eb', name: 'VCPD Cruiser', health: 100, isPolice: true },
    ] as WorldCar[],

    peds: [
      { x: 380, y: 320, angle: 0.5, speed: 0.8, health: 50, color: '#ec4899' },
      { x: 500, y: 450, angle: -1.2, speed: 0.7, health: 50, color: '#38bdf8' },
      { x: 720, y: 380, angle: 2.1, speed: 0.9, health: 50, color: '#eab308' },
      { x: 650, y: 620, angle: 0.2, speed: 0.6, health: 50, color: '#a855f7' },
    ] as WorldPed[],

    pickups: [
      { x: 300, y: 300, type: 'health', value: 50 },
      { x: 700, y: 250, type: 'armor', value: 50 },
      { x: 850, y: 600, type: 'bribe', value: 1 },
      { x: 550, y: 750, type: 'cash', value: 500 },
    ] as Pickup[],

    missionTarget: { x: 1100, y: 780, radius: 45, name: "Cortez's Yacht" },
    waterWaveOffset: 0,
    lastFireTime: 0,
  });

  const currentWeapon = WEAPONS_CATALOG[currentWeaponIdx];

  // Cheat trigger helper
  const applyCheat = useCallback((cheatCode: string) => {
    const code = cheatCode.toUpperCase();
    const g = gameStateRef.current;

    viceAudio.playCheatActivated();

    if (code === 'ASPIRINE') {
      g.health = 100;
      setHealth(100);
      if (g.drivingCar) g.drivingCar.health = 100;
      setActiveCheatNotice('ASPIRINE: صحة كاملة 100%');
    } else if (code === 'PRECIOUSPROTECTION') {
      g.armor = 100;
      setArmor(100);
      setActiveCheatNotice('PRECIOUSPROTECTION: درع واقٍ 100%');
    } else if (code === 'LEAVEMEALONE') {
      g.wantedLevel = 0;
      setWantedLevel(0);
      setActiveCheatNotice('LEAVEMEALONE: تصفير نجوم الشرطة');
    } else if (code === 'YOUWONTTAKEMEALIVE') {
      g.wantedLevel = Math.min(6, g.wantedLevel + 2);
      setWantedLevel(g.wantedLevel);
      viceAudio.playSiren(1800);
      setActiveCheatNotice(`YOUWONTTAKEMEALIVE: ملاحقة الشرطة ★${g.wantedLevel}`);
    } else if (code === 'PANZER') {
      const tank: WorldCar = {
        id: 'tank_' + Date.now(),
        x: g.playerX + Math.cos(g.playerAngle) * 70,
        y: g.playerY + Math.sin(g.playerAngle) * 70,
        angle: g.playerAngle,
        speed: 0,
        maxSpeed: 4.8,
        color: '#334155',
        name: 'Rhino Tank',
        health: 400,
        isTank: true,
      };
      g.cars.push(tank);
      setActiveCheatNotice('PANZER: تم إنزال دبابة راينو العسكرية');
    } else if (code === 'GETTHEREFAST') {
      const car: WorldCar = {
        id: 'sabre_' + Date.now(),
        x: g.playerX + Math.cos(g.playerAngle) * 60,
        y: g.playerY + Math.sin(g.playerAngle) * 60,
        angle: g.playerAngle,
        speed: 0,
        maxSpeed: 9.2,
        color: '#dc2626',
        name: 'Sabre Turbo',
        health: 100,
      };
      g.cars.push(car);
      setActiveCheatNotice('GETTHEREFAST: سيارة سيبر توربو فائقة السرعة');
    } else if (code === 'BIGBANG') {
      viceAudio.playExplosion();
      g.cars.forEach((car) => {
        car.health = 0;
        // spawn particles
        for (let i = 0; i < 25; i++) {
          g.particles.push({
            x: car.x,
            y: car.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            color: Math.random() > 0.5 ? '#f97316' : '#ef4444',
            size: Math.random() * 6 + 3,
            life: 1,
            maxLife: 35,
          });
        }
      });
      setActiveCheatNotice('BIGBANG: تفجير جميع سيارات فايس سيتي!');
    } else {
      setActiveCheatNotice(`تم تفعيل الشفرة: ${code}`);
    }

    setTimeout(() => {
      setActiveCheatNotice(null);
    }, 3500);
  }, []);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      keysRef.current[e.code] = true;

      // Enter / Exit vehicle with 'F' or 'Enter'
      if (e.key.toLowerCase() === 'f' || e.key === 'Enter') {
        toggleVehicleEntry();
      }

      // Cycle weapons with Q or E
      if (e.key.toLowerCase() === 'e') {
        setCurrentWeaponIdx((prev) => (prev + 1) % WEAPONS_CATALOG.length);
      } else if (e.key.toLowerCase() === 'q') {
        setCurrentWeaponIdx((prev) => (prev - 1 + WEAPONS_CATALOG.length) % WEAPONS_CATALOG.length);
      }

      // Quick number cheat hotkeys (1-6)
      if (e.key === '1') applyCheat('ASPIRINE');
      if (e.key === '2') applyCheat('PRECIOUSPROTECTION');
      if (e.key === '3') applyCheat('PANZER');
      if (e.key === '4') applyCheat('LEAVEMEALONE');
      if (e.key === '5') applyCheat('BIGBANG');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [applyCheat]);

  // Enter or Exit car
  const toggleVehicleEntry = () => {
    const g = gameStateRef.current;
    if (g.drivingCar) {
      // Exit vehicle
      g.playerX = g.drivingCar.x + Math.cos(g.drivingCar.angle + Math.PI / 2) * 25;
      g.playerY = g.drivingCar.y + Math.sin(g.drivingCar.angle + Math.PI / 2) * 25;
      g.drivingCar = null;
      setInVehicle(false);
      setVehicleName('');
    } else {
      // Find closest vehicle
      let closestCar: WorldCar | null = null;
      let closestDist = 55;

      g.cars.forEach((car) => {
        const d = Math.hypot(car.x - g.playerX, car.y - g.playerY);
        if (d < closestDist && car.health > 0) {
          closestDist = d;
          closestCar = car;
        }
      });

      if (closestCar) {
        g.drivingCar = closestCar;
        setInVehicle(true);
        setVehicleName((closestCar as WorldCar).name);
        setVehicleHealth((closestCar as WorldCar).health);
        viceAudio.playEngineRev(0.6);
      }
    }
  };

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = Math.min(650, window.innerHeight * 0.75);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Loop
    const render = () => {
      const g = gameStateRef.current;
      const keys = keysRef.current;
      const touch = touchControlsRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. UPDATE CONTROLS & PHYSICS
      const isUp = keys['w'] || keys['arrowup'] || touch.gas || touch.joystickY < -0.3;
      const isDown = keys['s'] || keys['arrowdown'] || touch.brake || touch.joystickY > 0.3;
      const isLeft = keys['a'] || keys['arrowleft'] || touch.joystickX < -0.3;
      const isRight = keys['d'] || keys['arrowright'] || touch.joystickX > 0.3;
      const isDrift = keys[' '] || keys['space'] || touch.drift;
      const isShooting = keys[' '] || touch.fire;

      // Vehicle Driving Physics
      if (g.drivingCar) {
        const car = g.drivingCar;

        // Steering
        if (isLeft) car.angle -= 0.045 * (isDrift ? 1.4 : 1);
        if (isRight) car.angle += 0.045 * (isDrift ? 1.4 : 1);

        // Acceleration
        if (isUp) {
          car.speed = Math.min(car.maxSpeed, car.speed + 0.16);
          if (Math.random() < 0.08) viceAudio.playEngineRev(car.speed / car.maxSpeed);
        } else if (isDown) {
          car.speed = Math.max(-car.maxSpeed * 0.4, car.speed - 0.14);
        } else {
          // Coast friction
          car.speed *= 0.96;
        }

        // Handbrake drift
        if (isDrift && Math.abs(car.speed) > 2) {
          car.speed *= 0.94;
          if (Math.random() < 0.12) {
            viceAudio.playTireSkid();
            // Skid particles
            g.particles.push({
              x: car.x - Math.cos(car.angle) * 18,
              y: car.y - Math.sin(car.angle) * 18,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              color: 'rgba(50, 50, 60, 0.4)',
              size: 4,
              life: 1,
              maxLife: 20,
            });
          }
        }

        // Update car position
        car.x += Math.cos(car.angle) * car.speed;
        car.y += Math.sin(car.angle) * car.speed;
        g.playerX = car.x;
        g.playerY = car.y;
        g.playerAngle = car.angle;

        // Tank Cannon fire on Space
        if (car.isTank && isShooting && Date.now() - g.lastFireTime > 800) {
          g.lastFireTime = Date.now();
          viceAudio.playExplosion();
          g.bullets.push({
            x: car.x + Math.cos(car.angle) * 35,
            y: car.y + Math.sin(car.angle) * 35,
            vx: Math.cos(car.angle) * 14,
            vy: Math.sin(car.angle) * 14,
            range: 450,
            dist: 0,
            damage: 200,
            color: '#f97316',
            isExplosive: true,
          });
        }
      } else {
        // Tommy On-Foot Physics
        if (isLeft) g.playerAngle -= 0.055;
        if (isRight) g.playerAngle += 0.055;

        if (isUp) {
          g.playerSpeed = g.onFootSpeed;
        } else if (isDown) {
          g.playerSpeed = -g.onFootSpeed * 0.5;
        } else {
          g.playerSpeed = 0;
        }

        g.playerX += Math.cos(g.playerAngle) * g.playerSpeed;
        g.playerY += Math.sin(g.playerAngle) * g.playerSpeed;

        // On-foot shooting
        const weapon = WEAPONS_CATALOG[currentWeaponIdx];
        const fireInterval = 1000 / weapon.fireRate;
        if (isShooting && Date.now() - g.lastFireTime > fireInterval && weapon.ammo > 0) {
          g.lastFireTime = Date.now();
          weapon.ammo = Math.max(0, weapon.ammo - 1);

          viceAudio.playGunshot(
            weapon.type === 'heavy' ? 'rpg' : weapon.type === 'smg' ? 'uzi' : 'pistol'
          );

          g.bullets.push({
            x: g.playerX + Math.cos(g.playerAngle) * 16,
            y: g.playerY + Math.sin(g.playerAngle) * 16,
            vx: Math.cos(g.playerAngle) * 12,
            vy: Math.sin(g.playerAngle) * 12,
            range: weapon.range,
            dist: 0,
            damage: weapon.damage,
            color: weapon.color,
            isExplosive: weapon.type === 'heavy',
          });

          // Muzzle flash particle
          g.particles.push({
            x: g.playerX + Math.cos(g.playerAngle) * 18,
            y: g.playerY + Math.sin(g.playerAngle) * 18,
            vx: Math.cos(g.playerAngle) * 2,
            vy: Math.sin(g.playerAngle) * 2,
            color: '#fef08a',
            size: 5,
            life: 1,
            maxLife: 6,
          });

          // Shooting in public raises heat if wantedLevel is 0
          if (g.wantedLevel === 0 && Math.random() < 0.15) {
            g.wantedLevel = 1;
            setWantedLevel(1);
          }
        }
      }

      // Police AI Chase if wantedLevel > 0
      g.cars.forEach((car) => {
        if (car.isPolice && g.wantedLevel > 0 && car.health > 0) {
          const dx = g.playerX - car.x;
          const dy = g.playerY - car.y;
          const targetAngle = Math.atan2(dy, dx);
          car.angle += (targetAngle - car.angle) * 0.04;
          car.speed = Math.min(car.maxSpeed * (1 + g.wantedLevel * 0.1), car.speed + 0.1);
          car.x += Math.cos(car.angle) * car.speed;
          car.y += Math.sin(car.angle) * car.speed;

          // Siren sounds
          if (Math.random() < 0.015) {
            viceAudio.playSiren(1500);
          }

          // Ram player
          const dist = Math.hypot(dx, dy);
          if (dist < 35) {
            if (g.drivingCar) {
              g.drivingCar.health = Math.max(0, g.drivingCar.health - 0.8);
              setVehicleHealth(Math.round(g.drivingCar.health));
            } else {
              g.health = Math.max(0, g.health - 0.6);
              setHealth(Math.round(g.health));
            }
          }
        }
      });

      // Update Bullets
      for (let i = g.bullets.length - 1; i >= 0; i--) {
        const b = g.bullets[i];
        b.x += b.vx;
        b.y += b.vy;
        b.dist += Math.hypot(b.vx, b.vy);

        // Check hit against cars
        g.cars.forEach((car) => {
          if (Math.hypot(b.x - car.x, b.y - car.y) < 26) {
            car.health = Math.max(0, car.health - b.damage);
            b.dist = b.range + 1; // destroy bullet

            // Hit sparks
            for (let k = 0; k < 6; k++) {
              g.particles.push({
                x: b.x,
                y: b.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: '#fbbf24',
                size: 3,
                life: 1,
                maxLife: 12,
              });
            }

            if (car.health <= 0) {
              viceAudio.playExplosion();
              for (let k = 0; k < 20; k++) {
                g.particles.push({
                  x: car.x,
                  y: car.y,
                  vx: (Math.random() - 0.5) * 7,
                  vy: (Math.random() - 0.5) * 7,
                  color: '#ef4444',
                  size: 5,
                  life: 1,
                  maxLife: 25,
                });
              }
              // Destroying police raises heat
              if (car.isPolice) {
                g.wantedLevel = Math.min(6, g.wantedLevel + 1);
                setWantedLevel(g.wantedLevel);
              }
            }
          }
        });

        // Check hit against pedestrians
        g.peds.forEach((ped) => {
          if (Math.hypot(b.x - ped.x, b.y - ped.y) < 16 && ped.health > 0) {
            ped.health = 0;
            b.dist = b.range + 1;
            g.cash += 45;
            setCash(g.cash);
            g.wantedLevel = Math.min(6, g.wantedLevel + 1);
            setWantedLevel(g.wantedLevel);
          }
        });

        if (b.dist >= b.range) {
          g.bullets.splice(i, 1);
        }
      }

      // Update Pickups
      for (let i = g.pickups.length - 1; i >= 0; i--) {
        const p = g.pickups[i];
        if (Math.hypot(g.playerX - p.x, g.playerY - p.y) < 28) {
          viceAudio.playCheatActivated();
          if (p.type === 'health') {
            g.health = Math.min(100, g.health + p.value);
            setHealth(g.health);
          } else if (p.type === 'armor') {
            g.armor = Math.min(100, g.armor + p.value);
            setArmor(g.armor);
          } else if (p.type === 'cash') {
            g.cash += p.value;
            setCash(g.cash);
          } else if (p.type === 'bribe') {
            g.wantedLevel = Math.max(0, g.wantedLevel - 1);
            setWantedLevel(g.wantedLevel);
          }
          g.pickups.splice(i, 1);
        }
      }

      // Check Mission Target Reach
      const distToTarget = Math.hypot(g.playerX - g.missionTarget.x, g.playerY - g.missionTarget.y);
      if (distToTarget < g.missionTarget.radius) {
        viceAudio.playMissionPass();
        g.cash += 1500;
        setCash(g.cash);
        setMissionNotice(lang === 'ar' ? 'اكتملت المهمة بنجاح! نلت 1500$' : 'Mission Passed! Earned $1,500');
        // Move target
        g.missionTarget.x = 250 + Math.random() * 800;
        g.missionTarget.y = 250 + Math.random() * 600;
      }

      // Update Particles
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife) {
          g.particles.splice(i, 1);
        }
      }

      // 2. RENDER STAGE (Camera follows Tommy / Car)
      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Camera Offset
      const camX = width / 2 - g.playerX;
      const camY = height / 2 - g.playerY;
      ctx.translate(camX, camY);

      // A. Ground & Terrain (Vice City Ocean Beach & Asphalt Roads)
      // Beach Sand Background
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-600, -600, 2600, 2200);

      // Ocean Water (East Coast)
      g.waterWaveOffset = (g.waterWaveOffset + 0.03) % (Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(1100, -600, 900, 2200);

      // Animated Water Waves / Shore Foam
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let y = -600; y < 1600; y += 40) {
        const waveX = 1100 + Math.sin(g.waterWaveOffset + y * 0.05) * 12;
        ctx.moveTo(waveX, y);
        ctx.lineTo(waveX, y + 25);
      }
      ctx.stroke();

      // Roads & Intersections (Dark charcoal asphalt)
      ctx.fillStyle = '#1e293b';
      // Main Ocean Drive Boulevard (North - South)
      ctx.fillRect(400, -600, 160, 2200);
      // West Avenue
      ctx.fillRect(100, -600, 140, 2200);
      // Washington St Crossroad (East - West)
      ctx.fillRect(-600, 300, 1700, 140);
      // Starfish Causeway
      ctx.fillRect(-600, 700, 1700, 140);

      // Road Markings (Yellow double center lines & white borders)
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 15]);
      // Ocean drive center line
      ctx.beginPath();
      ctx.moveTo(480, -600);
      ctx.lineTo(480, 1600);
      ctx.moveTo(-600, 370);
      ctx.lineTo(1100, 370);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Buildings & Art-Deco Hotels
      const buildings = [
        { x: 260, y: 120, w: 120, h: 160, color: '#ec4899', name: 'Ocean View' },
        { x: 260, y: 460, w: 120, h: 200, color: '#06b6d4', name: 'Malibu Club' },
        { x: 580, y: 120, w: 140, h: 160, color: '#8b5cf6', name: 'VCPD Station' },
        { x: 580, y: 460, w: 150, h: 200, color: '#f59e0b', name: 'Ammu-Nation' },
        { x: -100, y: 120, w: 180, h: 160, color: '#10b981', name: 'Starfish Mansion' },
      ];

      buildings.forEach((b) => {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(b.x + 8, b.y + 8, b.w, b.h);

        // Building Body
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(b.x, b.y, b.w, b.h);

        // Art-Deco Neon Facade border
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 4;
        ctx.strokeRect(b.x, b.y, b.w, b.h);

        // Roof Sign
        ctx.fillStyle = b.color;
        ctx.font = 'bold 12px "Chakra Petch", sans-serif';
        ctx.fillText(b.name, b.x + 10, b.y + 24);
      });

      // Palm Trees (Iconic Vice City Palms)
      const palmTrees = [
        { x: 380, y: 220 },
        { x: 380, y: 480 },
        { x: 580, y: 220 },
        { x: 580, y: 480 },
        { x: 1040, y: 200 },
        { x: 1040, y: 400 },
        { x: 1040, y: 650 },
      ];
      palmTrees.forEach((palm) => {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(palm.x + 5, palm.y + 5, 14, 0, Math.PI * 2);
        ctx.fill();

        // Trunk
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(palm.x, palm.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Palm fronds
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 3;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
          ctx.beginPath();
          ctx.moveTo(palm.x, palm.y);
          ctx.lineTo(palm.x + Math.cos(a) * 22, palm.y + Math.sin(a) * 22);
          ctx.stroke();
        }
      });

      // Mission Target Marker (Pulsing glowing circle)
      const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.15;
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(g.missionTarget.x, g.missionTarget.y, g.missionTarget.radius * pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(234, 179, 8, 0.2)';
      ctx.beginPath();
      ctx.arc(g.missionTarget.x, g.missionTarget.y, g.missionTarget.radius * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(g.missionTarget.name, g.missionTarget.x - 45, g.missionTarget.y - 50);

      // Draw Pickups (Floating rotating icons)
      g.pickups.forEach((pickup) => {
        const floatY = Math.sin(Date.now() * 0.006 + pickup.x) * 4;
        ctx.save();
        ctx.translate(pickup.x, pickup.y + floatY);

        if (pickup.type === 'health') {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('+', -4, 4);
        } else if (pickup.type === 'armor') {
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('🛡', -6, 3);
        } else if (pickup.type === 'bribe') {
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText('★', -5, 3);
        } else {
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText('$', -3, 3);
        }
        ctx.restore();
      });

      // Draw Pedestrians
      g.peds.forEach((ped) => {
        if (ped.health <= 0) return;
        ctx.save();
        ctx.translate(ped.x, ped.y);
        ctx.rotate(ped.angle);

        // Body
        ctx.fillStyle = ped.color;
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Draw Cars
      g.cars.forEach((car) => {
        ctx.save();
        ctx.translate(car.x, car.y);
        ctx.rotate(car.angle);

        if (car.health <= 0) {
          // Wrecked burnt car
          ctx.fillStyle = '#18181b';
          ctx.fillRect(-22, -12, 44, 24);
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Car Shadow
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillRect(-24, -14, 48, 28);

          // Headlights Beam if night / running
          ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
          ctx.beginPath();
          ctx.moveTo(22, -8);
          ctx.lineTo(80, -25);
          ctx.lineTo(80, 25);
          ctx.lineTo(22, 8);
          ctx.closePath();
          ctx.fill();

          // Main Body
          ctx.fillStyle = car.color;
          ctx.fillRect(-22, -12, 44, 24);

          // Windshield & Roof
          ctx.fillStyle = '#090d16';
          ctx.fillRect(-10, -9, 20, 18);

          // Car Hood Stripe
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(8, -3, 14, 6);

          // Wheels
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(-16, -15, 8, 4);
          ctx.fillRect(-16, 11, 8, 4);
          ctx.fillRect(8, -15, 8, 4);
          ctx.fillRect(8, 11, 8, 4);

          // Police Siren Bar
          if (car.isPolice) {
            const flash = Math.floor(Date.now() / 150) % 2;
            ctx.fillStyle = flash ? '#ef4444' : '#3b82f6';
            ctx.fillRect(-3, -6, 6, 12);
          }

          // Tank Turret Cannon
          if (car.isTank) {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, -3, 30, 6); // barrel
          }
        }

        ctx.restore();
      });

      // Draw Tommy Vercetti (If On-Foot)
      if (!g.drivingCar) {
        ctx.save();
        ctx.translate(g.playerX, g.playerY);
        ctx.rotate(g.playerAngle);

        // Tommy's iconic Hawaiian Teal Shirt (#06b6d4) & Blue Jeans
        // Body / Shoulders
        ctx.fillStyle = '#06b6d4'; // Teal Hawaiian shirt
        ctx.beginPath();
        ctx.roundRect(-8, -9, 16, 18, 4);
        ctx.fill();

        // Tommy's Hands / Weapon position
        ctx.fillStyle = '#fed7aa'; // skin tone
        ctx.beginPath();
        ctx.arc(8, 6, 3, 0, Math.PI * 2);
        ctx.arc(8, -6, 3, 0, Math.PI * 2);
        ctx.fill();

        // Weapon in hand
        const curWp = WEAPONS_CATALOG[currentWeaponIdx];
        if (curWp.id !== 'fists') {
          ctx.fillStyle = curWp.color;
          ctx.fillRect(8, -2, 12, 4);
        }

        // Head & Dark Hair
        ctx.fillStyle = '#1e1b4b'; // dark hair
        ctx.beginPath();
        ctx.arc(-1, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Draw Bullets
      g.bullets.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.isExplosive ? 5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Particles (Sparks, Smoke, Fire)
      g.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore(); // Restore camera offset

      // Request Next Frame
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [currentWeaponIdx, lang]);

  return (
    <div className="flex flex-col gap-4">
      {/* Top HUD Stats Bar (Authentic Vice City Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 bg-slate-900/90 p-3 sm:p-4 rounded-2xl border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
        
        {/* Health */}
        <div className="flex items-center gap-2.5 bg-slate-950/80 px-3 py-2 rounded-xl border border-red-500/30">
          <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'الصحة' : 'HEALTH'}</div>
            <div className="text-base sm:text-lg font-black text-red-400 font-mono tracking-wider">{health}%</div>
          </div>
        </div>

        {/* Armor */}
        <div className="flex items-center gap-2.5 bg-slate-950/80 px-3 py-2 rounded-xl border border-cyan-500/30">
          <Shield className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'الدرع' : 'ARMOR'}</div>
            <div className="text-base sm:text-lg font-black text-cyan-400 font-mono tracking-wider">{armor}%</div>
          </div>
        </div>

        {/* Cash ($) */}
        <div className="flex items-center gap-2.5 bg-slate-950/80 px-3 py-2 rounded-xl border border-emerald-500/30">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'الأموال' : 'CASH'}</div>
            <div className="text-base sm:text-lg font-black text-emerald-400 font-mono tracking-wider">${cash}</div>
          </div>
        </div>

        {/* Wanted Stars (Police Heat) */}
        <div className="flex items-center gap-2.5 bg-slate-950/80 px-3 py-2 rounded-xl border border-amber-500/30">
          <div className="flex flex-col">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'الشرطة' : 'WANTED'}</div>
            <div className="flex items-center gap-1 text-sm sm:text-base text-amber-400">
              {[1, 2, 3, 4, 5, 6].map((star) => (
                <span
                  key={star}
                  className={`transition-colors ${
                    star <= wantedLevel 
                      ? 'text-amber-400 fill-amber-400 animate-bounce' 
                      : 'text-slate-700'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Current Weapon */}
        <div className="flex items-center gap-2.5 bg-slate-950/80 px-3 py-2 rounded-xl border border-pink-500/30">
          <Crosshair className="w-5 h-5 text-pink-400" />
          <div className="truncate">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'السلاح' : 'WEAPON'}</div>
            <div className="text-xs sm:text-sm font-bold text-pink-300 truncate">
              {lang === 'ar' ? currentWeapon.name : currentWeapon.nameEn}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {currentWeapon.ammo} / {currentWeapon.maxAmmo}
            </div>
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="flex items-center gap-2.5 bg-slate-950/80 px-3 py-2 rounded-xl border border-indigo-500/30">
          <Car className="w-5 h-5 text-indigo-400" />
          <div className="truncate">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'المركبة' : 'VEHICLE'}</div>
            <div className="text-xs sm:text-sm font-bold text-indigo-300 truncate">
              {inVehicle ? vehicleName : (lang === 'ar' ? 'سيراً على الأقدام' : 'On Foot')}
            </div>
            {inVehicle && (
              <div className="text-[10px] text-emerald-400 font-mono font-bold">
                {vehicleHealth}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Canvas Container with Screen Overlay */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden border-2 border-pink-500/40 shadow-[0_0_35px_rgba(236,72,153,0.25)] bg-[#0f172a]"
      >
        <canvas 
          ref={canvasRef} 
          className="w-full block cursor-crosshair touch-none"
        />

        {/* Active Cheat Notification Banner */}
        {activeCheatNotice && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-pink-600 text-white px-5 py-2 rounded-full font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(236,72,153,0.8)] border border-pink-300 animate-bounce flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>{activeCheatNotice}</span>
          </div>
        )}

        {/* Mission Notice Banner */}
        {missionNotice && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-amber-500/40 text-xs sm:text-sm text-amber-300 font-semibold shadow-lg max-w-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
              <span>{missionNotice}</span>
            </div>
            <button 
              onClick={() => setMissionNotice(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Quick Cheats Bar Overlay (Bottom Right) */}
        <div className="absolute top-3 right-3 hidden sm:flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-sm p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => applyCheat('ASPIRINE')}
            className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-red-400 hover:bg-red-500/20 border border-red-500/30"
          >
            ASPIRINE
          </button>
          <button
            onClick={() => applyCheat('PRECIOUSPROTECTION')}
            className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30"
          >
            ARMOR
          </button>
          <button
            onClick={() => applyCheat('PANZER')}
            className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-amber-400 hover:bg-amber-500/20 border border-amber-500/30"
          >
            PANZER
          </button>
          <button
            onClick={() => applyCheat('LEAVEMEALONE')}
            className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
          >
            NO POLICE
          </button>
          <button
            onClick={onOpenCheats}
            className="px-2 py-1 rounded bg-pink-600 text-[10px] font-bold text-white hover:bg-pink-500"
          >
            {lang === 'ar' ? 'كل الشفرات' : 'All Cheats'}
          </button>
        </div>
      </div>

      {/* Touch / Gamepad Mobile Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
        
        {/* Left Side: Vehicle Entry & Weapon Cycle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVehicleEntry}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              inVehicle 
                ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.4)]' 
                : 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>{inVehicle ? (lang === 'ar' ? 'النزول من السيارة (F)' : 'Exit Car (F)') : (lang === 'ar' ? 'ركوب سيارة قريبة (F)' : 'Enter Car (F)')}</span>
          </button>

          <button
            onClick={() => setCurrentWeaponIdx((prev) => (prev + 1) % WEAPONS_CATALOG.length)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
          >
            <Crosshair className="w-3.5 h-3.5 text-pink-400" />
            <span>{lang === 'ar' ? 'تبديل السلاح (E)' : 'Switch (E)'}</span>
          </button>
        </div>

        {/* Right Side: Driving / Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onMouseDown={() => (touchControlsRef.current.gas = true)}
            onMouseUp={() => (touchControlsRef.current.gas = false)}
            onTouchStart={() => (touchControlsRef.current.gas = true)}
            onTouchEnd={() => (touchControlsRef.current.gas = false)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span>{lang === 'ar' ? 'انطلاق / حركة (W)' : 'Gas (W)'}</span>
          </button>

          <button
            onMouseDown={() => (touchControlsRef.current.drift = true)}
            onMouseUp={() => (touchControlsRef.current.drift = false)}
            onTouchStart={() => (touchControlsRef.current.drift = true)}
            onTouchEnd={() => (touchControlsRef.current.drift = false)}
            className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95"
          >
            <Flame className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تفحيط (Space)' : 'Drift'}</span>
          </button>

          <button
            onMouseDown={() => (touchControlsRef.current.fire = true)}
            onMouseUp={() => (touchControlsRef.current.fire = false)}
            onTouchStart={() => (touchControlsRef.current.fire = true)}
            onTouchEnd={() => (touchControlsRef.current.fire = false)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.4)] active:scale-95"
          >
            <Crosshair className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إطلاق النار' : 'Shoot'}</span>
          </button>
        </div>
      </div>

      {/* Control Help bar */}
      <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span>🎮 <strong>{lang === 'ar' ? 'التحكم:' : 'Controls:'}</strong></span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">W A S D</kbd> {lang === 'ar' ? 'للحركة والتوجيه' : 'Steer / Move'}</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">F / Enter</kbd> {lang === 'ar' ? 'ركوب/نزول السيارة' : 'Enter/Exit'}</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Space</kbd> {lang === 'ar' ? 'إطلاق / تفحيط' : 'Shoot / Drift'}</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Q / E</kbd> {lang === 'ar' ? 'تبديل السلاح' : 'Cycle Weapons'}</span>
        </div>
        <div className="text-pink-400 flex items-center gap-1 font-semibold">
          <span>{lang === 'ar' ? 'اضغط 1-5 لتفعيل الشفرات الفورية' : 'Press 1-5 for instant cheats'}</span>
        </div>
      </div>
    </div>
  );
};
