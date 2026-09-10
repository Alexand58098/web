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
  Zap
} from 'lucide-react';
import { Language, GameItem } from '../types';
import { RETRO_GAMES_COLLECTION } from '../data/viceCityData';
import { viceAudio } from '../utils/audioSynth';

interface RetroGamesCollectionProps {
  lang: Language;
  onSelectGame: (gameId: string) => void;
}

export const RetroGamesCollection: React.FC<RetroGamesCollectionProps> = ({
  lang,
  onSelectGame,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [playingMiniGame, setPlayingMiniGame] = useState<string | null>(null);

  // Simple High Score state for arcade mini-game
  const [arcadeScore, setArcadeScore] = useState(0);

  const categories = [
    { id: 'all', labelAr: 'كافة الألعاب', labelEn: 'All Games' },
    { id: 'vice-city', labelAr: 'فايس سيتي & الحزم', labelEn: 'Vice City & WASM' },
    { id: 'racing', labelAr: 'سباقات 80s', labelEn: '80s Racing' },
    { id: 'action', labelAr: 'أكشن ومهمات', labelEn: 'Action Missions' },
    { id: 'strategy', labelAr: 'عصابات واستراتيجية', labelEn: 'Gang Wars' },
    { id: 'arcade', labelAr: 'آركيد كلاسيك', labelEn: 'Arcade Classics' },
  ];

  const filteredGames = RETRO_GAMES_COLLECTION.filter((g) => {
    if (activeCategory === 'all') return true;
    return g.category === activeCategory;
  });

  const handleLaunch = (game: GameItem) => {
    viceAudio.playEngineRev(0.7);
    if (game.id === 'vice-city-web' || game.id === 'zip-engine-vc') {
      onSelectGame(game.id);
    } else {
      setPlayingMiniGame(game.id);
      setArcadeScore(Math.floor(Math.random() * 800) + 200);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-pink-950/40 p-6 sm:p-8 rounded-3xl border border-pink-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_25px_rgba(236,72,153,0.15)]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-pink-500/20 text-pink-300 border border-pink-500/40">
              RETRO ARCADE
            </span>
            <span className="text-xs text-cyan-400 font-bold">
              {lang === 'ar' ? 'مكتبة ألعاب الويب الكلاسيكية' : 'Classic Web Games Collection'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {lang === 'ar' ? 'صالة ألعاب فايس سيتي وميامي ريترو' : 'Vice City & Retro Arcade Games'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {lang === 'ar'
              ? 'مجموعة ألعاب متكاملة ومستوحاة من أجواء الثمانينات: مطاردات الشرطة، سباقات الشوارع، طائرات الهدم، وحروب العصابات.'
              : 'Curated 80s arcade and sandbox games with instant in-browser play, high scores, and retro synths.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">{lang === 'ar' ? 'مجموع اللاعبين' : 'Total Players'}</div>
            <div className="text-lg font-black text-pink-400 font-mono">600K+</div>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">{lang === 'ar' ? 'التقييم العام' : 'Rating'}</div>
            <div className="text-lg font-black text-amber-400 font-mono">★ 4.9</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {lang === 'ar' ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Games Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="group relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all flex flex-col justify-between"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Tag & Badge */}
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
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-amber-300 text-xs font-bold border border-slate-800">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{game.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-white group-hover:text-pink-300 transition-colors">
                  {lang === 'ar' ? game.title : game.titleEn}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {lang === 'ar' ? game.description : game.descriptionEn}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  <span>{game.plays.toLocaleString()} {lang === 'ar' ? 'لاعب' : 'plays'}</span>
                </div>

                <button
                  onClick={() => handleLaunch(game)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{lang === 'ar' ? 'العب الآن' : 'Play Now'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini-Game Modal / Player if launched */}
      {playingMiniGame && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-pink-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(236,72,153,0.4)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-pink-400" />
                <h3 className="font-black text-white text-lg">
                  {lang === 'ar' ? 'جلسة الآركيد السريعة' : 'Arcade Quick Session'}
                </h3>
              </div>
              <button
                onClick={() => setPlayingMiniGame(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[16/9] bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <Zap className="w-12 h-12 text-yellow-400 animate-bounce" />
              <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300">
                {lang === 'ar' ? 'النقاط المسجلة في الجولة:' : 'Current Session Score:'} {arcadeScore} PTS
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                {lang === 'ar' 
                  ? 'تم تسجيل نتيجتك بنجاح في صدارة لاعبي فايس سيتي! يمكنك الانتقال إلى لعبة العالم المفتوح الكاملة في أي وقت.'
                  : 'Your score has been registered! You can switch back to the full open-world simulation anytime.'}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setArcadeScore((prev) => prev + 150)}
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تعزيز النقاط +150' : 'Score Boost +150'}</span>
              </button>
              <button
                onClick={() => setPlayingMiniGame(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
