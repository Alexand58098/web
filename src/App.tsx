import React, { useState, useEffect } from 'react';
import { ActiveTab, Language } from './types';
import { Navbar } from './components/Navbar';
import { GamesPortal } from './components/GamesPortal';
import { AdminControlPanel } from './components/AdminControlPanel';
import { GtaViceCityGame } from './components/GtaViceCityGame';
import { CheatsVault } from './components/CheatsVault';
import { RadioPlayer } from './components/RadioPlayer';
import { ViceCityMap } from './components/ViceCityMap';
import { 
  Gamepad2, 
  Package, 
  Key, 
  Radio, 
  MapPin, 
  Flame, 
  Sparkles,
  Sliders,
  UploadCloud,
  LayoutGrid
} from 'lucide-react';
import { viceAudio } from './utils/audioSynth';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('games-portal');
  const [lang, setLang] = useState<Language>('ar');
  const [isMuted, setIsMuted] = useState(false);
  const [cheatToast, setCheatToast] = useState<string | null>(null);

  // Sync HTML lang and dir
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const handleActivateCheat = (code: string) => {
    viceAudio.playCheatActivated();
    setCheatToast(code);
    setActiveTab('gta-game');
    setTimeout(() => {
      setCheatToast(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0b0c15] text-slate-100 flex flex-col font-['Tajawal',sans-serif]">
      
      {/* Top Navbar with Games Portal and Admin Control Panel */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Global Cheat Toast Notification */}
      {cheatToast && (
        <div className="fixed top-20 right-6 z-50 bg-pink-600 text-white px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(244,63,94,0.7)] border-2 border-pink-300 font-bold text-sm animate-bounce flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-300" />
          <span>
            {lang === 'ar' ? `تم تفعيل شفرة: ${cheatToast}` : `Cheat Activated: ${cheatToast}`}
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Main Games Portal (Home / موقع الألعاب) */}
        {activeTab === 'games-portal' && (
          <GamesPortal
            lang={lang}
            onLaunchViceCity={() => setActiveTab('gta-game')}
            onOpenAdminPanel={() => setActiveTab('admin-panel')}
            onOpenCheats={() => setActiveTab('cheats')}
            onOpenRadio={() => setActiveTab('radio')}
          />
        )}

        {/* Admin Control Panel (لوحة التحكم ورفع ملفات اللعبة) */}
        {(activeTab === 'admin-panel' || activeTab === 'zip-loader') && (
          <AdminControlPanel
            lang={lang}
            onLaunchGame={() => setActiveTab('gta-game')}
            onSelectGameToPlay={(gameId) => {
              if (gameId === 'vice-city-web') {
                setActiveTab('gta-game');
              } else {
                setActiveTab('games-portal');
              }
            }}
          />
        )}

        {/* Vice City 3D Game Player */}
        {activeTab === 'gta-game' && (
          <GtaViceCityGame
            lang={lang}
            onOpenCheats={() => setActiveTab('cheats')}
            onOpenRadio={() => setActiveTab('radio')}
          />
        )}

        {/* Retro Games Collection fallback alias */}
        {activeTab === 'arcade-games' && (
          <GamesPortal
            lang={lang}
            onLaunchViceCity={() => setActiveTab('gta-game')}
            onOpenAdminPanel={() => setActiveTab('admin-panel')}
            onOpenCheats={() => setActiveTab('cheats')}
            onOpenRadio={() => setActiveTab('radio')}
          />
        )}

        {/* Cheats Vault */}
        {activeTab === 'cheats' && (
          <CheatsVault
            lang={lang}
            onActivateCheat={handleActivateCheat}
          />
        )}

        {/* 80s Radio Station Player */}
        {activeTab === 'radio' && (
          <RadioPlayer
            lang={lang}
          />
        )}

        {/* Interactive Vice City Map */}
        {activeTab === 'map' && (
          <ViceCityMap
            lang={lang}
            onTeleportToLocation={() => {
              setActiveTab('gta-game');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-pink-500/20 bg-slate-950/90 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
              <div className="w-full h-full bg-[#0b0c15] rounded-[10px] flex items-center justify-center font-black text-pink-400 text-sm">
                VC
              </div>
            </div>
            <div>
              <span className="font-black italic text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300">
                GAMEVERSE PORTAL
              </span>
              <p className="text-xs text-slate-400">
                {lang === 'ar' ? 'موقع ألعاب فايس سيتي المتكامل مع لوحة تحكم مخصصة لرفع وإدارة ملفات الألعاب' : 'Complete Web Gaming Portal with Admin Files Upload & Management'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
            <button 
              onClick={() => setActiveTab('games-portal')} 
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'موقع الألعاب' : 'Games Portal'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('gta-game')} 
              className="hover:text-pink-400 transition-colors flex items-center gap-1"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'فايس سيتي 3D' : 'Vice City 3D'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('admin-panel')} 
              className="text-pink-400 hover:text-pink-300 font-bold transition-colors flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'لوحة التحكم (رفع الألعاب)' : 'Control Panel (Upload)'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('cheats')} 
              className="hover:text-amber-400 transition-colors"
            >
              {lang === 'ar' ? 'بنك الشفرات' : 'Cheats'}
            </button>

            <button 
              onClick={() => setActiveTab('radio')} 
              className="hover:text-rose-400 transition-colors"
            >
              {lang === 'ar' ? 'الراديو' : 'Radio'}
            </button>

            <button 
              onClick={() => setActiveTab('map')} 
              className="hover:text-purple-400 transition-colors"
            >
              {lang === 'ar' ? 'الخريطة' : 'Radar Map'}
            </button>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right">
            <span>© 2026 GameVerse Portal — Powered by WebAssembly & Gofile API.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
