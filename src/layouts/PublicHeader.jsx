import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import Icon from '../design-system/components/Icon';

export const PublicHeader = () => {
  const { toggleTheme, isDark } = useTheme();
  const { lang, toggleLang, isRtl } = useI18n();

  const logoPath = isDark ? '/assets/logo/Logo_DarkMode.png' : '/assets/logo/Logo_LightMode.png';

  // Group A: Public Navigation Links
  const navGroup = (
    <nav
      className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-700 dark:text-slate-200 shrink-0"
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      {isRtl ? (
        <>
          <a href="#about" className="hover:text-primary dark:hover:text-teal-400 transition-colors text-decoration-none py-2">
            عن المنصة
          </a>
          <a href="#services" className="hover:text-primary dark:hover:text-teal-400 transition-colors text-decoration-none py-2">
            الخدمات والباقات
          </a>
          <a href="#methodology" className="hover:text-primary dark:hover:text-teal-400 transition-colors text-decoration-none py-2">
            المنهجية
          </a>
          <a href="#capabilities" className="hover:text-primary dark:hover:text-teal-400 transition-colors text-decoration-none py-2">
            الإمكانيات
          </a>
        </>
      ) : (
        <>
          <a href="#capabilities" className="hover:text-primary dark:hover:text-teal-400 transition-colors text-decoration-none py-2">
            Capabilities
          </a>
          <a href="#methodology" className="hover:text-primary dark:hover:text-teal-400 transition-colors text-decoration-none py-2">
            Methodology
          </a>
          <a href="#services" className="hover:text-primary dark:hover:text-teal-400 transition-colors text-decoration-none py-2">
            Services & Rates
          </a>
          <a href="#about" className="hover:text-primary dark:hover:text-teal-400 transition-colors text-decoration-none py-2">
            About OSKAR
          </a>
        </>
      )}
    </nav>
  );

  // Group B: Header Actions (Language, Theme, Log in, Create account)
  const actionsGroup = (
    <div
      className="flex items-center gap-2 md:gap-3 shrink-0"
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      {/* Language Toggle */}
      <button
        type="button"
        onClick={toggleLang}
        aria-label="Toggle language"
        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700/80 cursor-pointer flex items-center gap-1.5"
        title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
      >
        <Icon name="language" size="sm" />
        <span>{isRtl ? 'AR / EN' : 'EN / AR'}</span>
      </button>

      {/* Theme Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer flex items-center justify-center"
        title={isDark ? (isRtl ? 'النمط الفاتح' : 'Switch to Light Mode') : (isRtl ? 'النمط الداكن' : 'Switch to Dark Mode')}
      >
        <Icon name={isDark ? 'light_mode' : 'dark_mode'} size="md" />
      </button>

      {/* Auth Actions */}
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-teal-400 px-3 py-2 text-decoration-none transition-colors"
        >
          {isRtl ? 'تسجيل الدخول' : 'Log in'}
        </Link>
        <Link
          to="/auth/role-selection"
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-all shadow-sm text-decoration-none"
        >
          {isRtl ? 'إنشاء حساب' : 'Create account'}
        </Link>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      {/* 
        Outer container uses style={{ direction: 'ltr' }} so that physical screen layout order 
        is ALWAYS Left-to-Right starting with the FIXED LOGO BRAND ANCHOR.
      */}
      <div
        className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4"
        style={{ direction: 'ltr' }}
      >
        {/* FIXED LOGO BRAND ANCHOR (Always physical left) */}
        <Link
          to="/"
          className="flex items-center shrink-0 text-decoration-none"
          title="OSKAR MedStat Research System"
        >
          <img
            src={logoPath}
            alt="OSKAR MedStat Research System"
            className="h-10 md:h-14 w-auto object-contain max-h-14"
            onError={(e) => {
              e.target.onerror = null;
            }}
          />
        </Link>

        {/* 
          TWO GROUPS SWITCH POSITIONS BASED ON LANGUAGE:
          EN: LOGO -> GROUP A (Navigation) -> GROUP B (Actions)
          AR: LOGO -> GROUP B (Actions) -> GROUP A (Arabic Navigation)
        */}
        <div className="flex-1 flex items-center justify-between gap-6 pl-4 md:pl-8" style={{ direction: 'ltr' }}>
          {/* Left group (immediately next to logo) */}
          {isRtl ? actionsGroup : navGroup}

          {/* Right group (opposite side of header) */}
          {isRtl ? navGroup : actionsGroup}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
