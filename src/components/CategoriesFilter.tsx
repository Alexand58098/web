import React from 'react';
import { Category } from '../types';
import { TrendingUp, Clock, Heart, Filter, LayoutGrid, List } from 'lucide-react';

interface CategoriesFilterProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  categoryCounts: Record<Category, number>;
  sortBy: 'latest' | 'popular' | 'likes';
  onSortChange: (sort: 'latest' | 'popular' | 'likes') => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  sortBy,
  onSortChange,
  viewMode = 'grid',
  onViewModeChange
}) => {
  return (
    <div className="py-4 border-b border-stone-200/80 dark:border-stone-800/80">
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
                    ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
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

        {/* Right Tools: Sorting & Layout View Toggle */}
        <div className="flex items-center gap-3 shrink-0 text-xs sm:text-sm">
          
          {/* Sort Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 flex items-center gap-1 font-medium hidden sm:inline-flex text-xs">
              <Filter className="w-3.5 h-3.5" />
              ترتيب:
            </span>
            <div className="bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => onSortChange('latest')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-xs ${
                  sortBy === 'latest'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-amber-400 shadow-xs font-semibold'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="ترتيب حسب تاريخ النشر الأحدث"
              >
                <Clock className="w-3 h-3" />
                <span>الأحدث</span>
              </button>
              <button
                onClick={() => onSortChange('popular')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-xs ${
                  sortBy === 'popular'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-amber-400 shadow-xs font-semibold'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="ترتيب حسب عدد القراءات"
              >
                <TrendingUp className="w-3 h-3" />
                <span>الأكثر قراءة</span>
              </button>
              <button
                onClick={() => onSortChange('likes')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-xs ${
                  sortBy === 'likes'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-amber-400 shadow-xs font-semibold'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="ترتيب حسب التفاعل والإعجابات"
              >
                <Heart className="w-3 h-3" />
                <span>التفاعل</span>
              </button>
            </div>
          </div>

          {/* View Mode Toggle (Grid vs Compact List) */}
          {onViewModeChange && (
            <div className="bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl flex items-center gap-1 border border-stone-200/50 dark:border-stone-700/50">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                }`}
                title="عرض بطاقات شبكية"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                }`}
                title="عرض تحريري متراص"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
