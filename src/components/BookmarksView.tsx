import React from 'react';
import { Article } from '../types';
import { ArticleCard } from './ArticleCard';
import { Bookmark, ArrowRight, Compass } from 'lucide-react';

interface BookmarksViewProps {
  bookmarkedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onExploreClick: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedArticles,
  onSelectArticle,
  onToggleBookmark,
  onExploreClick
}) => {
  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-arabic flex items-center gap-3 text-stone-900 dark:text-stone-100">
            <Bookmark className="w-6 h-6 text-amber-500 fill-current" />
            <span>قائمتي المحفوظة</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            المقالات والأفكار التي قمت بحفظها للرجوع إليها في أي وقت
          </p>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold">
          {bookmarkedArticles.length} مقالات محفوظة
        </span>
      </div>

      {/* Grid or Empty State */}
      {bookmarkedArticles.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
            لا توجد مقالات محفوظة بعد
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-6">
            أثناء تصفحك للمقالات، اضغط على أيقونة الحفظ لتجميع ما يثير اهتمامك هنا للقراءة لاحقاً.
          </p>
          <button
            onClick={onExploreClick}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center gap-2 mx-auto active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>استكشف المقالات الآن</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelectArticle={onSelectArticle}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};
