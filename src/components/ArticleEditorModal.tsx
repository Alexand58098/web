import React, { useState } from 'react';
import { 
  X, 
  PenSquare, 
  Image as ImageIcon, 
  Eye, 
  FileText, 
  Check, 
  Sparkles, 
  Heading1, 
  Heading2, 
  Quote, 
  List, 
  Code, 
  Bold 
} from 'lucide-react';
import { Article, Category, Author } from '../types';

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (article: Article) => void;
  categories: Category[];
  initialArticle?: Article | null;
}

const PRESET_COVERS = [
  { label: 'ذكاء اصطناعي وتجريد', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'كتاب وقراءة هادئة', url: 'https://images.unsplash.com/photo-1507842229451-79b1be88688e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'أعمال واستثمار', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'تركيز ومكتب عمل', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80' },
  { label: 'علوم وحوسبة', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'شبكات وسحابيات', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80' }
];

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  categories,
  initialArticle
}) => {
  const isEditing = Boolean(initialArticle);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<Category>('الذكاء الاصطناعي');
  const [tagsInput, setTagsInput] = useState('تقنية, أفكار, مقالات');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [authorName, setAuthorName] = useState('كاتب متميز');
  const [authorRole, setAuthorRole] = useState('باحث ومؤلف تقني');
  const [content, setContent] = useState(`## مقدمة المقال
اكتب هنا مقدمتك المشوقة التي تجذب القارئ وتوضح الفكرة الأساسية...

### المحور الأول
- النقطة الأولى بالتفصيل
- النقطة الثانية مع أمثلة واقعية

> "اقتباس ملهم أو خلاصة فكرية تعبر عن روح المقال"

### الخلاصة
لخص هنا أهم التوصيات والدروس المستفادة.`);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Load article values when editing or reset when creating
  React.useEffect(() => {
    if (isOpen) {
      if (initialArticle) {
        setTitle(initialArticle.title);
        setExcerpt(initialArticle.excerpt);
        setCategory(initialArticle.category);
        setTagsInput(initialArticle.tags.join(', '));
        setCoverImage(initialArticle.coverImage);
        setCustomCoverUrl(initialArticle.coverImage);
        setAuthorName(initialArticle.author?.name || 'كاتب متميز');
        setAuthorRole(initialArticle.author?.role || 'مؤلف وباحث');
        setContent(initialArticle.content);
      } else {
        setTitle('');
        setExcerpt('');
        setCategory(categories.find(c => c !== 'الكل') || 'الذكاء الاصطناعي');
        setTagsInput('تقنية, أفكار, مقالات');
        setCoverImage(PRESET_COVERS[0].url);
        setCustomCoverUrl('');
        setAuthorName('كاتب متميز');
        setAuthorRole('باحث ومؤلف تقني');
        setContent(`## مقدمة المقال
اكتب هنا مقدمتك المشوقة التي تجذب القارئ وتوضح الفكرة الأساسية...

### المحور الأول
- النقطة الأولى بالتفصيل
- النقطة الثانية مع أمثلة واقعية

> "اقتباس ملهم أو خلاصة فكرية تعبر عن روح المقال"

### الخلاصة
لخص هنا أهم التوصيات والدروس المستفادة.`);
      }
    }
  }, [isOpen, initialArticle]);

  if (!isOpen) return null;

  // Insert markdown helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('article-content-input') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'نص التنسيق';
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const calculateReadTime = (text: string) => {
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 180));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const author: Author = {
      id: initialArticle?.author?.id || ('custom-' + Date.now()),
      name: authorName.trim() || 'كاتب متميز',
      role: authorRole.trim() || 'كاتب ومفكر',
      avatar: initialArticle?.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      bio: initialArticle?.author?.bio || 'كاتب ومساهم في مجتمع المقالات والأفكار الرقمية.'
    };

    const finalCover = customCoverUrl.trim() || coverImage;

    const targetArticle: Article = {
      id: initialArticle ? initialArticle.id : ('art-' + Date.now()),
      title: title.trim(),
      slug: initialArticle ? initialArticle.slug : title.trim().toLowerCase().replace(/\s+/g, '-'),
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim(),
      coverImage: finalCover,
      category: category === 'الكل' ? 'الذكاء الاصطناعي' : category,
      tags: tags.length > 0 ? tags : ['مقالات'],
      author,
      publishedAt: initialArticle ? initialArticle.publishedAt : new Date().toISOString().split('T')[0],
      readTime: calculateReadTime(content),
      views: initialArticle ? initialArticle.views : 1,
      likes: initialArticle ? initialArticle.likes : 0,
      featured: initialArticle ? initialArticle.featured : false,
      comments: initialArticle ? initialArticle.comments : []
    };

    onPublish(targetArticle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <PenSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-arabic text-stone-900 dark:text-stone-100">
                {isEditing ? 'تعديل وتحديث المقال' : 'استوديو كتابة ونشر مقال'}
              </h2>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {isEditing ? 'تعديل المحتوى، التصنيف، الغلاف، وبيانات الكاتب مباشرة' : 'شارك أفكارك وتجاربك مع مجتمع القراء'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs: Editor vs Preview */}
        <div className="px-6 py-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-stone-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>محرر المحتوى</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة حية للمقال</span>
            </button>
          </div>

          <div className="text-xs text-stone-400 font-medium">
            وقت القراءة التقديري: {calculateReadTime(content)} دقائق
          </div>
        </div>

        {/* Modal Form Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'editor' ? (
            <form id="new-article-form" onSubmit={handlePublish} className="space-y-6">
              
              {/* Title & Excerpt */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    عنوان المقال الرئيسي *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: كيف تبني عادات ذهنية فائقة التركيز في 30 يوماً؟"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-base font-bold bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    ملخص المقال (المقتطف) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="نبذة تشويقية تظهر في بطاقة المقال تجذب القارئ..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full p-3 rounded-xl text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100 resize-none"
                  />
                </div>
              </div>

              {/* Category & Tags Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    تصنيف المقال
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100"
                  >
                    {categories.filter(c => c !== 'الكل').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    الكلمات الدلالية (مفصولة بفاصلة)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: ذكاء اصطناعي, تقنية, ابتكار"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Author Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    اسم الكاتب
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    صفة الكاتب أو تخصصه
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                  اختر صورة الغلاف
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                  {PRESET_COVERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCoverImage(preset.url);
                        setCustomCoverUrl('');
                      }}
                      className={`relative aspect-16/10 rounded-xl overflow-hidden border-2 transition-all ${
                        coverImage === preset.url && !customCoverUrl
                          ? 'border-amber-500 ring-2 ring-amber-500/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="أو ضع رابط صورة مخصصة (URL)..."
                  value={customCoverUrl}
                  onChange={(e) => setCustomCoverUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Content Body Editor with Formatting Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    محتوى المقال الكامل *
                  </label>
                  
                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => insertFormatting('## ')}
                      className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
                      title="عنوان رئيسي (H2)"
                    >
                      <Heading1 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('### ')}
                      className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
                      title="عنوان فرعي (H3)"
                    >
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold"
                      title="خط عريض"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('> "')}
                      className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
                      title="اقتباس"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('- ')}
                      className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
                      title="قائمة نقطية"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  id="article-content-input"
                  rows={10}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 rounded-2xl text-sm leading-relaxed bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100 font-arabic"
                />
              </div>

            </form>
          ) : (
            /* Live Preview Screen */
            <div className="space-y-6">
              <div className="aspect-16/9 rounded-2xl overflow-hidden bg-stone-100 max-h-[260px]">
                <img 
                  src={customCoverUrl || coverImage} 
                  alt={title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  {category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold mt-3 font-arabic text-stone-900 dark:text-stone-100">
                  {title || 'عنوان المقال التجريبي'}
                </h1>
                <p className="mt-2 text-stone-600 dark:text-stone-300 text-sm">
                  {excerpt || 'هذا ملخص المقال الذي سيظهر للقراء في صفحة الاستكشاف...'}
                </p>
                <div className="mt-3 text-xs text-stone-400">
                  بقلم: {authorName} ({authorRole}) • قراءة في {calculateReadTime(content)} دقائق
                </div>
              </div>

              <div className="pt-6 border-t border-stone-200 dark:border-stone-800 prose max-w-none text-stone-700 dark:text-stone-300 leading-relaxed font-arabic text-base whitespace-pre-line">
                {content}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800 text-xs font-medium transition-colors"
          >
            إلغاء
          </button>

          <button
            type="submit"
            form="new-article-form"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{isEditing ? 'حفظ التعديلات في المقال' : 'نشر المقال الآن'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
