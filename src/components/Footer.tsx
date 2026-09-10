import React, { useState } from 'react';
import { Feather, Send, CheckCircle2, Heart, Shield, Crown } from 'lucide-react';
import { Category, SiteSettings } from '../types';

interface FooterProps {
  categories: Category[];
  onSelectCategory: (cat: Category) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onOpenAdminDashboard?: () => void;
  onSubscribe?: (email: string) => void;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ 
  categories, 
  onSelectCategory,
  isAdmin,
  onOpenAdminLogin,
  onOpenAdminDashboard,
  onSubscribe,
  siteSettings
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSubscribe?.(email);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="mt-20 border-t border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 flex items-center justify-center text-stone-950 shadow-sm">
                <Feather className="w-5 h-5 text-stone-950" />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-[8px] font-bold text-white dark:text-stone-900">
                  ★
                </span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight font-arabic text-stone-950 dark:text-stone-50 block leading-none">
                  {siteSettings?.siteTitle || 'مدونة المجتهد'}
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold block mt-1 font-arabic">
                  {siteSettings?.siteSlogan || 'منصة الفكر والمعرفة الرصينة'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-sm font-arabic">
              {siteSettings?.siteDescription || 'المساحة الرقمية الرائدة للمجتهدين وصنّاع الأثر في العالم العربي؛ تحليلات برمجية معمقة، رؤى في الذكاء الاصطناعي، وأدلة ريادة الأعمال بعيداً عن السطحية والإثارة المبتذلة.'}
            </p>

            <div className="pt-2 text-xs text-stone-400 flex items-center gap-1.5 font-medium">
              <span>صُممت بعناية فائقة للمجتهدين وطالبي المعرفة</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            </div>
          </div>

          {/* Col 2: Categories Nav */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 font-arabic">
              أقسام مدونة المجتهد
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.filter(c => c !== 'الكل').map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-500 transition-colors text-stone-600 dark:text-stone-400 font-medium"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Newsletter Box */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 font-arabic">
              نشرة المجتهد الأسبوعية
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              انضم لأكثر من 5,000 مجتهد يتلقون ملخصات أسبوعية لأهم ما يُنشر في التقنية والذكاء الاصطناعي وريادة الأعمال.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>تم اشتراكك بنجاح! نرحب بك في مجتمع مدونة المجتهد.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="أدخل بريدك المهني..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>اشتراك</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom divider & copyright */}
        <div className="mt-12 pt-6 border-t border-stone-200/60 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <span>{siteSettings?.footerText || '© جميع الحقوق محفوظة لمدونة المجتهد — منصة الفكر والمعرفة الرصينة.'}</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer">ميثاق المجتهد</span>
            <span className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer">سياسة النشر والخصوصية</span>
            
            {/* Admin Quick Portal Access */}
            {isAdmin ? (
              <button
                onClick={onOpenAdminDashboard}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>لوحة تحكم المشرف (نشطة)</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
                title="بوابة إدارة الموقع للمسؤول"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>إدارة الموقع</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
