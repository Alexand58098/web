import React from 'react';
import { Article } from '../types';
import { Clock, Eye, Heart, Bookmark, ArrowLeft, Sparkles, Edit3, Trash2 } from 'lucide-react';

interface HeroFeaturedProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  isAdmin?: boolean;
  onEditArticle?: (article: Article, e: React.MouseEvent) => void;
  onDeleteArticle?: (article: Article, e: React.MouseEvent) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  article,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  isAdmin,
  onEditArticle,
  onDeleteArticle
}) => {
  return (
    <div className="relative my-8 rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl group border border-stone-800">
      
      {/* Admin Floating Control Badge on Hero */}
      {isAdmin && (
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-stone-950/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl border border-amber-500/40 text-xs">
          <span className="font-bold text-amber-400 pl-1.5 border-l border-stone-700">تحكم المسؤول</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditArticle?.(article, e);
            }}
            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg transition-colors flex items-center gap-1 font-semibold"
            title="تعديل المقال المميز"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>تعديل المقال</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteArticle?.(article, e);
            }}
            className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg transition-colors flex items-center gap-1 font-semibold"
            title="حذف المقال المميز"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
        
        {/* Text Content Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                مقال مميز للأسبوع
              </span>
              <span className="text-xs text-stone-400 font-medium">
                {article.category}
              </span>
            </div>

            <h1 
              onClick={() => onSelectArticle(article)}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight font-arabic hover:text-amber-300 transition-colors cursor-pointer"
            >
              {article.title}
            </h1>

            <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4">
            {/* Author Profile */}
            <div className="flex items-center gap-3">
              <img 
                src={article.author.avatar} 
                alt={article.author.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/40"
              />
              <div>
                <span className="text-sm font-semibold block text-stone-100">
                  {article.author.name}
                </span>
                <span className="text-xs text-stone-400 block">
                  {article.author.role}
                </span>
              </div>
            </div>

            {/* Read Button & Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onToggleBookmark(article.id, e)}
                className={`p-2.5 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'bg-amber-500 text-stone-950 border-amber-400'
                    : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300 border-stone-700'
                }`}
                title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ للقراءة لاحقاً'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={() => onSelectArticle(article)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-all flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-amber-500/20"
              >
                <span>اقرأ المقال كاملاً</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image Column */}
        <div 
          onClick={() => onSelectArticle(article)}
          className="lg:col-span-5 relative min-h-[220px] lg:min-h-full cursor-pointer overflow-hidden"
        >
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent lg:hidden" />
          
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-stone-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-stone-300 border border-white/10">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {article.readTime} دقائق قراءة
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              {article.views.toLocaleString()}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
