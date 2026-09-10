import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Zap, Award, Compass, ArrowLeft, TrendingUp } from 'lucide-react';

interface EditorialTickerProps {
  totalArticlesCount: number;
  onQuickFilter: (filter: 'all' | 'featured' | 'quick' | 'popular') => void;
  activeQuickFilter: 'all' | 'featured' | 'quick' | 'popular';
}

const INSPIRATIONAL_QUOTES = [
  { text: 'الاجتهاد في طلب المعرفة وتطبيقها هو الفارق الحقيقي بين الفكرة والريادة.', source: 'ميثاق المجتهد' },
  { text: 'البرمجة في عصر الذكاء الاصطناعي هي فن صياغة القيود وهندسة المعمارية الرصينة.', source: 'رأي المجتهد' },
  { text: 'التركيز العميق هو العملة الأكثر ندرة وقيمة في القرن الحادي والعشرين.', source: 'فلسفة الإنتاجية' },
  { text: 'ابنِ حلولاً بسيطة لأوجاع حقيقية، فالتعقيد ليس دليلاً على الاحترافية.', source: 'دليل ريادة الأعمال' }
];

export const EditorialTicker: React.FC<EditorialTickerProps> = ({
  totalArticlesCount,
  onQuickFilter,
  activeQuickFilter
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % INSPIRATIONAL_QUOTES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentQuote = INSPIRATIONAL_QUOTES[quoteIndex];

  return (
    <div className="my-4 rounded-2xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-md border border-stone-200/80 dark:border-stone-800/80 p-3 sm:p-4 shadow-xs transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Dynamic Rotating Thought / Pulse */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                إضاءة المجتهد:
              </span>
              <span className="text-[10px] text-stone-400 font-medium">
                ({currentQuote.source})
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 truncate mt-0.5 font-arabic">
              "{currentQuote.text}"
            </p>
          </div>
        </div>

        {/* Right: Quick Action Knowledge Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none shrink-0 text-xs">
          <button
            onClick={() => onQuickFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeQuickFilter === 'all'
                ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 font-bold shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>كافة المقالات</span>
            <span className="text-[10px] opacity-75 font-mono">({totalArticlesCount})</span>
          </button>

          <button
            onClick={() => onQuickFilter('featured')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeQuickFilter === 'featured'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>مختارات المجتهد</span>
          </button>

          <button
            onClick={() => onQuickFilter('quick')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeQuickFilter === 'quick'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>قراءات مركزة (≤ 5 دقائق)</span>
          </button>

          <button
            onClick={() => onQuickFilter('popular')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activeQuickFilter === 'popular'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>الأكثر تداولاً</span>
          </button>
        </div>

      </div>
    </div>
  );
};
