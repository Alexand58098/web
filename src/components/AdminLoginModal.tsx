import React, { useState } from 'react';
import { Shield, KeyRound, X, CheckCircle, AlertCircle, ArrowLeft, Lock } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default allowed passcodes: 1234, admin, admin123, or empty
    const clean = passcode.trim().toLowerCase();
    if (clean === '1234' || clean === 'admin' || clean === 'admin123' || clean === '') {
      setError('');
      onLoginSuccess();
      onClose();
    } else {
      setError('رمز المرور غير صحيح. يمكنك استخدام الرمز الافتراضي (1234) أو النقر على الزر أدناه للدخول المباشر.');
    }
  };

  const handleQuickLogin = () => {
    setError('');
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-arabic text-stone-900 dark:text-stone-100">
            لوحة تحكم المسؤول (Admin Portal)
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
            التحكم الكامل في محتوى الموقع، المقالات، التصنيفات، والتعليقات مباشرة من الواجهة
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              رمز مرور الإدارة (PIN / Password)
            </label>
            <div className="relative">
              <input
                type="password"
                autoFocus
                placeholder="أدخل الرمز (الافتراضي: 1234)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                className="w-full py-2.5 pr-10 pl-4 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 dark:text-stone-100 text-left placeholder:text-right"
                dir="ltr"
              />
              <KeyRound className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-stone-400 mt-1.5">
              الرمز الافتراضي: <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-amber-600 dark:text-amber-400 font-bold">1234</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>تسجيل الدخول والتحكم</span>
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
          <button
            onClick={handleQuickLogin}
            type="button"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center justify-center gap-1.5 mx-auto py-1"
          >
            <CheckCircle className="w-4 h-4" />
            <span>دخول مباشر وسريع بنقرة واحدة كمسؤول</span>
          </button>
        </div>

      </div>
    </div>
  );
};
