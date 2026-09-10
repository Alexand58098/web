import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../types';
import { Search, X, ArrowLeft, Clock, Sparkles, BookOpen, Flame, Tag, User } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (category: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
  onSelectCategory
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter articles
  const filteredArticles = query.trim()
    ? articles.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase()) ||
        a.author.name.toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : articles.slice(0, 5);

  // Handle Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredArticles.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filteredArticles.length || 1)) % (filteredArticles.length || 1));
      } else if (e.key === 'Enter' && filteredArticles[selectedIndex]) {
        e.preventDefault();
        onSelectArticle(filteredArticles[selectedIndex]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredArticles, onSelectArticle, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-right flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-stone-200 dark:border-stone-800 flex items-center px-4 py-3.5 gap-3">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="ابحث في مقالات مدونة المجتهد بالعنوان، الكاتب، أو الموضوع..."
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none font-arabic"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold text-stone-400 bg-stone-100 dark:bg-stone-800 rounded border border-stone-300 dark:border-stone-700">
            ESC
          </kbd>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="p-3 bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200/60 dark:border-stone-800/60 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-stone-400 font-medium pl-1">موضوعات رائجة:</span>
            {['الذكاء الاصطناعي', 'البرمجة والتقنية', 'ريادة الأعمال', 'الإنتاجية وتطوير الذات'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-500/20 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-stone-400" />
              <p>لم نجد نتائج مطابقة لـ "{query}"</p>
              <p className="text-xs mt-1 text-stone-500">جرّب البحث بكلمة مفتاحية عامة مثل: ذكاء، تصميم، تركيز</p>
            </div>
          ) : (
            filteredArticles.map((article, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={article.id}
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected 
                      ? 'bg-amber-500/10 dark:bg-amber-500/15 text-stone-900 dark:text-stone-50' 
                      : 'hover:bg-stone-100 dark:hover:bg-stone-800/60 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-16 h-14 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-stone-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-semibold text-amber-600 dark:text-amber-400">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500 text-stone-950 font-bold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          مميز
                        </span>
                      )}
                      <span className="text-[11px] text-stone-400 flex items-center gap-1 mr-auto">
                        <Clock className="w-3 h-3" />
                        {article.readTime} دقائق
                      </span>
                    </div>

                    <h4 className="text-sm font-bold truncate font-arabic">
                      {article.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-1 text-xs text-stone-500 dark:text-stone-400">
                      <span>بقلم: {article.author.name}</span>
                      <span>•</span>
                      <span>{article.views} قراءة</span>
                    </div>
                  </div>

                  <ArrowLeft className={`w-4 h-4 shrink-0 mt-3 transition-transform ${isSelected ? 'text-amber-500 -translate-x-1' : 'text-stone-300 dark:text-stone-600'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Tip */}
        <div className="p-3 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-stone-200 dark:bg-stone-800 rounded text-[10px] font-mono">↑↓</kbd>
              <span>للتنقل</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-stone-200 dark:bg-stone-800 rounded text-[10px] font-mono">↵</kbd>
              <span>للفتح</span>
            </span>
          </div>
          <span className="text-amber-600 dark:text-amber-400 font-semibold font-arabic">
            مدونة المجتهد للبحث السريع
          </span>
        </div>
      </div>
    </div>
  );
};
