import React from 'react';
import { ActiveTab, Language } from '../types';
import { 
  Gamepad2, 
  Package, 
  Key, 
  Radio, 
  MapPin, 
  Flame, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Globe, 
  Sparkles
} from 'lucide-react';
import { viceAudio } from '../utils/audioSynth';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isMuted,
  setIsMuted,
}) => {
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    viceAudio.setMuted(next);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const navItems: { id: ActiveTab; labelAr: string; labelEn: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'gta-game',
      labelAr: 'فايس سيتي ويب',
      labelEn: 'Vice City Web',
      icon: <Gamepad2 className="w-4 h-4 text-pink-400" />,
      badge: 'LIVE',
    },
    {
      id: 'zip-loader',
      labelAr: 'حزمة المطور 77.6MB',
      labelEn: 'Custom ZIP Engine',
      icon: <Package className="w-4 h-4 text-cyan-400" />,
      badge: 'ZIP',
    },
    {
      id: 'arcade-games',
      labelAr: 'ألعاب ريترو',
      labelEn: 'Retro Arcade',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'cheats',
      labelAr: 'شفرات الغش',
      labelEn: 'Cheats Vault',
      icon: <Key className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'map',
      labelAr: 'الخريطة والرادار',
      labelEn: 'Radar Map',
      icon: <MapPin className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'radio',
      labelAr: 'محطات الراديو',
      labelEn: '80s Radio',
      icon: <Radio className="w-4 h-4 text-rose-400" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0c15]/95 backdrop-blur-md border-b border-pink-500/20 shadow-[0_4px_24px_rgba(236,72,153,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('gta-game')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-cyan-400 flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(244,63,94,0.5)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all duration-300">
            <div className="w-full h-full bg-[#0b0c15] rounded-[10px] flex items-center justify-center">
              <span className="text-xl sm:text-2xl transform -rotate-6 font-black tracking-tighter bg-gradient-to-r from-pink-400 to-cyan-300 bg-clip-text text-transparent">
                VC
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-2xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-cyan-300 font-['Chakra_Petch',sans-serif]">
                GTA VICE CITY
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                WEB
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 tracking-wider">
              {lang === 'ar' ? 'منصة ألعاب فايس سيتي ومحاكي الويب' : 'Vice City Web & Retro Gaming Hub'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  viceAudio.playEngineRev(0.2);
                }}
                className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 whitespace-nowrap ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-600/90 to-rose-600/90 text-white shadow-[0_0_14px_rgba(244,63,94,0.4)] border border-pink-400/40' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
                {item.badge && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls (Audio, Language, Fullscreen) */}
        <div className="flex items-center gap-2">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-200 ${
              isMuted 
                ? 'bg-slate-800 text-slate-400 border-slate-700' 
                : 'bg-pink-500/10 text-pink-400 border-pink-500/30 hover:bg-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.2)]'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={lang === 'ar' ? 'ملء الشاشة' : 'Fullscreen'}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:border-cyan-500/50 hover:text-cyan-400 flex items-center gap-1.5 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Scroll Bar */}
      <div className="lg:hidden flex items-center gap-1.5 px-3 py-2 overflow-x-auto border-t border-slate-800/80 bg-slate-950/90 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                viceAudio.playEngineRev(0.2);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-pink-600 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              {item.icon}
              <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
