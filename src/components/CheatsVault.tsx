import React, { useState } from 'react';
import { Key, Copy, Check, Sparkles, Shield, Flame, Car, AlertTriangle, Globe } from 'lucide-react';
import { Language, CheatCode } from '../types';
import { VICE_CITY_CHEATS } from '../data/viceCityData';
import { viceAudio } from '../utils/audioSynth';

interface CheatsVaultProps {
  lang: Language;
  onActivateCheat?: (code: string) => void;
}

export const CheatsVault: React.FC<CheatsVaultProps> = ({
  lang,
  onActivateCheat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', nameAr: 'جميع الشفرات', nameEn: 'All Cheats', icon: <Key className="w-4 h-4 text-pink-400" /> },
    { id: 'health', nameAr: 'الصحة والدروع', nameEn: 'Health & Armor', icon: <Shield className="w-4 h-4 text-cyan-400" /> },
    { id: 'weapons', nameAr: 'الأسلحة والذخيرة', nameEn: 'Weapons', icon: <Flame className="w-4 h-4 text-red-400" /> },
    { id: 'vehicles', nameAr: 'السيارات والدبابات', nameEn: 'Vehicles', icon: <Car className="w-4 h-4 text-amber-400" /> },
    { id: 'wanted', nameAr: 'مستوى الشرطة', nameEn: 'Wanted Heat', icon: <AlertTriangle className="w-4 h-4 text-emerald-400" /> },
    { id: 'world', nameAr: 'العالم والطقس', nameEn: 'World & Fun', icon: <Globe className="w-4 h-4 text-purple-400" /> },
  ];

  const filteredCheats = VICE_CITY_CHEATS.filter((cheat) => {
    const matchesCategory = selectedCategory === 'all' || cheat.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      cheat.code.toLowerCase().includes(query) ||
      cheat.nameAr.toLowerCase().includes(query) ||
      cheat.nameEn.toLowerCase().includes(query) ||
      cheat.descriptionAr.toLowerCase().includes(query) ||
      cheat.descriptionEn.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    viceAudio.playCheatActivated();
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTriggerInGame = (code: string) => {
    if (onActivateCheat) {
      onActivateCheat(code);
    } else {
      viceAudio.playCheatActivated();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-pink-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-black">
              VAULT
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {lang === 'ar' ? 'بنك شفرات وأسرار GTA Vice City الكاملة' : 'Complete GTA Vice City Cheats Vault'}
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">
            {lang === 'ar' 
              ? 'جميع كلمات السر الأصلية مع إمكانية التفعيل الفوري في لعبة الويب بنقرة واحدة أو نسخها لجهازك.'
              : 'All official Vice City cheat codes with 1-click in-game activation and instant copy.'}
          </p>
        </div>

        {/* Search input */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث عن شفرة أو ميزة...' : 'Search cheats...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat.icon}
            <span>{lang === 'ar' ? cat.nameAr : cat.nameEn}</span>
          </button>
        ))}
      </div>

      {/* Cheats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCheats.map((cheat) => (
          <div
            key={cheat.id}
            className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-pink-500/40 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all flex flex-col justify-between gap-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300">
                  {cheat.code}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                  {cheat.category}
                </span>
              </div>

              <h4 className="font-bold text-white text-sm">
                {lang === 'ar' ? cheat.nameAr : cheat.nameEn}
              </h4>

              <p className="text-slate-400 text-xs leading-relaxed">
                {lang === 'ar' ? cheat.descriptionAr : cheat.descriptionEn}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => handleTriggerInGame(cheat.code)}
                className="flex-1 py-2 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>{lang === 'ar' ? 'تفعيل في اللعبة' : 'Activate in Game'}</span>
              </button>

              <button
                onClick={() => handleCopy(cheat.code)}
                title={lang === 'ar' ? 'نسخ الشفرة' : 'Copy Code'}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                {copiedCode === cheat.code ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
