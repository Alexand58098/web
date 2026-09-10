import React, { useState, useMemo } from 'react';
import { 
  Article, 
  Category, 
  Comment, 
  SiteSettings, 
  NewsletterSubscriber, 
  AdminTab 
} from '../types';
import { 
  BarChart3, 
  FileText, 
  FolderTree, 
  MessageSquare, 
  Mail, 
  Settings, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Star, 
  Eye, 
  Heart, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  RotateCcw, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface AdminDashboardProps {
  articles: Article[];
  categories: Category[];
  siteSettings: SiteSettings;
  subscribers: NewsletterSubscriber[];
  onUpdateArticles: (articles: Article[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  onUpdateSubscribers: (subscribers: NewsletterSubscriber[]) => void;
  onOpenArticleEditor: (article?: Article | null) => void;
  onViewArticle: (article: Article) => void;
  onExitAdmin: () => void;
  onResetToDefaults: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  categories,
  siteSettings,
  subscribers,
  onUpdateArticles,
  onUpdateCategories,
  onUpdateSiteSettings,
  onUpdateSubscribers,
  onOpenArticleEditor,
  onViewArticle,
  onExitAdmin,
  onResetToDefaults
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search in articles tab
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('الكل');

  // Delete article confirmation modal
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  // Category management inputs
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ oldName: string; newName: string } | null>(null);

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Subscribers copy toast
  const [copiedEmailsToast, setCopiedEmailsToast] = useState(false);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState('');

  // Comment deletion confirmation
  const [commentSearch, setCommentSearch] = useState('');

  // Calculate high-level stats
  const totalViews = useMemo(() => articles.reduce((acc, a) => acc + (a.views || 0), 0), [articles]);
  const totalLikes = useMemo(() => articles.reduce((acc, a) => acc + (a.likes || 0), 0), [articles]);
  const totalComments = useMemo(() => articles.reduce((acc, a) => acc + (a.comments?.length || 0), 0), [articles]);

  // Top articles
  const topArticles = useMemo(() => {
    return [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
  }, [articles]);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory = selectedCategoryFilter === 'الكل' || art.category === selectedCategoryFilter;
      const matchesSearch = 
        art.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
        art.author.name.toLowerCase().includes(articleSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, articleSearch, selectedCategoryFilter]);

  // All comments aggregated
  const allComments = useMemo(() => {
    const list: { articleId: string; articleTitle: string; comment: Comment }[] = [];
    articles.forEach((art) => {
      if (art.comments) {
        art.comments.forEach((c) => {
          list.push({
            articleId: art.id,
            articleTitle: art.title,
            comment: c
          });
        });
      }
    });
    if (commentSearch.trim()) {
      const q = commentSearch.toLowerCase();
      return list.filter(item => 
        item.comment.authorName.toLowerCase().includes(q) ||
        item.comment.content.toLowerCase().includes(q) ||
        item.articleTitle.toLowerCase().includes(q)
      );
    }
    return list;
  }, [articles, commentSearch]);

  // Actions for articles
  const handleDeleteArticle = (id: string) => {
    const updated = articles.filter((a) => a.id !== id);
    onUpdateArticles(updated);
    setArticleToDelete(null);
  };

  const handleToggleFeatured = (id: string) => {
    const target = articles.find((a) => a.id === id);
    const newFeaturedState = !target?.featured;
    
    // If setting to true, make it the featured one
    const updated = articles.map((a) => {
      if (a.id === id) {
        return { ...a, featured: newFeaturedState };
      }
      // If marking one as featured, unset others or keep multiple
      return a;
    });
    onUpdateArticles(updated);
  };

  const handleDuplicateArticle = (article: Article) => {
    const duplicated: Article = {
      ...article,
      id: 'art-' + Date.now(),
      title: `${article.title} (نسخة معدلة)`,
      slug: `${article.slug}-copy-${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0],
      views: 1,
      likes: 0,
      featured: false,
      comments: []
    };
    onUpdateArticles([duplicated, ...articles]);
  };

  // Category actions
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name || categories.includes(name)) return;
    onUpdateCategories([...categories, name]);
    setNewCategoryName('');
  };

  const handleSaveEditCategory = () => {
    if (!editingCategory || !editingCategory.newName.trim()) return;
    const oldName = editingCategory.oldName;
    const newName = editingCategory.newName.trim();

    // Update category list
    const updatedCats = categories.map(c => c === oldName ? newName : c);
    onUpdateCategories(updatedCats);

    // Update articles with old category
    const updatedArts = articles.map(art => {
      if (art.category === oldName) {
        return { ...art, category: newName };
      }
      return art;
    });
    onUpdateArticles(updatedArts);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (catName: string) => {
    if (catName === 'الكل') return;
    if (confirm(`هل أنت متأكد من حذف قسم "${catName}"؟ سيتم نقل مقالات هذا القسم إلى قسم "الذكاء الاصطناعي".`)) {
      const updatedCats = categories.filter(c => c !== catName);
      onUpdateCategories(updatedCats);

      // Reassign articles
      const fallbackCat = updatedCats.find(c => c !== 'الكل') || 'عام';
      const updatedArts = articles.map(art => {
        if (art.category === catName) {
          return { ...art, category: fallbackCat };
        }
        return art;
      });
      onUpdateArticles(updatedArts);
    }
  };

  // Comment actions
  const handleDeleteComment = (articleId: string, commentId: string) => {
    const updatedArts = articles.map(art => {
      if (art.id === articleId) {
        return {
          ...art,
          comments: art.comments.filter(c => c.id !== commentId)
        };
      }
      return art;
    });
    onUpdateArticles(updatedArts);
  };

  // Subscriber actions
  const handleCopySubscribers = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopiedEmailsToast(true);
    setTimeout(() => setCopiedEmailsToast(false), 3000);
  };

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubscriberEmail.trim()) return;
    const exists = subscribers.some(s => s.email.toLowerCase() === newSubscriberEmail.trim().toLowerCase());
    if (exists) {
      alert('هذا البريد الإلكتروني مسجل مسبقاً في القائمة.');
      return;
    }
    const newSub: NewsletterSubscriber = {
      id: 'sub-' + Date.now(),
      email: newSubscriberEmail.trim(),
      subscribedAt: new Date().toISOString().split('T')[0]
    };
    onUpdateSubscribers([newSub, ...subscribers]);
    setNewSubscriberEmail('');
  };

  const handleDeleteSubscriber = (id: string) => {
    onUpdateSubscribers(subscribers.filter(s => s.id !== id));
  };

  // Save site settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(settingsForm);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  // Export full JSON data backup
  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      articles,
      categories,
      siteSettings,
      subscribers
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maqalat-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.articles && Array.isArray(parsed.articles)) {
          onUpdateArticles(parsed.articles);
        }
        if (parsed.categories && Array.isArray(parsed.categories)) {
          onUpdateCategories(parsed.categories);
        }
        if (parsed.siteSettings) {
          onUpdateSiteSettings(parsed.siteSettings);
          setSettingsForm(parsed.siteSettings);
        }
        if (parsed.subscribers && Array.isArray(parsed.subscribers)) {
          onUpdateSubscribers(parsed.subscribers);
        }
        alert('تم استيراد النسخة الاحتياطية بنجاح وتحديث كافة بيانات الموقع!');
      } catch (err) {
        alert('فشل استيراد الملف. تأكد من صحة ملف الـ JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Admin Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-stone-900 via-stone-850 to-stone-900 text-white shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-stone-950">
                وضع المسؤول مفعل
              </span>
              <span className="text-xs text-stone-400">لوحة التحكم المركزية بالواجهة</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-arabic mt-1">
              إدارة محتوى وإعدادات الموقع (Admin Dashboard)
            </h1>
            <p className="text-xs text-stone-300 mt-0.5">
              يمكنك التعديل والإضافة والحذف والتحكم في كل عنصر بالموقع دون الحاجة لتعديل الأكواد البرمجية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={() => onOpenArticleEditor(null)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>مقال جديد</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors"
          >
            الخروج من وضع الإدارة
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/80'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>نظرة عامة وإحصائيات</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'articles'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/80'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>إدارة المقالات ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/80'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>الأقسام والتصنيفات ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'comments'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/80'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>التعليقات والرقابة ({totalComments})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'subscribers'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/80'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>المشتركون بالبريد ({subscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/80'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات وهوية الموقع</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Metrics 4-grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
              <div className="flex items-center justify-between text-stone-400 mb-3">
                <span className="text-xs font-semibold">إجمالي المقالات المنشورة</span>
                <FileText className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 font-arabic">
                {articles.length}
              </div>
              <span className="text-[11px] text-stone-400 block mt-1">عبر {categories.length - 1} أقسام متخصصة</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
              <div className="flex items-center justify-between text-stone-400 mb-3">
                <span className="text-xs font-semibold">إجمالي المشاهدات</span>
                <Eye className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 font-arabic">
                {totalViews.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">تفاعل قراءة نشط</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
              <div className="flex items-center justify-between text-stone-400 mb-3">
                <span className="text-xs font-semibold">إجمالي الإعجابات</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 font-arabic">
                {totalLikes.toLocaleString()}
              </div>
              <span className="text-[11px] text-stone-400 block mt-1">إشادة بالقيمة الفكرية</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
              <div className="flex items-center justify-between text-stone-400 mb-3">
                <span className="text-xs font-semibold">المشتركون في النشرة</span>
                <Mail className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 font-arabic">
                {subscribers.length}
              </div>
              <span className="text-[11px] text-stone-400 block mt-1">قارئ ينتظر التحديثات الأسبوعية</span>
            </div>
          </div>

          {/* Quick Controls & Top Articles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Top 5 Most Read */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold font-arabic text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>المقالات الأكثر قراءة وتفاعلاً</span>
                </h3>
                <button
                  onClick={() => setActiveTab('articles')}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  عرض جميع المقالات
                </button>
              </div>

              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {topArticles.map((art, idx) => (
                  <div key={art.id} className="py-3.5 flex items-center justify-between gap-4 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <img src={art.coverImage} alt={art.title} className="w-12 h-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <h4 
                          onClick={() => onViewArticle(art)}
                          className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 hover:text-amber-600 truncate cursor-pointer"
                        >
                          {art.title}
                        </h4>
                        <span className="text-[11px] text-stone-400">
                          {art.category} • بقلم {art.author.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-xs text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1 font-medium">
                        <Eye className="w-3.5 h-3.5" />
                        {art.views}
                      </span>
                      <button
                        onClick={() => onOpenArticleEditor(art)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-amber-500 transition-colors"
                        title="تعديل"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Shortcuts Card */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold font-arabic text-stone-900 dark:text-stone-100 mb-2">
                  إجراءات وتحكم سريع
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-5">
                  إدارة محتوى المنصة وإجراء التعديلات المباشرة
                </p>

                <div className="space-y-2.5">
                  <button
                    onClick={() => onOpenArticleEditor(null)}
                    className="w-full p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-bold transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      كتابة ونشر مقال جديد
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveTab('categories')}
                    className="w-full p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 text-stone-700 dark:text-stone-200 text-xs font-semibold transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-amber-500" />
                      إدارة وتعديل أقسام الموقع
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 text-stone-700 dark:text-stone-200 text-xs font-semibold transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-stone-500" />
                      تخصيص اسم وهوية الموقع
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Data Export / Backup note */}
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>حفظ تلقائي محلي دائم</span>
                <button 
                  onClick={handleExportBackup}
                  className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  نسخة احتياطية
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: ARTICLES MANAGEMENT */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="ابحث في المقالات أو الكُتّاب..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full py-2 pl-4 pr-9 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="py-2 px-3 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onOpenArticleEditor(null)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مقال جديد</span>
            </button>
          </div>

          {/* Articles Table */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">المقال</th>
                    <th className="py-3.5 px-4">القسم</th>
                    <th className="py-3.5 px-4">الكاتب</th>
                    <th className="py-3.5 px-4">تاريخ النشر</th>
                    <th className="py-3.5 px-4">المشاهدات</th>
                    <th className="py-3.5 px-4">الحالة</th>
                    <th className="py-3.5 px-4 text-center">إجراءات التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-stone-400">
                        لم يتم العثور على مقالات تطابق هذا البحث.
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3 max-w-sm">
                            <img src={art.coverImage} alt={art.title} className="w-12 h-9 rounded-lg object-cover shrink-0" />
                            <div className="min-w-0">
                              <span 
                                onClick={() => onViewArticle(art)}
                                className="font-bold text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer line-clamp-1 text-xs sm:text-sm"
                              >
                                {art.title}
                              </span>
                              <span className="text-[11px] text-stone-400 line-clamp-1">{art.excerpt}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            {art.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-stone-700 dark:text-stone-300 font-medium">
                          {art.author.name}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-stone-400">
                          {art.publishedAt}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-medium text-stone-700 dark:text-stone-300">
                          {art.views.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {art.featured ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                              <Sparkles className="w-3 h-3" />
                              المقال المميز
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">عادي</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* Toggle Feature */}
                            <button
                              onClick={() => handleToggleFeatured(art.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                art.featured
                                  ? 'bg-amber-500 text-stone-950 font-bold'
                                  : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-amber-500'
                              }`}
                              title={art.featured ? 'إلغاء التمييز' : 'تثبيت كمقال مميز في الواجهة'}
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>

                            {/* View Live */}
                            <button
                              onClick={() => onViewArticle(art)}
                              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-blue-500 transition-colors"
                              title="عرض المقال في الواجهة"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => onOpenArticleEditor(art)}
                              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-amber-500 transition-colors"
                              title="تعديل محتوى المقال"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Duplicate */}
                            <button
                              onClick={() => handleDuplicateArticle(art)}
                              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                              title="تكرار المقال"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setArticleToDelete(art)}
                              className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-stone-400 hover:text-rose-600 transition-colors"
                              title="حذف المقال"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          
          {/* Add Category Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
            <h3 className="text-base font-bold font-arabic text-stone-900 dark:text-stone-100 mb-1">
              إضافة قسم أو تصنيف جديد
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              ستظهر الأقسام الجديدة فوراً في شريط التصفح والفلترة في الصفحة الرئيسية
            </p>

            <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
              <input
                type="text"
                required
                placeholder="اسم القسم الجديد (مثال: الفلسفة والأفكار)..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة القسم</span>
              </button>
            </form>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const count = articles.filter(a => a.category === cat).length;
              const isAll = cat === 'الكل';

              return (
                <div 
                  key={cat}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                      {count}
                    </div>
                    <div>
                      {editingCategory?.oldName === cat ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingCategory.newName}
                            onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                            className="px-2 py-1 text-xs rounded border border-amber-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                          />
                          <button
                            onClick={handleSaveEditCategory}
                            className="p-1 rounded bg-amber-500 text-stone-950"
                            title="حفظ"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">{cat}</h4>
                          <span className="text-[11px] text-stone-400">{count} مقال مرتبط</span>
                        </>
                      )}
                    </div>
                  </div>

                  {!isAll && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingCategory({ oldName: cat, newName: cat })}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="تعديل الاسم"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                        title="حذف القسم"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 4: COMMENTS MODERATION */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="ابحث في نصوص التعليقات أو أسماء المعلقين..."
                value={commentSearch}
                onChange={(e) => setCommentSearch(e.target.value)}
                className="w-full py-2 pl-4 pr-9 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <span className="text-xs text-stone-400 font-medium">
              إجمالي التعليقات: {allComments.length}
            </span>
          </div>

          <div className="space-y-3">
            {allComments.length === 0 ? (
              <div className="text-center py-12 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 text-xs">
                لا توجد تعليقات حتى الآن أو لا توجد نتائج مطابقة للبحث.
              </div>
            ) : (
              allComments.map((item) => (
                <div 
                  key={item.comment.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                        {item.comment.authorName}
                      </span>
                      <span className="text-[11px] text-stone-400">• {item.comment.createdAt}</span>
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        مقال: {item.articleTitle}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {item.comment.content}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(item.articleId, item.comment.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                    title="حذف التعليق"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف التعليق</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold font-arabic text-stone-900 dark:text-stone-100">
                قائمة المشتركين بالنشرة البريدية
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                تضم {subscribers.length} مشتركاً قاموا بالتسجيل عبر الموقع
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySubscribers}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedEmailsToast ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmailsToast ? 'تم نسخ القائمة!' : 'نسخ جميع العناوين'}</span>
              </button>
            </div>
          </div>

          {/* Add Manual Subscriber */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs">
            <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">إضافة بريد مشترك يدوياً</h4>
            <form onSubmit={handleAddSubscriber} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                placeholder="example@mail.com"
                value={newSubscriberEmail}
                onChange={(e) => setNewSubscriberEmail(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
              >
                إضافة
              </button>
            </form>
          </div>

          {/* Subscribers Table */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">البريد الإلكتروني</th>
                  <th className="py-3 px-4">تاريخ الاشتراك</th>
                  <th className="py-3 px-4 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {subscribers.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-4 text-stone-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-stone-800 dark:text-stone-200">{sub.email}</td>
                    <td className="py-3 px-4 text-stone-400">{sub.subscribedAt}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteSubscriber(sub.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                        title="إلغاء الاشتراك"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SITE SETTINGS & BRANDING */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          {settingsSavedToast && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-xs">
              <Check className="w-4 h-4" />
              <span>تم حفظ كافة إعدادات وتحديثات الموقع بنجاح!</span>
            </div>
          )}

          {/* Branding Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-arabic text-stone-900 dark:text-stone-100">
              هوية الموقع ونصوص العرض
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  اسم الموقع (Site Title)
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.siteTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  الشعار الفرعي (Slogan)
                </label>
                <input
                  type="text"
                  value={settingsForm.siteSlogan}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteSlogan: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                الوصف التعريفي بالموقع (Meta Description)
              </label>
              <textarea
                rows={2}
                value={settingsForm.siteDescription}
                onChange={(e) => setSettingsForm({ ...settingsForm, siteDescription: e.target.value })}
                className="w-full p-3 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                رسالة التذييل (Footer Philosophy)
              </label>
              <textarea
                rows={2}
                value={settingsForm.footerText}
                onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                className="w-full p-3 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 resize-none"
              />
            </div>
          </div>

          {/* Announcement Bar Control */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-arabic text-stone-900 dark:text-stone-100">
                  شريط الإعلانات والتنبيهات العلوي (Announcement Bar)
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  شريط مميز يظهر أعلى الموقع لجميع الزوار للإعلانات الهامة
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.announcement.enabled}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    announcement: { ...settingsForm.announcement, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {settingsForm.announcement.enabled && (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    نص الإعلان أو التنبيه
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcement.text}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      announcement: { ...settingsForm.announcement, text: e.target.value }
                    })}
                    placeholder="مثال: نرحب بجميع الكُتّاب الجدد في منصة مقالات..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    نص الزر التفاعلي (اختياري)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcement.linkText || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      announcement: { ...settingsForm.announcement, linkText: e.target.value }
                    })}
                    placeholder="مثال: اقرأ المزيد"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Backup & System Reset */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-arabic text-stone-900 dark:text-stone-100">
              النسخ الاحتياطي واستعادة البيانات
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              يمكنك تصدير نسخة كاملة بصيغة JSON تشمل كل المقالات والتعليقات والإعدادات للرجوع إليها أو نقلها.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-amber-500" />
                <span>تصدير نسخة احتياطية (Export JSON)</span>
              </button>

              <label className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-blue-500" />
                <span>استيراد نسخة سابقة (Import JSON)</span>
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm('هل أنت متأكد من رغبتك في استعادة البيانات الأصلية للموقع؟ سيتم استرجاع مقالات البداية.')) {
                    onResetToDefaults();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 transition-colors mr-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>استعادة البيانات الافتراضية</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديلات في الموقع</span>
            </button>
          </div>

        </form>
      )}

      {/* Delete Article Confirmation Dialog */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                تأكيد حذف المقال نهائياً
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                هل أنت متأكد من حذف مقال: <strong>"{articleToDelete.title}"</strong>؟ لا يمكن التراجع عن هذه الخطوة.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => handleDeleteArticle(articleToDelete.id)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-sm"
              >
                حذف المقال الآن
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
