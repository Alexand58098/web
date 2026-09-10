import React, { useState, useEffect } from 'react';
import { 
  Radio as RadioIcon, 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Music, 
  Disc, 
  Sparkles,
  Waves
} from 'lucide-react';
import { Language, RadioStation } from '../types';
import { RADIO_STATIONS } from '../data/viceCityData';
import { viceAudio } from '../utils/audioSynth';

interface RadioPlayerProps {
  lang: Language;
}

export const RadioPlayer: React.FC<RadioPlayerProps> = ({ lang }) => {
  const [activeStation, setActiveStation] = useState<RadioStation>(RADIO_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [equalizerBars, setEqualizerBars] = useState<number[]>([40, 70, 30, 90, 60, 80, 50, 95]);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setEqualizerBars(
          Array.from({ length: 16 }, () => Math.floor(Math.random() * 85) + 15)
        );
      }, 120);
    } else {
      setEqualizerBars(Array.from({ length: 16 }, () => 10));
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      viceAudio.stopRadio();
      setIsPlaying(false);
    } else {
      viceAudio.startRadio(activeStation.id);
      setIsPlaying(true);
    }
  };

  const handleSelectStation = (station: RadioStation) => {
    setActiveStation(station);
    if (isPlaying) {
      viceAudio.startRadio(station.id);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      
      {/* 80s Boombox Neon Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181829] to-[#0d0f1a] border-2 border-pink-500/30 p-6 sm:p-8 shadow-[0_0_35px_rgba(236,72,153,0.2)]">
        
        {/* Glow ambient lights */}
        <div 
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
          style={{ backgroundColor: activeStation.color }}
        />
        <div 
          className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
          style={{ backgroundColor: activeStation.accentColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Cassette / Station Dial Graphic */}
          <div className="flex items-center gap-5">
            <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-950 border-2 flex items-center justify-center p-2 shadow-lg transition-all ${isPlaying ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]' : 'border-slate-800'}`}>
              <Disc 
                className={`w-14 h-14 sm:w-16 sm:h-16 transition-all ${
                  isPlaying ? 'animate-spin text-pink-400' : 'text-slate-600'
                }`}
                style={{ animationDuration: '3s' }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[9px] font-black uppercase text-cyan-300 font-mono">
                  80s TAPE
                </span>
              </div>
            </div>

            <div className="space-y-1 text-right md:text-left">
              <div className="flex items-center gap-2">
                <span 
                  className="px-2 py-0.5 rounded text-[11px] font-black text-slate-950 uppercase"
                  style={{ backgroundColor: activeStation.color }}
                >
                  {activeStation.frequency}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  DJ: {activeStation.dj}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                {activeStation.name}
              </h2>

              <p className="text-xs sm:text-sm text-cyan-300 font-medium">
                {activeStation.genre}
              </p>

              <div className="text-xs text-slate-400 pt-1 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-pink-400" />
                <span>{activeStation.currentTrack} — {activeStation.artist}</span>
              </div>
            </div>
          </div>

          {/* Right: Master Controls & Equalizer */}
          <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
            
            {/* Animated Equalizer */}
            <div className="flex items-end gap-1.5 h-12 px-4 py-2 bg-slate-950/80 rounded-xl border border-slate-800 w-full md:w-56 justify-center">
              {equalizerBars.map((height, i) => (
                <div
                  key={i}
                  className="w-2 rounded-t transition-all duration-100"
                  style={{
                    height: `${height}%`,
                    backgroundColor: i % 2 === 0 ? activeStation.color : activeStation.accentColor,
                  }}
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className={`w-full md:w-auto px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.5)]'
                  : 'bg-gradient-to-r from-pink-600 to-cyan-500 hover:opacity-90 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
              }`}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>
                {isPlaying 
                  ? (lang === 'ar' ? 'إيقاف الراديو' : 'Stop Station') 
                  : (lang === 'ar' ? 'تشغيل البث الحي 80s' : 'Tune In Live')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stations List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RADIO_STATIONS.map((station) => {
          const isSelected = activeStation.id === station.id;
          return (
            <div
              key={station.id}
              onClick={() => handleSelectStation(station)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 group ${
                isSelected
                  ? 'bg-slate-900 border-pink-500/80 shadow-[0_0_20px_rgba(236,72,153,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: station.color }}
                    />
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {station.frequency}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-pink-300 transition-colors">
                    {station.name}
                  </h3>
                </div>

                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center border"
                  style={{ 
                    backgroundColor: `${station.color}15`,
                    borderColor: `${station.color}40`,
                    color: station.color 
                  }}
                >
                  <RadioIcon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-300 font-semibold">
                  {station.genre}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {station.currentTrack}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>DJ: {station.dj}</span>
                <span className={`font-bold ${isSelected && isPlaying ? 'text-pink-400 animate-pulse' : 'text-slate-500'}`}>
                  {isSelected && isPlaying ? (lang === 'ar' ? 'البث قيد التشغيل' : 'ON AIR') : (lang === 'ar' ? 'اختر للتبديل' : 'Select')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
