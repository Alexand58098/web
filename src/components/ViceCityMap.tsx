import React, { useState } from 'react';
import { 
  MapPin, 
  Home, 
  Crosshair, 
  Wrench, 
  Briefcase, 
  Compass, 
  Sparkles,
  ExternalLink,
  Zap
} from 'lucide-react';
import { Language, MapPin as PinType } from '../types';
import { VICE_CITY_LOCATIONS } from '../data/viceCityData';
import { viceAudio } from '../utils/audioSynth';

interface ViceCityMapProps {
  lang: Language;
  onTeleportToLocation?: (x: number, y: number) => void;
}

export const ViceCityMap: React.FC<ViceCityMapProps> = ({
  lang,
  onTeleportToLocation,
}) => {
  const [selectedPin, setSelectedPin] = useState<PinType>(VICE_CITY_LOCATIONS[0]);
  const [filterType, setFilterType] = useState<string>('all');

  const filterOptions = [
    { id: 'all', labelAr: 'كافة المواقع', labelEn: 'All Points', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'safehouse', labelAr: 'الملاذات الآمنة', labelEn: 'Safehouses', icon: <Home className="w-3.5 h-3.5 text-pink-400" /> },
    { id: 'asset', labelAr: 'القصور والشركات', labelEn: 'Assets & Mansions', icon: <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'weapon', labelAr: 'متاجر الأسلحة', labelEn: 'Gun Shops', icon: <Crosshair className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'paynspray', labelAr: 'ورش الدهان والشرطة', labelEn: "Pay 'n' Spray", icon: <Wrench className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  const filteredPins = VICE_CITY_LOCATIONS.filter((pin) => {
    if (filterType === 'all') return true;
    return pin.type === filterType;
  });

  const handleSelectPin = (pin: PinType) => {
    setSelectedPin(pin);
    viceAudio.playEngineRev(0.3);
  };

  const handleTeleport = () => {
    viceAudio.playCheatActivated();
    if (onTeleportToLocation) {
      // Map percentage (0-100) to sandbox coords
      const worldX = (selectedPin.x / 100) * 1200;
      const worldY = (selectedPin.y / 100) * 1000;
      onTeleportToLocation(worldX, worldY);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{lang === 'ar' ? 'رادار وخريطة فايس سيتي التفاعلية' : 'Interactive Vice City Radar & Map'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar' ? 'استكشف معالم المدينة، القصور، ورش الدهان، ومتاجر الأسلحة ومواقع المهمات الرئيسية.' : 'Explore districts, safehouses, assets, Ammu-Nation stores, and mission locations.'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilterType(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                filterType === opt.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {opt.icon}
              <span>{lang === 'ar' ? opt.labelAr : opt.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Viewer & Info Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Map Canvas Representation */}
        <div className="lg:col-span-8 relative aspect-[16/10] bg-[#0c1427] rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] p-4 select-none">
          
          {/* Water background & Islands SVG outline */}
          <div className="absolute inset-0 opacity-40">
            {/* Ocean Waves Grid */}
            <div className="w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          {/* West Island SVG (Downtown, Little Havana) */}
          <div className="absolute left-[12%] top-[10%] w-[32%] h-[80%] rounded-[40px] bg-slate-800/80 border border-slate-700 pointer-events-none transform -rotate-3">
            <div className="p-3 text-[10px] font-mono text-slate-400 font-bold uppercase">
              West Island (Downtown / Havana)
            </div>
          </div>

          {/* Starfish Island (Middle) */}
          <div className="absolute left-[47%] top-[40%] w-[16%] h-[26%] rounded-full bg-emerald-950/60 border border-emerald-500/40 pointer-events-none shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center">
            <span className="text-[9px] font-mono font-bold text-emerald-300 text-center px-1">
              Starfish Island
            </span>
          </div>

          {/* East Island SVG (Ocean Beach, Vice Point) */}
          <div className="absolute right-[12%] top-[14%] w-[26%] h-[74%] rounded-[35px] bg-pink-950/40 border border-pink-500/30 pointer-events-none transform rotate-2">
            <div className="p-3 text-[10px] font-mono text-pink-300 font-bold uppercase">
              East Beach (Ocean Beach / Vice Point)
            </div>
          </div>

          {/* Connecting Bridges */}
          <div className="absolute left-[40%] top-[48%] w-[10%] h-2 bg-amber-500/60 pointer-events-none" />
          <div className="absolute left-[60%] top-[48%] w-[15%] h-2 bg-amber-500/60 pointer-events-none" />

          {/* Interactive Pins */}
          {filteredPins.map((pin) => {
            const isSelected = selectedPin.id === pin.id;
            return (
              <button
                key={pin.id}
                onClick={() => handleSelectPin(pin)}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 z-20 group ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                <div className={`relative p-2 rounded-xl border flex items-center justify-center shadow-lg transition-all ${
                  isSelected 
                    ? 'bg-pink-600 border-white text-white shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse' 
                    : 'bg-slate-900/90 border-cyan-400/50 text-cyan-300 hover:border-cyan-300'
                }`}>
                  {pin.type === 'safehouse' && <Home className="w-3.5 h-3.5" />}
                  {pin.type === 'asset' && <Briefcase className="w-3.5 h-3.5" />}
                  {pin.type === 'weapon' && <Crosshair className="w-3.5 h-3.5" />}
                  {pin.type === 'paynspray' && <Wrench className="w-3.5 h-3.5" />}
                  {pin.type === 'mission' && <Sparkles className="w-3.5 h-3.5" />}
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block whitespace-nowrap bg-slate-950 text-white px-2.5 py-1 rounded-md text-[10px] font-bold border border-slate-700 shadow-xl pointer-events-none">
                  {lang === 'ar' ? pin.name : pin.nameEn}
                </div>
              </button>
            );
          })}

          {/* Mini Radar Overlay (Bottom Left) */}
          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-cyan-400">
            RADAR: VICE CITY SECTOR 86
          </div>
        </div>

        {/* Selected Location Details Card */}
        <div className="lg:col-span-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-pink-500/20 text-pink-300 border border-pink-500/40">
                {selectedPin.district}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                COORD: {selectedPin.x}% / {selectedPin.y}%
              </span>
            </div>

            <h3 className="text-lg font-black text-white">
              {lang === 'ar' ? selectedPin.name : selectedPin.nameEn}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedPin.description}
            </p>

            {selectedPin.reward && (
              <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30 text-xs text-emerald-400">
                <strong>{lang === 'ar' ? 'المكافأة والمميزات:' : 'Perks & Rewards:'}</strong> {selectedPin.reward}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800">
            <button
              onClick={handleTeleport}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>{lang === 'ar' ? 'الانتقال الفوري إلى هذا الموقع' : 'Fast-Travel Tommy Here'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
