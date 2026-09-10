import React from 'react';
import { Article } from '../types';
import { Clock, Heart, Eye, Bookmark, ArrowLeft, Edit3, Trash2, Sparkles } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  isAdmin?: boolean;
  onEditArticle?: (article: Article, e: React.MouseEvent) => void;
  onDeleteArticle?: (article: Article, e: React.MouseEvent) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  isAdmin,
  onEditArticle,
  onDeleteArticle
}) => {
  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative">
      
      {/* Admin Floating Control Bar on Top of Card */}
      {isAdmin && (
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-stone-950/90 text-white backdrop-blur-md px-2.5 py-1 rounded-xl shadow-lg border border-amber-500/40 text-[11px]">
          <span className="font-bold text-amber-400 pl-1 border-l border-stone-700">إدارة</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditArticle?.(article, e);
            }}
            className="p-1 hover:text-amber-400 transition-colors flex items-center gap-1"
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
            className="p-1 hover:text-rose-400 transition-colors flex items-center gap-1"
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
              مميز
            </span>
          )}
        </div>

        {/* Bookmark quick button */}
        <button
          onClick={(e) => onToggleBookmark(article.id, e)}
          className={`absolute top-3 left-3 z-10 p-2 rounded-lg backdrop-blur-md transition-all ${
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
              {article.readTime} دقائق
            </span>
            <span>•</span>
            <span>{article.publishedAt}</span>
          </div>

          {/* Title */}
          <h2 
            onClick={() => onSelectArticle(article)}
            className="text-base sm:text-lg font-bold leading-snug font-arabic text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-2"
          >
            {article.title}
          </h2>

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
