import React, { useState, useEffect } from 'react';
import { ActiveTab, Language } from './types';
import { Navbar } from './components/Navbar';
import { GtaViceCityGame } from './components/GtaViceCityGame';
import { ZipEngineLoader } from './components/ZipEngineLoader';
import { CheatsVault } from './components/CheatsVault';
import { RadioPlayer } from './components/RadioPlayer';
import { ViceCityMap } from './components/ViceCityMap';
import { RetroGamesCollection } from './components/RetroGamesCollection';
import { 
  Gamepad2, 
  Package, 
  Key, 
  Radio, 
  MapPin, 
  Flame, 
  Sparkles,
  Heart,
  ShieldCheck,
  Disc,
  ExternalLink
} from 'lucide-react';
import { viceAudio } from './utils/audioSynth';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('gta-game');
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
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Global Cheat Activation Toast */}
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
        {activeTab === 'gta-game' && (
          <GtaViceCityGame
            lang={lang}
            onOpenCheats={() => setActiveTab('cheats')}
            onOpenRadio={() => setActiveTab('radio')}
          />
        )}

        {activeTab === 'zip-loader' && (
          <ZipEngineLoader
            lang={lang}
            onLaunchMainGame={() => setActiveTab('gta-game')}
          />
        )}

        {activeTab === 'cheats' && (
          <CheatsVault
            lang={lang}
            onActivateCheat={handleActivateCheat}
          />
        )}

        {activeTab === 'radio' && (
          <RadioPlayer
            lang={lang}
          />
        )}

        {activeTab === 'map' && (
          <ViceCityMap
            lang={lang}
            onTeleportToLocation={() => {
              setActiveTab('gta-game');
            }}
          />
        )}

        {activeTab === 'arcade-games' && (
          <RetroGamesCollection
            lang={lang}
            onSelectGame={(gameId) => {
              if (gameId === 'zip-engine-vc') {
                setActiveTab('zip-loader');
              } else {
                setActiveTab('gta-game');
              }
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-pink-500/20 bg-slate-950/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-cyan-400 p-0.5 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
              <div className="w-full h-full bg-[#0b0c15] rounded-[10px] flex items-center justify-center font-black text-pink-400 text-sm">
                VC
              </div>
            </div>
            <div>
              <span className="font-black italic text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300">
                GTA VICE CITY WEB
              </span>
              <p className="text-xs text-slate-400">
                {lang === 'ar' ? 'منصة تشغيل ألعاب فايس سيتي ومحاكي الويب للثنائية والأبعاد الثلاثية' : 'Vice City Web Browser Gaming & WASM Runtime Platform'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
            <button 
              onClick={() => setActiveTab('gta-game')} 
              className="hover:text-pink-400 transition-colors"
            >
              {lang === 'ar' ? 'اللعبة الرئيسية' : 'Main Game'}
            </button>
            <button 
              onClick={() => setActiveTab('zip-loader')} 
              className="hover:text-cyan-400 transition-colors"
            >
              gtavc-full-github.zip (77.6MB)
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
              {lang === 'ar' ? 'الراديو الحي' : '80s Radio'}
            </button>
            <button 
              onClick={() => setActiveTab('map')} 
              className="hover:text-purple-400 transition-colors"
            >
              {lang === 'ar' ? 'الخريطة' : 'Radar Map'}
            </button>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right">
            <span>© 2026 Vice City Web Edition. Powered by WebAssembly & Canvas.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
