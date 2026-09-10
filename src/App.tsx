import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Article, Category, Comment, SiteSettings, NewsletterSubscriber } from './types';
import { INITIAL_ARTICLES } from './data/articles';
import { Navbar } from './components/Navbar';
import { CategoriesFilter } from './components/CategoriesFilter';
import { HeroFeatured } from './components/HeroFeatured';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { ArticleEditorModal } from './components/ArticleEditorModal';
import { BookmarksView } from './components/BookmarksView';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CommandPalette } from './components/CommandPalette';
import { EditorialTicker } from './components/EditorialTicker';
import { Search, Compass, BookOpen, AlertCircle, Shield, Crown, Sparkles, X, LayoutGrid, List } from 'lucide-react';

const DEFAULT_CATEGORIES: Category[] = [
  'الكل',
  'الذكاء الاصطناعي',
  'البرمجة والتقنية',
  'ريادة الأعمال',
  'التصميم وتجربة المستخدم',
  'الإنتاجية وتطوير الذات',
  'العلوم والابتكار'
];

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'مدونة المجتهد',
  siteSlogan: 'منصة الفكر والمعرفة الرصينة',
  siteDescription: 'المساحة الرقمية الرائدة للمجتهدين وصنّاع الأثر في العالم العربي؛ تحليلات برمجية معمقة، رؤى في الذكاء الاصطناعي، وأدلة ريادة الأعمال بعيداً عن السطحية والإثارة المبتذلة.',
  announcement: {
    enabled: true,
    text: 'مرحباً بك في مدونة المجتهد — منصة الفكر والمعرفة الرصينة للمبرمجين والمبتكرين وصناع المستقبل.',
    linkText: 'تصفح مختارات المجتهد'
  },
  footerText: '© جميع الحقوق محفوظة لمدونة المجتهد — منصة الفكر والمعرفة الرصينة.',
  enableComments: true,
  enableAudioReader: true,
  allowPublicSubmissions: true
};

const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'ahmed.dev@example.com', subscribedAt: '2026-03-01' },
  { id: 'sub-2', email: 'sara.tech@example.com', subscribedAt: '2026-03-05' },
  { id: 'sub-3', email: 'omar.writer@example.com', subscribedAt: '2026-03-09' }
];

export default function App() {
  // Articles persistence
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem('maqalat_all_articles');
      if (stored) return JSON.parse(stored);
      
      const legacyCustom = localStorage.getItem('maqalat_custom_articles');
      if (legacyCustom) {
        return [...JSON.parse(legacyCustom), ...INITIAL_ARTICLES];
      }
    } catch {}
    return INITIAL_ARTICLES;
  });

  // Categories persistence
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem('maqalat_categories');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_CATEGORIES;
  });

  // Site settings persistence with auto-migration to 'مدونة المجتهد'
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem('maqalat_site_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.siteTitle === 'مَقَالَات' || !parsed.siteTitle) {
          parsed.siteTitle = 'مدونة المجتهد';
          parsed.siteSlogan = 'منصة الفكر والمعرفة الرصينة';
          localStorage.setItem('maqalat_site_settings', JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch {}
    return DEFAULT_SITE_SETTINGS;
  });

  // Subscribers persistence
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const stored = localStorage.getItem('maqalat_subscribers');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_SUBSCRIBERS;
  });

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('maqalat_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  // Modals & Active State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Layout View Mode (grid vs list)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    try {
      return (localStorage.getItem('mujtahid_view_mode') as 'grid' | 'list') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    try {
      localStorage.setItem('mujtahid_view_mode', mode);
    } catch {}
  };

  // Quick Knowledge Filter (Editorial Ticker)
  const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'featured' | 'quick' | 'popular'>('all');

  // Bookmarks persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('maqalat_bookmarks');
      if (stored) return JSON.parse(stored);
    } catch {}
    return ['art-1', 'art-3'];
  });

  // Active View & Navigation: 'home' | 'bookmarks' | 'admin'
  const [currentView, setCurrentView] = useState<'home' | 'bookmarks' | 'admin'>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState<Category>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'likes'>('latest');

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('maqalat_dark_mode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('maqalat_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Sync site title with document title
  useEffect(() => {
    if (siteSettings?.siteTitle) {
      document.title = `${siteSettings.siteTitle} — ${siteSettings.siteSlogan || 'منصة الفكر والمعرفة الرصينة'}`;
    }
  }, [siteSettings]);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save articles helper
  const handleUpdateArticles = (updatedList: Article[]) => {
    setArticles(updatedList);
    localStorage.setItem('maqalat_all_articles', JSON.stringify(updatedList));
  };

  // Save categories helper
  const handleUpdateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem('maqalat_categories', JSON.stringify(newCategories));
  };

  // Save site settings helper
  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    localStorage.setItem('maqalat_site_settings', JSON.stringify(newSettings));
  };

  // Save subscribers helper
  const handleUpdateSubscribers = (newSubscribers: NewsletterSubscriber[]) => {
    setSubscribers(newSubscribers);
    localStorage.setItem('maqalat_subscribers', JSON.stringify(newSubscribers));
  };

  // Reset to defaults
  const handleResetToDefaults = () => {
    handleUpdateArticles(INITIAL_ARTICLES);
    handleUpdateCategories(DEFAULT_CATEGORIES);
    handleUpdateSiteSettings(DEFAULT_SITE_SETTINGS);
    handleUpdateSubscribers(DEFAULT_SUBSCRIBERS);
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('maqalat_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  // Like Article
  const handleLikeArticle = (id: string) => {
    const updated = articles.map((art) => {
      if (art.id === id) {
        return { ...art, likes: art.likes + 1 };
      }
      return art;
    });
    handleUpdateArticles(updated);
  };

  // Add Comment
  const handleAddComment = (articleId: string, comment: Comment) => {
    const updated = articles.map((art) => {
      if (art.id === articleId) {
        return { ...art, comments: [comment, ...art.comments] };
      }
      return art;
    });
    handleUpdateArticles(updated);

    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle(prev => prev ? { ...prev, comments: [comment, ...prev.comments] } : null);
    }
  };

  // Publish / Update Article (from editor modal)
  const handlePublishArticle = (articleToSave: Article) => {
    const existingIndex = articles.findIndex(a => a.id === articleToSave.id);
    let updated: Article[];

    if (existingIndex >= 0) {
      // Update existing
      updated = articles.map(a => a.id === articleToSave.id ? articleToSave : a);
    } else {
      // Add new
      updated = [articleToSave, ...articles];
    }

    handleUpdateArticles(updated);
    setEditingArticle(null);

    // If currently reading this article, update it
    if (selectedArticle && selectedArticle.id === articleToSave.id) {
      setSelectedArticle(articleToSave);
    } else if (!selectedArticle && currentView !== 'admin') {
      setSelectedArticle(articleToSave);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Edit an article (from card or reader)
  const handleEditArticle = (article: Article, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  // Quick Delete an article
  const handleDeleteArticle = (article: Article, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm(`هل أنت متأكد من حذف مقال "${article.title}" نهائياً من الموقع؟`);
    if (!confirmed) return;

    const updated = articles.filter(a => a.id !== article.id);
    handleUpdateArticles(updated);

    if (selectedArticle && selectedArticle.id === article.id) {
      setSelectedArticle(null);
    }
  };

  // Select Article for Reading
  const handleSelectArticle = (article: Article) => {
    // Increment view count
    const updated = articles.map((a) => {
      if (a.id === article.id) {
        return { ...a, views: a.views + 1 };
      }
      return a;
    });
    handleUpdateArticles(updated);

    setSelectedArticle({ ...article, views: article.views + 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Newsletter Subscriber
  const handleSubscribe = (email: string) => {
    if (!email) return;
    const exists = subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) return;

    const newSub: NewsletterSubscriber = {
      id: 'sub-' + Date.now(),
      email: email.trim().toLowerCase(),
      subscribedAt: new Date().toISOString().split('T')[0]
    };
    handleUpdateSubscribers([newSub, ...subscribers]);
  };

  // Admin Login success handler
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem('maqalat_is_admin', 'true');
    setCurrentView('admin');
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Exit handler
  const handleExitAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('maqalat_is_admin');
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'الكل': articles.length
    };

    categories.forEach(cat => {
      if (cat !== 'الكل') counts[cat] = 0;
    });

    articles.forEach((a) => {
      if (counts[a.category] !== undefined) {
        counts[a.category] += 1;
      }
    });

    return counts;
  }, [articles, categories]);

  // Filtered & Sorted Articles
  const filteredArticles = useMemo(() => {
    let list = [...articles];

    // Category filter
    if (selectedCategory !== 'الكل') {
      list = list.filter(a => a.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Quick filter (Editorial Ticker)
    if (activeQuickFilter === 'featured') {
      list = list.filter(a => a.featured);
    } else if (activeQuickFilter === 'quick') {
      list = list.filter(a => a.readTime <= 5);
    } else if (activeQuickFilter === 'popular') {
      list = [...list].sort((a, b) => b.views - a.views);
    }

    // Sorting (if not already custom sorted)
    if (activeQuickFilter !== 'popular') {
      list.sort((a, b) => {
        if (sortBy === 'popular') return b.views - a.views;
        if (sortBy === 'likes') return b.likes - a.likes;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
    }

    return list;
  }, [articles, selectedCategory, searchQuery, sortBy, activeQuickFilter]);

  // Featured Article (first featured or top liked)
  const featuredArticle = useMemo(() => {
    return articles.find(a => a.featured) || articles[0];
  }, [articles]);

  // Bookmarked Articles
  const bookmarkedArticles = useMemo(() => {
    return articles.filter(a => bookmarkedIds.includes(a.id));
  }, [articles, bookmarkedIds]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      
      {/* Top Main Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setSelectedArticle(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        bookmarksCount={bookmarkedIds.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenNewArticle={() => {
          setEditingArticle(null);
          setIsEditorOpen(true);
        }}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onExitAdmin={handleExitAdmin}
        siteSettings={siteSettings}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Floating Admin Status Bar when Logged In as Admin */}
      {isAdmin && currentView !== 'admin' && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>وضع المسؤول نشط: يمكنك إدارة المقالات مباشرة من البطاقات أو الدخول للوحة التحكم الشاملة CMS.</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  setCurrentView('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1 bg-amber-500 text-stone-950 rounded-xl font-bold hover:bg-amber-400 transition-colors shadow-xs"
              >
                فتح لوحة التحكم
              </button>
              <button
                onClick={handleExitAdmin}
                className="text-stone-500 dark:text-stone-400 hover:text-rose-500 transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* If user is inside Admin Dashboard */}
        {currentView === 'admin' ? (
          <div className="py-6">
            <AdminDashboard
              articles={articles}
              categories={categories}
              siteSettings={siteSettings}
              subscribers={subscribers}
              onUpdateArticles={handleUpdateArticles}
              onUpdateCategories={handleUpdateCategories}
              onUpdateSiteSettings={handleUpdateSiteSettings}
              onUpdateSubscribers={handleUpdateSubscribers}
              onOpenArticleEditor={(article) => {
                setEditingArticle(article || null);
                setIsEditorOpen(true);
              }}
              onViewArticle={(article) => {
                setSelectedArticle(article);
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExitAdmin={handleExitAdmin}
              onResetToDefaults={handleResetToDefaults}
            />
          </div>
        ) : selectedArticle ? (
          /* If user is reading an article */
          <ArticleDetail
            article={selectedArticle}
            onBack={() => {
              setSelectedArticle(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
            onToggleBookmark={handleToggleBookmark}
            onLikeArticle={handleLikeArticle}
            onAddComment={handleAddComment}
            onSelectRelatedArticle={handleSelectArticle}
            relatedArticles={articles.filter(a => a.category === selectedArticle.category && a.id !== selectedArticle.id)}
            isAdmin={isAdmin}
            onEditArticle={(art) => handleEditArticle(art)}
            onDeleteArticle={(art) => handleDeleteArticle(art)}
          />
        ) : currentView === 'bookmarks' ? (
          /* Bookmarks / Reading List View */
          <BookmarksView
            bookmarkedArticles={bookmarkedArticles}
            onSelectArticle={handleSelectArticle}
            onToggleBookmark={handleToggleBookmark}
            onExploreClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          /* Home Discovery View */
          <main className="py-4 sm:py-6">
            
            {/* Show Featured Article only if default view (no search and all categories) */}
            {selectedCategory === 'الكل' && !searchQuery.trim() && activeQuickFilter === 'all' && featuredArticle && (
              <HeroFeatured
                article={featuredArticle}
                onSelectArticle={handleSelectArticle}
                isBookmarked={bookmarkedIds.includes(featuredArticle.id)}
                onToggleBookmark={handleToggleBookmark}
                isAdmin={isAdmin}
                onEditArticle={(art, e) => handleEditArticle(art, e)}
                onDeleteArticle={(art, e) => handleDeleteArticle(art, e)}
              />
            )}

            {/* Editorial Ticker: Quotes & Quick Knowledge Tabs */}
            <EditorialTicker
              totalArticlesCount={articles.length}
              activeQuickFilter={activeQuickFilter}
              onQuickFilter={(filter) => {
                setActiveQuickFilter(filter);
                if (filter !== 'all') {
                  setSelectedCategory('الكل');
                }
              }}
            />

            {/* Categories & Sorting Filters */}
            <CategoriesFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveQuickFilter('all');
              }}
              categoryCounts={categoryCounts}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
            />

            {/* Search Results Summary (if searching) */}
            {searchQuery.trim() && (
              <div className="my-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Search className="w-4 h-4 text-amber-500" />
                  <span>نتائج البحث في مدونة المجتهد عن: <strong>"{searchQuery}"</strong></span>
                  <span className="text-stone-400">({filteredArticles.length} مقال)</span>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  مسح البحث
                </button>
              </div>
            )}

            {/* Articles Grid or Compact List */}
            <div className="py-6">
              {filteredArticles.length === 0 ? (
                <div className="py-20 text-center max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                    لم نعثر على مقالات مطابقة
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                    جرّب البحث بكلمات مختلفة أو اختر تصنيفاً آخر من أقسام مدونة المجتهد.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('الكل');
                      setSearchQuery('');
                      setActiveQuickFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 text-xs font-semibold"
                  >
                    عرض جميع المقالات
                  </button>
                </div>
              ) : viewMode === 'list' ? (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onSelectArticle={handleSelectArticle}
                      isBookmarked={bookmarkedIds.includes(article.id)}
                      onToggleBookmark={handleToggleBookmark}
                      isAdmin={isAdmin}
                      onEditArticle={(art, e) => handleEditArticle(art, e)}
                      onDeleteArticle={(art, e) => handleDeleteArticle(art, e)}
                      viewMode="list"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onSelectArticle={handleSelectArticle}
                      isBookmarked={bookmarkedIds.includes(article.id)}
                      onToggleBookmark={handleToggleBookmark}
                      isAdmin={isAdmin}
                      onEditArticle={(art, e) => handleEditArticle(art, e)}
                      onDeleteArticle={(art, e) => handleDeleteArticle(art, e)}
                      viewMode="grid"
                    />
                  ))}
                </div>
              )}
            </div>

          </main>
        )}

      </div>

      {/* Command Palette Spotlight Dialog (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        articles={articles}
        categories={categories}
        onSelectArticle={handleSelectArticle}
        onSelectCategory={(cat) => {
          setSelectedArticle(null);
          setCurrentView('home');
          setSelectedCategory(cat);
          setActiveQuickFilter('all');
        }}
        onNavigate={(view) => {
          setSelectedArticle(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
        isDarkMode={isDarkMode}
        onOpenNewArticle={() => {
          setEditingArticle(null);
          setIsEditorOpen(true);
        }}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        viewMode={viewMode}
        onToggleViewMode={() => handleViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
      />

      {/* Editor Modal for Writing or Editing Articles */}
      <ArticleEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingArticle(null);
        }}
        onPublish={handlePublishArticle}
        categories={categories}
        initialArticle={editingArticle}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <Footer
        categories={categories}
        onSelectCategory={(cat) => {
          setSelectedArticle(null);
          setCurrentView('home');
          setSelectedCategory(cat);
          setActiveQuickFilter('all');
        }}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => {
          setSelectedArticle(null);
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSubscribe={handleSubscribe}
        siteSettings={siteSettings}
      />

    </div>
  );
}
