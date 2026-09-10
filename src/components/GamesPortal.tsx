import React, { useState } from 'react';
import { 
  Play, 
  Flame, 
  Trophy, 
  Gamepad2, 
  Star, 
  Sparkles, 
  Users, 
  RotateCcw,
  Zap,
  Search,
  Sliders,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  Award,
  Radio,
  Key
} from 'lucide-react';
import { Language, GameItem } from '../types';
import { RETRO_GAMES_COLLECTION } from '../data/viceCityData';
import { viceAudio } from '../utils/audioSynth';

interface GamesPortalProps {
  lang: Language;
  onLaunchViceCity: () => void;
  onOpenAdminPanel: () => void;
  onOpenCheats: () => void;
  onOpenRadio: () => void;
}

export const GamesPortal: React.FC<GamesPortalProps> = ({
  lang,
  onLaunchViceCity,
  onOpenAdminPanel,
  onOpenCheats,
  onOpenRadio
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingMiniGame, setPlayingMiniGame] = useState<GameItem | null>(null);
  const [miniGameScore, setMiniGameScore] = useState(0);

  const categories = [
    { id: 'all', labelAr: 'كافة الألعاب (All)', labelEn: 'All Games' },
    { id: 'vice-city', labelAr: 'فايس سيتي & WASM', labelEn: 'Vice City 3D' },
    { id: 'racing', labelAr: 'سباقات 80s ريترو', labelEn: 'Retro Racing' },
    { id: 'action', labelAr: 'أكشن ومطاردات', labelEn: 'Action & Chase' },
    { id: 'strategy', labelAr: 'حروب العصابات', labelEn: 'Gang Wars' },
    { id: 'arcade', labelAr: 'آركيد كلاسيك', labelEn: 'Classic Arcade' },
  ];

  const filteredGames = RETRO_GAMES_COLLECTION.filter((g) => {
    const matchesCat = activeCategory === 'all' || g.category === activeCategory;
    const matchesSearch = 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleLaunchGame = (game: GameItem) => {
    viceAudio.playEngineRev(0.8);
    if (game.id === 'vice-city-web' || game.id === 'zip-engine-vc') {
      onLaunchViceCity();
    } else {
      setPlayingMiniGame(game);
      setMiniGameScore(Math.floor(Math.random() * 950) + 150);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      
      {/* Featured Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#130d24] to-[#1f0e38] border-2 border-pink-500/30 p-6 sm:p-10 shadow-[0_0_40px_rgba(236,72,153,0.25)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-pink-500/20 text-pink-300 border border-pink-500/50 flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-pink-400" />
                {lang === 'ar' ? 'اللعبة الأكثر شعبية اليوم' : "Today's Featured Game"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                WASM 3D OPEN WORLD
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-['Chakra_Petch',sans-serif]">
              GTA VICE CITY: NEON SUNSET
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'استمتع بالعالم المفتوح الكامل لمدينة ميامي في الثمانينات: قيادة سيارات السباق، الهروب من دوريات الشرطة، والمهام الحماسية في متصفحك مباشرة مع دعم فك ملفات اللعبة الحقيقية عبر لوحة التحكم.'
                : 'Experience the 1980s retro Miami sandbox: drive sports cars, evade police cruisers, and conquer story missions directly in your browser.'}
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchViceCity}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-cyan-500 hover:opacity-95 text-white font-black text-base shadow-[0_0_30px_rgba(244,63,94,0.6)] flex items-center gap-2.5 transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{lang === 'ar' ? 'العب فايس سيتي الآن' : 'Play Vice City Now'}</span>
              </button>

              <button
                onClick={onOpenAdminPanel}
                className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'لوحة التحكم ورفع الملفات' : 'Upload Game Files (Admin)'}</span>
              </button>
            </div>
          </div>

          {/* Hero Stats Card */}
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto shrink-0">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'ar' ? 'اللاعبين النشطين' : 'Active Players'}
              </div>
              <div className="text-2xl font-black text-pink-400 font-mono">18,420</div>
              <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {lang === 'ar' ? 'أونلاين الآن' : 'Live in-browser'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'ar' ? 'تقييم اللاعبين' : 'Rating'}
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">★ 4.98</div>
              <div className="text-[10px] text-slate-400">
                {lang === 'ar' ? 'من 50,000+ صوت' : '50K+ reviews'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'ar' ? 'شفرات الغش' : 'Cheats'}
              </div>
              <div className="text-2xl font-black text-cyan-400 font-mono">35+</div>
              <button onClick={onOpenCheats} className="text-[10px] text-cyan-300 hover:underline">
                {lang === 'ar' ? 'عرض الشفرات' : 'View Cheats'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'ar' ? 'محطات الراديو' : 'Radio'}
              </div>
              <div className="text-2xl font-black text-rose-400 font-mono">7 FM</div>
              <button onClick={onOpenRadio} className="text-[10px] text-rose-300 hover:underline">
                {lang === 'ar' ? 'تشغيل الراديو' : 'Play Radio'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث عن ألعاب، سباقات، مطاردات، أو مغامرات...' : 'Search games...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 pr-10 pl-4 py-2.5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              {lang === 'ar' ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Games Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-pink-400" />
            <h2 className="text-xl font-black text-white">
              {lang === 'ar' ? 'ألعاب المنصة المتاحة للعب المباشر' : 'Instant Playable Games'}
            </h2>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-slate-300 font-mono">
              {filteredGames.length}
            </span>
          </div>

          <button
            onClick={onOpenAdminPanel}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
          >
            <span>{lang === 'ar' ? 'رفع حزمة أو ملف لعبة جديد' : 'Upload Game Files'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Badge & Category Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-slate-950/80 backdrop-blur-sm text-cyan-300 border border-cyan-500/30">
                    {game.tag}
                  </span>
                  {game.badge && (
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-pink-600 text-white shadow-md animate-pulse">
                      {game.badge}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-amber-300 text-xs font-bold border border-slate-800">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{game.rating}</span>
                </div>
              </div>

              {/* Game Info & Launch Button */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-white group-hover:text-pink-300 transition-colors">
                    {lang === 'ar' ? game.title : game.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {lang === 'ar' ? game.description : game.descriptionEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Users className="w-3.5 h-3.5 text-pink-400" />
                    <span>{game.plays.toLocaleString()} {lang === 'ar' ? 'لاعب' : 'plays'}</span>
                  </div>

                  <button
                    onClick={() => handleLaunchGame(game)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{lang === 'ar' ? 'العب الآن' : 'Play Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Playable Mini-Game Modal */}
      {playingMiniGame && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-pink-500/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-[0_0_50px_rgba(236,72,153,0.4)] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-black text-white">
                  {lang === 'ar' ? playingMiniGame.title : playingMiniGame.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setPlayingMiniGame(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulated Arcade Canvas */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-pink-500/30 overflow-hidden flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 animate-pulse">
                <Zap className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-white text-base">
                  {lang === 'ar' ? 'جلسة الآركيد الكلاسيكية نشطة' : 'Arcade Session Live'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'استخدم أزرار الأسهم ومفتاح المسافة للتصويب والانجراف' : 'Use arrow keys & spacebar to steer and fire'}
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <span className="text-xs text-slate-400">{lang === 'ar' ? 'النقاط المسجلة:' : 'Current Score:'}</span>
                <span className="text-lg font-black text-cyan-300 font-mono">{miniGameScore} PTS</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  viceAudio.playGunshot('uzi');
                  setMiniGameScore((prev) => prev + 120);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'ar' ? 'محاولة جديدة / تسجيل نقطة' : 'Score More'}</span>
              </button>
              <button
                onClick={() => {
                  setPlayingMiniGame(null);
                  onLaunchViceCity();
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{lang === 'ar' ? 'الانتقال إلى فايس سيتي 3D' : 'Open Vice City 3D'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
