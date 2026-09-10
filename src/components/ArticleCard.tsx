import React from 'react';
import { Article } from '../types';
import { Clock, Heart, Eye, Bookmark, Edit3, Trash2, Sparkles, ArrowLeft } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  isAdmin?: boolean;
  onEditArticle?: (article: Article, e: React.MouseEvent) => void;
  onDeleteArticle?: (article: Article, e: React.MouseEvent) => void;
  viewMode?: 'grid' | 'list';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  isAdmin,
  onEditArticle,
  onDeleteArticle,
  viewMode = 'grid'
}) => {
  // If Compact List Mode
  if (viewMode === 'list') {
    return (
      <article className="group relative rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        
        {/* Admin Floating Control */}
        {isAdmin && (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-stone-950/90 text-white backdrop-blur-md px-2 py-0.5 rounded-lg shadow-sm border border-amber-500/40 text-[10px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditArticle?.(article, e);
              }}
              className="p-0.5 hover:text-amber-400 transition-colors"
              title="تعديل"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteArticle?.(article, e);
              }}
              className="p-0.5 hover:text-rose-400 transition-colors"
              title="حذف"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Thumbnail */}
        <div 
          onClick={() => onSelectArticle(article)}
          className="relative w-full sm:w-44 sm:h-28 aspect-16/9 sm:aspect-auto rounded-xl overflow-hidden cursor-pointer bg-stone-100 dark:bg-stone-800 shrink-0"
        >
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {article.featured && (
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-stone-950 flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              مميز
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-semibold text-amber-600 dark:text-amber-400">
              {article.category}
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-400 flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3" />
              {article.readTime} دقائق قراءة
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-400 text-[11px]">{article.publishedAt}</span>
          </div>

          <h3 
            onClick={() => onSelectArticle(article)}
            className="text-base sm:text-lg font-bold font-arabic text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
          >
            {article.title}
          </h3>

          <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-100 dark:border-stone-800/80">
            <div className="flex items-center gap-2">
              <img 
                src={article.author.avatar} 
                alt={article.author.name} 
                className="w-5 h-5 rounded-full object-cover border border-stone-300 dark:border-stone-700"
              />
              <span className="font-medium text-stone-700 dark:text-stone-300">
                {article.author.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-stone-400 text-xs">
                <Heart className="w-3 h-3 text-rose-500" />
                {article.likes}
              </span>
              <span className="flex items-center gap-1 text-stone-400 text-xs">
                <Eye className="w-3 h-3" />
                {article.views}
              </span>
              <button
                onClick={(e) => onToggleBookmark(article.id, e)}
                className={`p-1.5 rounded-lg transition-all ${
                  isBookmarked
                    ? 'text-amber-500 hover:bg-amber-500/10'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                }`}
                title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ'}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        </div>

      </article>
    );
  }

  // Standard Grid Card Mode
  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative">
      
      {/* Admin Floating Control Bar on Top of Card */}
      {isAdmin && (
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-stone-950/90 text-white backdrop-blur-md px-2.5 py-1 rounded-xl shadow-lg border border-amber-500/40 text-[11px]">
          <span className="font-bold text-amber-400 pl-1 border-l border-stone-700">إدارة</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditArticle?.(article, e);
            }}
            className="p-1 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
            title="تعديل المقال"
          >
            <Edit3 className="w-3 h-3" />
            <span>تعديل</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteArticle?.(article, e);
            }}
            className="p-1 hover:text-rose-400 transition-colors flex items-center gap-1 font-medium"
            title="حذف المقال"
          >
            <Trash2 className="w-3 h-3" />
            <span>حذف</span>
          </button>
        </div>
      )}

      {/* Thumbnail Area */}
      <div 
        onClick={() => onSelectArticle(article)}
        className="relative aspect-16/10 overflow-hidden cursor-pointer bg-stone-100 dark:bg-stone-800"
      >
        <img 
          src={article.coverImage} 
          alt={article.title} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-950/80 backdrop-blur-md text-white border border-white/10 shadow-xs">
            {article.category}
          </span>
          {article.featured && (
            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-amber-500 text-stone-950 shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              مقال مميز
            </span>
          )}
        </div>

        {/* Bookmark quick button */}
        <button
          onClick={(e) => onToggleBookmark(article.id, e)}
          className={`absolute top-3 left-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all ${
            isBookmarked
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'bg-stone-950/60 text-white/80 hover:text-white hover:bg-stone-950/90'
          }`}
          title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ للقراءة لاحقاً'}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Bar */}
          <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mb-2.5">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {article.readTime} دقائق قراءة
            </span>
            <span>•</span>
            <span>{article.publishedAt}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectArticle(article)}
            className="text-base sm:text-lg font-bold leading-snug font-arabic text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-2"
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Card Footer: Author & Social Stats */}
        <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src={article.author.avatar} 
              alt={article.author.name} 
              className="w-7 h-7 rounded-full object-cover border border-stone-300 dark:border-stone-700"
            />
            <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate max-w-[120px]">
              {article.author.name}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-500" />
              {article.likes}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views}
            </span>
          </div>
        </div>

      </div>

    </article>
  );
};
