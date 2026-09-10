import React from 'react';
import { 
  BookOpen, 
  Bookmark, 
  PenSquare, 
  Search, 
  Moon, 
  Sun, 
  X, 
  Menu, 
  Compass, 
  Shield, 
  ShieldCheck, 
  Sparkles,
  Crown,
  Command,
  Feather
} from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  currentView: 'home' | 'bookmarks' | 'admin';
  setCurrentView: (view: 'home' | 'bookmarks' | 'admin') => void;
  bookmarksCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onOpenNewArticle: () => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onExitAdmin: () => void;
  siteSettings: SiteSettings;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  bookmarksCount,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
  onOpenNewArticle,
  isAdmin,
  onOpenAdminLogin,
  onExitAdmin,
  siteSettings,
  onOpenCommandPalette
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <>
      {/* Top Editorial Announcement */}
      {siteSettings.announcement?.enabled && siteSettings.announcement.text && (
        <div className="bg-amber-500 text-stone-950 py-1.5 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 border-b border-amber-600/30">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{siteSettings.announcement.text}</span>
          {siteSettings.announcement.linkText && (
            <span 
              onClick={() => {
                if (isAdmin) setCurrentView('admin');
              }}
              className="underline mr-2 cursor-pointer hover:opacity-80"
            >
              {siteSettings.announcement.linkText}
            </span>
          )}
        </div>
      )}

      <header className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md ${
        isDarkMode 
          ? 'bg-stone-950/90 border-stone-800 text-stone-100' 
          : 'bg-white/90 border-stone-200/80 text-stone-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-4">
            
            {/* Logo & Brand: مدونة المجتهد */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-3 text-right group focus:outline-none"
              >
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 flex items-center justify-center text-stone-950 shadow-sm group-hover:scale-105 transition-transform">
                  <Feather className="w-5 h-5 text-stone-950" />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-[8px] font-bold text-white dark:text-stone-900">
                    ★
                  </span>
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight block font-arabic leading-none text-stone-900 dark:text-stone-50">
                    {siteSettings.siteTitle || 'مدونة المجتهد'}
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold block mt-1 font-arabic">
                    {siteSettings.siteSlogan || 'منصة الفكر والمعرفة الرصينة'}
                  </span>
                </div>
              </button>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 mr-4">
                <button
                  onClick={() => setCurrentView('home')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    currentView === 'home'
                      ? isDarkMode ? 'bg-stone-800 text-amber-400 font-semibold' : 'bg-stone-100 text-stone-900 font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100/50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>المقالات</span>
                </button>

                <button
                  onClick={() => setCurrentView('bookmarks')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    currentView === 'bookmarks'
                      ? isDarkMode ? 'bg-stone-800 text-amber-400 font-semibold' : 'bg-stone-100 text-stone-900 font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100/50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>المحفوظات</span>
                  {bookmarksCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                      {bookmarksCount}
                    </span>
                  )}
                </button>

                {/* Admin Dashboard Navigation Tab */}
                {isAdmin ? (
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                      currentView === 'admin'
                        ? 'bg-amber-500 text-stone-950 shadow-xs'
                        : 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                    <span>لوحة التحكم CMS</span>
                  </button>
                ) : null}
              </nav>
            </div>

            {/* High-Performance Spotlight Search Input - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-4">
              <div 
                onClick={onOpenCommandPalette}
                className={`relative w-full cursor-pointer group py-2 pl-3 pr-10 rounded-xl text-sm transition-all border flex items-center justify-between ${
                  isDarkMode 
                    ? 'bg-stone-900/90 border-stone-800 text-stone-300 hover:border-stone-700' 
                    : 'bg-stone-100/90 border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-amber-500 transition-colors" />
                <span className="text-xs text-stone-400 truncate font-arabic">
                  {searchQuery ? `البحث: ${searchQuery}` : 'ابحث في مقالات مدونة المجتهد...'}
                </span>
                
                <div className="flex items-center gap-1">
                  {searchQuery && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery('');
                      }}
                      className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold text-stone-400 bg-stone-200/60 dark:bg-stone-800 rounded border border-stone-300 dark:border-stone-700">
                    <Command className="w-2.5 h-2.5" />
                    <span>K</span>
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2">
              
              {/* Mobile Search Toggle / Command Palette */}
              <button
                onClick={onOpenCommandPalette || (() => setIsSearchOpen(!isSearchOpen))}
                className="lg:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="بحث"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Admin Button */}
              {isAdmin ? (
                <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <button
                    onClick={() => setCurrentView('admin')}
                    className="hover:underline"
                  >
                    لوحة المشرف
                  </button>
                  <button
                    onClick={onExitAdmin}
                    className="mr-1 text-stone-400 hover:text-rose-500 text-[10px]"
                    title="الخروج من وضع المسؤول"
                  >
                    (خروج)
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors"
                  title="تسجيل دخول المشرف لإدارة المقالات"
                >
                  <Shield className="w-3.5 h-3.5 text-stone-400" />
                  <span className="hidden xl:inline">دخول المشرف</span>
                </button>
              )}

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Write Article Button */}
              <button
                onClick={onOpenNewArticle}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 font-semibold text-xs transition-all shadow-xs active:scale-95"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>كتابة مقال</span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Drawer (fallback) */}
          {isSearchOpen && (
            <div className="lg:hidden py-3 border-t border-stone-200 dark:border-stone-800">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="ابحث في مقالات مدونة المجتهد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full py-2 pl-4 pr-10 rounded-xl text-sm ${
                    isDarkMode 
                      ? 'bg-stone-900 border border-stone-800 text-stone-100' 
                      : 'bg-stone-100 border border-stone-200 text-stone-900'
                  }`}
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Mobile Menu Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  استكشف المقالات
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('bookmarks');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <span className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  قائمتي المحفوظة
                </span>
                {bookmarksCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 font-bold">
                    {bookmarksCount}
                  </span>
                )}
              </button>

              {isAdmin ? (
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 bg-amber-500/15 text-amber-600 dark:text-amber-400"
                >
                  <Crown className="w-4 h-4" />
                  <span>لوحة تحكم المشرف</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAdminLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <Shield className="w-4 h-4" />
                  <span>تسجيل دخول المشرف</span>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenNewArticle();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 font-bold"
              >
                <PenSquare className="w-4 h-4" />
                <span>كتابة مقال جديد</span>
              </button>
            </div>
          )}

        </div>
      </header>
    </>
  );
};
