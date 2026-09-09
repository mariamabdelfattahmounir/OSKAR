import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import Icon from '../design-system/components/Icon';

export const WorkspaceHeader = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { lang, toggleLang, isRtl } = useI18n();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Mock Notification Data (Incoming Platform & Academic Updates)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'protocol',
      titleEn: 'Protocol Status Updated',
      titleAr: 'تم تحديث حالة البروتوكول',
      descEn: 'Your RCT study protocol #2026-RCT-01 has been approved by the Ethics Committee.',
      descAr: 'تم اعتماد بروتوكول الدراسة السريرية #2026-RCT-01 من قبل لجنة الأخلاقيات الأكاديمية.',
      timeEn: '10m ago',
      timeAr: 'منذ 10 دقائق',
      unread: true,
      icon: 'task_alt',
    },
    {
      id: 2,
      type: 'review',
      titleEn: 'Peer Review Completed',
      titleAr: 'اكتملت مراجعة النظراء',
      descEn: 'Reviewer Dr. Ahmed assigned feedback & verification notes to your study dataset.',
      descAr: 'قام المحكم د. أحمد بإضافة ملاحظات التقييم والتحقق على مجموعة بيانات الدراسة.',
      timeEn: '1h ago',
      timeAr: 'منذ ساعة',
      unread: true,
      icon: 'rate_review',
    },
    {
      id: 3,
      type: 'system',
      titleEn: 'OSKAR Engine Update',
      titleAr: 'تحديث نظام أوسكار الإحصائي',
      descEn: 'Advanced ANOVA & Survival Analysis module (v2.4) is now available in your workspace.',
      descAr: 'الموديل المتقدم لتحليل البقاء والتباين (v2.4) متاح الآن في بيئة عملك.',
      timeEn: '1d ago',
      timeAr: 'منذ يوم',
      unread: false,
      icon: 'system_update_alt',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const logoPath = isDark ? '/assets/logo/Logo_DarkMode.png' : '/assets/logo/Logo_LightMode.png';
  const userInitials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2) : 'U';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      <div
        className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4"
        style={{ direction: 'ltr' }}
      >
        {/* Left: Mobile Toggle + Fixed Logo Brand Anchor */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              <Icon name="menu" size="md" />
            </button>
          )}
          <Link
            to={user?.defaultRoute || '/researcher/dashboard'}
            className="flex items-center shrink-0 text-decoration-none"
            title="OSKAR Workspace"
          >
            <img
              src={logoPath}
              alt="OSKAR MedStat System"
              className="h-10 sm:h-12 w-auto object-contain max-h-12"
              onError={(e) => {
                e.target.onerror = null;
              }}
            />
          </Link>
        </div>

        {/* Right: Authenticated Workspace Controls */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
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

          {/* Dedicated Notifications Button & Dropdown Popover */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer relative flex items-center justify-center ${
                notificationsOpen ? 'bg-slate-100 dark:bg-slate-800 text-primary dark:text-teal-400' : ''
              }`}
              title={isRtl ? 'الإشعارات' : 'Notifications'}
              aria-label="Notifications"
            >
              <Icon name="notifications" size="md" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-white dark:ring-[#0b1329] animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {notificationsOpen && (
              <div
                className={`absolute ${
                  isRtl ? 'left-0 md:left-auto md:-right-12' : 'right-0'
                } top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-w-[calc(100vw-2rem)]`}
                style={{ direction: isRtl ? 'rtl' : 'ltr' }}
              >
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {isRtl ? 'الإشعارات' : 'Notifications'}
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary dark:text-teal-300">
                        {unreadCount} {isRtl ? 'جديد' : 'new'}
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-primary dark:text-teal-400 hover:underline cursor-pointer bg-transparent border-0 p-0"
                    >
                      {isRtl ? 'تحديد الكل كقروء' : 'Mark all read'}
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => toggleNotificationRead(n.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          n.unread
                            ? 'bg-primary/5 dark:bg-teal-950/20 border-primary/20 dark:border-teal-800/40'
                            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 opacity-80'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            n.unread
                              ? 'bg-primary/15 text-primary dark:text-teal-300'
                              : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Icon name={n.icon} size="sm" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {isRtl ? n.titleAr : n.titleEn}
                            </h4>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                              {isRtl ? n.timeAr : n.timeEn}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                            {isRtl ? n.descAr : n.descEn}
                          </p>
                        </div>

                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                      {isRtl ? 'لا توجد إشعارات حالياً' : 'No notifications available'}
                    </div>
                  )}
                </div>

                {/* Panel Footer */}
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {isRtl ? 'التحديثات الأكاديمية ونظام أوسكار' : 'Academic & OSKAR System Updates'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5"></div>

          {/* User Profile Dropdown Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary dark:text-teal-400 font-bold text-xs flex items-center justify-center border border-primary/20">
                {userInitials}
              </div>
              <div className="hidden md:block text-left rtl:text-right" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {user?.name || 'Dr. Researcher'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                  {user?.role || 'researcher'}
                </div>
              </div>
              <Icon name="expand_more" size="sm" className="text-slate-400" />
            </button>

            {profileOpen && (
              <div
                className={`absolute ${
                  isRtl ? 'left-0' : 'right-0'
                } top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
                style={{ direction: isRtl ? 'rtl' : 'ltr' }}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Researcher'}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {user?.email || 'user@oskar.edu'}
                  </div>
                  <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary dark:text-teal-300 uppercase">
                    {user?.role || 'researcher'}
                  </div>
                </div>

                <Link
                  to={user?.defaultRoute || '/researcher/dashboard'}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-decoration-none"
                >
                  <Icon name="dashboard" size="sm" />
                  <span>{isRtl ? 'لوحة التحكم' : 'Dashboard Workspace'}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left rtl:text-right border-t border-slate-100 dark:border-slate-800 cursor-pointer"
                >
                  <Icon name="logout" size="sm" />
                  <span>{isRtl ? 'تسجيل الخروج' : 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
