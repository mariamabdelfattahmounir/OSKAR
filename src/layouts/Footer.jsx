import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';

export const Footer = () => {
  const { isRtl } = useI18n();
  const { isDark } = useTheme();

  const logoPath = isDark ? '/assets/logo/Logo_DarkMode.png' : '/assets/logo/Logo_LightMode.png';

  const navLinks = isRtl
    ? [
        { label: 'القدرات والخدمات', href: '#capabilities' },
        { label: 'منهجية العمل', href: '#methodology' },
        { label: 'عن المنصة', href: '#about' },
      ]
    : [
        { label: 'Capabilities', href: '#capabilities' },
        { label: 'Methodology', href: '#methodology' },
        { label: 'About', href: '#about' },
      ];

  return (
    <footer className="bg-slate-100 dark:bg-[#080e1e] text-slate-700 dark:text-gray-300 py-12 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-start">
          <Link to="/" className="flex items-center shrink-0 text-decoration-none">
            <img
              src={logoPath}
              alt="oskar medstat research system"
              className="h-10 md:h-14 w-auto object-contain max-h-14"
              onError={(e) => {
                e.target.onerror = null;
              }}
            />
          </Link>
          <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">
            {isRtl
              ? '© 2026 جميع الحقوق محفوظة لنظام أوسكار للأبحاث والإحصاء الطبي.'
              : '© 2026 oskar medstat research system. All rights reserved.'}
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-primary dark:hover:text-white transition-colors text-decoration-none text-slate-600 dark:text-gray-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
