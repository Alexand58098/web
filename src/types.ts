export type Language = 'ar' | 'en';

export type GameCategory = 'all' | 'vice-city' | 'racing' | 'action' | 'arcade' | 'strategy';

export interface GameItem {
  id: string;
  title: string;
  titleEn: string;
  category: GameCategory;
  description: string;
  descriptionEn: string;
  thumbnail: string;
  badge?: string;
  rating: number;
  plays: number;
  tag: string;
  featured?: boolean;
}

export interface Weapon {
  id: string;
  name: string;
  nameEn: string;
  type: 'melee' | 'pistol' | 'smg' | 'rifle' | 'heavy';
  damage: number;
  fireRate: number;
  ammo: number;
  maxAmmo: number;
  color: string;
  range: number;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'supercar' | 'bike' | 'police' | 'tank' | 'copter';
  topSpeed: number;
  handling: number;
  armor: number;
  color: string;
  secondaryColor?: string;
}

export interface CheatCode {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  category: 'health' | 'weapons' | 'vehicles' | 'wanted' | 'world';
  descriptionAr: string;
  descriptionEn: string;
}

export interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  genre: string;
  dj: string;
  color: string;
  accentColor: string;
  currentTrack: string;
  artist: string;
}

export interface MapPin {
  id: string;
  name: string;
  nameEn: string;
  district: string;
  type: 'safehouse' | 'weapon' | 'paynspray' | 'package' | 'asset' | 'mission';
  x: number; // 0 - 100%
  y: number; // 0 - 100%
  description: string;
  reward?: string;
}

export interface GameMission {
  id: string;
  number: number;
  title: string;
  titleEn: string;
  boss: string;
  reward: number;
  description: string;
  objective: string;
  district: string;
  completed: boolean;
}

export interface ZipFileInfo {
  name: string;
  size: string;
  rawBytes: number;
  id: string;
  shareCode: string;
  md5: string;
  gofileUrl: string;
  extractedFilesCount: number;
  extractedFiles: string[];
  status: 'idle' | 'reading' | 'verified' | 'ready' | 'error';
  errorMessage?: string;
}

export type ActiveTab = 'gta-game' | 'zip-loader' | 'cheats' | 'radio' | 'map' | 'arcade-games' | 'about';
