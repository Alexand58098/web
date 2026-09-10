import React, { useState, useEffect } from 'react';
import { 
  Article, 
  ReadingPreferences, 
  ReadingTheme, 
  ReadingFontSize, 
  ReadingFontFamily,
  Comment 
} from '../types';
import { 
  ArrowRight, 
  Clock, 
  Eye, 
  Heart, 
  Bookmark, 
  Share2, 
  Type, 
  Palette, 
  MessageSquare, 
  Send, 
  Check, 
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Edit3,
  Trash2,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onLikeArticle: (id: string) => void;
  onAddComment: (articleId: string, comment: Comment) => void;
  onSelectRelatedArticle: (article: Article) => void;
  relatedArticles: Article[];
  isAdmin?: boolean;
  onEditArticle?: (article: Article) => void;
  onDeleteArticle?: (article: Article) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onLikeArticle,
  onAddComment,
  onSelectRelatedArticle,
  relatedArticles,
  isAdmin,
  onEditArticle,
  onDeleteArticle
}) => {
  // Reading Progress State
  const [scrollProgress, setScrollProgress] = useState(0);

  // Reading Mode Preferences
  const [readingPrefs, setReadingPrefs] = useState<ReadingPreferences>(() => {
    try {
      const saved = localStorage.getItem('maqalat_reading_prefs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      theme: 'light',
      fontSize: 'md',
      fontFamily: 'arabic-modern'
    };
  });

  const [showPreferencesBar, setShowPreferencesBar] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Text-to-Speech Web Speech API
  const [isSpeaking, setIsSpeaking] = useState(false);

  // New Comment Form
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Save prefs
  useEffect(() => {
    localStorage.setItem('maqalat_reading_prefs', JSON.stringify(readingPrefs));
  }, [readingPrefs]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-to-Speech Toggle
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('متصفحك لا يدعم خاصية القراءة الصوتية.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const plainText = `${article.title}. ${article.excerpt}. ${article.content.replace(/#|\*|>|-/g, '')}`;
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      onLikeArticle(article.id);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#ef4444', '#10b981']
      });
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentAuthor.trim()) return;

    setIsSubmittingComment(true);
    const newComment: Comment = {
      id: 'comm-' + Date.now(),
      authorName: commentAuthor.trim(),
      content: commentText.trim(),
      createdAt: 'الآن',
      likes: 0
    };

    setTimeout(() => {
      onAddComment(article.id, newComment);
      setCommentText('');
      setIsSubmittingComment(false);
    }, 200);
  };

  // Font size classes
  const getFontSizeClass = (size: ReadingFontSize) => {
    switch (size) {
      case 'sm': return 'text-base leading-relaxed';
      case 'md': return 'text-lg leading-loose';
      case 'lg': return 'text-xl leading-loose';
      case 'xl': return 'text-2xl leading-loose';
      default: return 'text-lg leading-loose';
    }
  };

  // Theme styling
  const getThemeWrapperClass = (theme: ReadingTheme) => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#fbf0d9] text-[#433422] border-[#ecd9b5]';
      case 'dark':
        return 'bg-[#0f0e0d] text-[#e7e5e4] border-stone-800';
      case 'light':
      default:
        return 'bg-[#fafaf9] text-stone-900 border-stone-200';
    }
  };

  // Render markdown-like content cleanly
  const renderFormattedContent = (content: string) => {
    const lines = content.trim().split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={idx} className="h-4" />;
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-bold font-arabic mt-8 mb-3 text-stone-900 dark:text-stone-100">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl sm:text-3xl font-bold font-arabic mt-10 mb-4 pb-2 border-b border-stone-200/60 dark:border-stone-800 text-stone-900 dark:text-stone-100">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      if (trimmed.startsWith('> ')) {
        return (
          <blockquote 
            key={idx} 
            className="my-6 p-5 rounded-2xl bg-amber-500/10 border-r-4 border-amber-500 text-base sm:text-lg italic font-arabic text-stone-800 dark:text-stone-200 shadow-xs"
          >
            {trimmed.replace('> ', '').replace(/^"|"$/g, '')}
          </blockquote>
        );
      }

      if (trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="mr-6 mb-2 list-disc list-inside text-stone-700 dark:text-stone-300">
            <span>{trimmed.replace('- ', '')}</span>
          </li>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="mr-6 mb-2 list-decimal list-inside text-stone-700 dark:text-stone-300 font-medium">
            <span>{trimmed.replace(/^\d+\.\s/, '')}</span>
          </li>
        );
      }

      // Normal paragraph
      return (
        <p key={idx} className="my-4 text-stone-700 dark:text-stone-300 leading-relaxed">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${getThemeWrapperClass(readingPrefs.theme)}`}>
      
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-stone-200/50 dark:bg-stone-800 z-50">
        <div 
          className="h-full bg-amber-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Reading Preferences & Actions Bar */}
      <aside className="sticky top-4 z-40 max-w-4xl mx-auto px-4">
        <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-2xl p-2.5 border border-stone-200 dark:border-stone-800 shadow-lg flex items-center justify-between gap-2">
          
          {/* Back Button */}
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للمقالات</span>
          </button>

          {/* Center Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Audio Reader */}
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded-xl transition-all ${
                isSpeaking 
                  ? 'bg-amber-500 text-stone-950 font-bold' 
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
              title={isSpeaking ? 'إيقاف القراءة الصوتية' : 'استمع للمقال صوتياً'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Reading Customization Toggle */}
            <button
              onClick={() => setShowPreferencesBar(!showPreferencesBar)}
              className={`p-2 rounded-xl transition-all ${
                showPreferencesBar 
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' 
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
              title="تخصيص القراءة والخط"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Bookmark Toggle */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-xl transition-all ${
                isBookmarked 
                  ? 'bg-amber-500 text-stone-950' 
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
              title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ المقال'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Like / Claps */}
            <button
              onClick={handleLike}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isLiked 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{article.likes + (isLiked ? 1 : 0)}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 transition-colors relative"
              title="مشاركة رابط المقال"
            >
              {copiedToast ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex items-center gap-1 mr-1 pr-1 border-r border-stone-200 dark:border-stone-700">
                <button
                  onClick={() => onEditArticle?.(article)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 text-xs font-bold flex items-center gap-1 transition-colors"
                  title="تعديل هذا المقال في لوحة التحكم"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">تعديل</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`هل أنت متأكد من حذف مقال "${article.title}" نهائياً؟`)) {
                      onDeleteArticle?.(article);
                      onBack();
                    }
                  }}
                  className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                  title="حذف هذا المقال"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Extended Reading Customizer Tray */}
        {showPreferencesBar && (
          <div className="mt-2 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
            
            {/* Font Size */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400">حجم الخط:</span>
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                {(['sm', 'md', 'lg', 'xl'] as ReadingFontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setReadingPrefs(prev => ({ ...prev, fontSize: size }))}
                    className={`px-2.5 py-1 rounded-lg uppercase ${
                      readingPrefs.fontSize === size 
                        ? 'bg-white dark:bg-stone-700 text-amber-500 font-bold shadow-xs' 
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    {size === 'sm' ? 'صغير' : size === 'md' ? 'متوسط' : size === 'lg' ? 'كبير' : 'أكبر'}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Theme Palette */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400">نمط القراءة:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setReadingPrefs(prev => ({ ...prev, theme: 'light' }))}
                  className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                    readingPrefs.theme === 'light' 
                      ? 'border-amber-500 bg-stone-100 font-bold' 
                      : 'border-stone-200 bg-white text-stone-600'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-200 border" />
                  <span>نهاري</span>
                </button>
                <button
                  onClick={() => setReadingPrefs(prev => ({ ...prev, theme: 'sepia' }))}
                  className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                    readingPrefs.theme === 'sepia' 
                      ? 'border-amber-700 bg-[#f4e6ca] text-[#433422] font-bold' 
                      : 'border-[#ecd9b5] bg-[#fbf0d9] text-[#433422]'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ecd9b5] border" />
                  <span>ورقي دافئ</span>
                </button>
                <button
                  onClick={() => setReadingPrefs(prev => ({ ...prev, theme: 'dark' }))}
                  className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                    readingPrefs.theme === 'dark' 
                      ? 'border-amber-400 bg-stone-800 text-stone-100 font-bold' 
                      : 'border-stone-700 bg-stone-900 text-stone-300'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-950 border" />
                  <span>ليلي</span>
                </button>
              </div>
            </div>

          </div>
        )}
      </aside>

      {/* Article Main Canvas */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Article Header Metadata */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              {article.category}
            </span>
            <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} دقائق قراءة
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-arabic leading-tight text-stone-950 dark:text-stone-50">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            {article.excerpt}
          </p>

          {/* Author Byline */}
          <div className="pt-6 pb-2 flex items-center justify-center gap-3 border-b border-stone-200/60 dark:border-stone-800">
            <img 
              src={article.author.avatar} 
              alt={article.author.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40"
            />
            <div className="text-right">
              <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {article.author.name}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                {article.author.role} • نُشر في {article.publishedAt}
              </div>
            </div>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="my-8 rounded-3xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-800 aspect-16/9 bg-stone-100">
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Article Content */}
        <article className={`prose max-w-none font-arabic ${getFontSizeClass(readingPrefs.fontSize)}`}>
          {renderFormattedContent(article.content)}
        </article>

        {/* Article Tags */}
        <div className="mt-12 pt-6 border-t border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-400">الكلمات الدلالية:</span>
          {article.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1 rounded-xl text-xs font-medium bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Box */}
        <div className="mt-10 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex items-start gap-4 shadow-xs">
          <img 
            src={article.author.avatar} 
            alt={article.author.name} 
            className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-amber-500/30"
          />
          <div>
            <span className="text-xs text-amber-500 font-bold block mb-1">عن الكاتب</span>
            <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">{article.author.name}</h4>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
              {article.author.bio}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mt-14 pt-8 border-t border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-arabic flex items-center gap-2 text-stone-900 dark:text-stone-100">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <span>التعليقات والمناقشات</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {article.comments.length}
              </span>
            </h3>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs mb-8 space-y-3">
            <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">أضف رأيك أو فكرة للنقاش</h4>
            
            <input
              type="text"
              placeholder="اسمك الكريم..."
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100"
              required
            />

            <textarea
              placeholder="اكتب تعليقك هنا..."
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-4 text-sm rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100 resize-none"
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>نشر التعليق</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {article.comments.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-sm">
                لا توجد تعليقات حتى الآن. كُن أول من يشارك برأيه!
              </div>
            ) : (
              article.comments.map((comm) => (
                <div 
                  key={comm.id} 
                  className="p-4 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                      {comm.authorName}
                    </span>
                    <span className="text-[11px] text-stone-400">{comm.createdAt}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {comm.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Articles Recommendation */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-10 border-t border-stone-200/80 dark:border-stone-800">
            <h3 className="text-xl font-bold font-arabic mb-6 text-stone-900 dark:text-stone-100">
              مقالات قد تهمك في نفس المجال
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.slice(0, 2).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onSelectRelatedArticle(rel);
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/50 cursor-pointer transition-all flex gap-4 items-center group shadow-xs"
                >
                  <img 
                    src={rel.coverImage} 
                    alt={rel.title} 
                    className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <span className="text-[11px] text-amber-500 font-bold block mb-1">{rel.category}</span>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-stone-400 block mt-1">{rel.readTime} دقائق قراءة</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

    </div>
  );
};
