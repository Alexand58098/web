import React from 'react';
import { Category } from '../types';
import { Sparkles, TrendingUp, Clock, Heart, Filter } from 'lucide-react';

interface CategoriesFilterProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  categoryCounts: Record<Category, number>;
  sortBy: 'latest' | 'popular' | 'likes';
  onSortChange: (sort: 'latest' | 'popular' | 'likes') => void;
}

export const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="py-6 border-b border-stone-200/80 dark:border-stone-800/80">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                  isSelected 
                    ? 'bg-white/20 dark:bg-black/20 text-current font-bold' 
                    : 'bg-stone-200/70 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown / Pills */}
        <div className="flex items-center gap-2 shrink-0 text-xs sm:text-sm">
          <span className="text-stone-400 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" />
            ترتيب:
          </span>
          <div className="bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => onSortChange('latest')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                sortBy === 'latest'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Clock className="w-3 h-3" />
              الأحدث
            </button>
            <button
              onClick={() => onSortChange('popular')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                sortBy === 'popular'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              الأكثر قراءة
            </button>
            <button
              onClick={() => onSortChange('likes')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                sortBy === 'likes'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Heart className="w-3 h-3" />
              التفاعل
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
