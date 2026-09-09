import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import Icon from '../design-system/components/Icon';
import researcherNav from '../config/navigation/researcher.nav';
import reviewerNav from '../config/navigation/reviewer.nav';
import supervisorNav from '../config/navigation/supervisor.nav';
import institutionNav from '../config/navigation/institution.nav';
import adminNav from '../config/navigation/admin.nav';

export const Sidebar = ({ mobileOpen = false, onCloseMobile = () => {} }) => {
  const { role } = useAuth();
  const { lang, isRtl } = useI18n();
  const location = useLocation();
  const currentPath = location.pathname;

  const getNavItems = () => {
    switch (role) {
      case 'researcher':
        return researcherNav;
      case 'reviewer':
        return reviewerNav;
      case 'supervisor':
        return supervisorNav;
      case 'institution':
        return institutionNav;
      case 'admin':
        return adminNav;
      default:
        return researcherNav;
    }
  };

  const navItems = getNavItems();

  const isNavItemActive = (item) => {
    if (item.key === 'myStudies') {
      return currentPath === '/researcher/studies' || currentPath === '/researcher/studies/' || currentPath === '/researcher/studies/view' || currentPath === '/researcher/study/view';
    }
    if (item.key === 'createNewStudy') {
      return currentPath.startsWith('/researcher/studies/new') || 
             currentPath.startsWith('/researcher/study/new') || 
             currentPath.startsWith('/researcher/studies/continue') || 
             currentPath.startsWith('/researcher/study/continue') || 
             currentPath.startsWith('/researcher/studies/create') || 
             currentPath.startsWith('/researcher/study/create');
    }
    if (item.key === 'statistics') {
      return currentPath.startsWith('/researcher/statistics') || currentPath.startsWith('/researcher/statistical-engine');
    }
    if (item.key === 'billing') {
      return currentPath.startsWith('/billing') || currentPath.startsWith('/researcher/billing');
    }
    return currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Role Identity Tag */}
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Current Workspace
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
            {role || 'Researcher'} Platform
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const label = lang === 'ar' && item.labelAr ? item.labelAr : item.label;
            const active = isNavItemActive(item);
            return (
              <NavLink
                key={item.key}
                to={item.path}
                onClick={onCloseMobile}
                className={() =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon name={item.icon} size="md" />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 text-center">
        OSKAR MedStat v2.0
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (Hidden on mobile < md) */}
      <aside
        className={`hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 ${
          isRtl ? 'border-l border-r-0' : 'border-r border-l-0'
        } border-slate-200 dark:border-slate-800 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto transition-colors z-30`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Off-Canvas Drawer (< md) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          ></div>

          {/* Off-canvas sidebar panel */}
          <div
            className={`relative flex-1 max-w-xs w-full bg-white dark:bg-slate-900 h-full shadow-2xl z-50 ${
              isRtl ? 'mr-auto' : 'ml-0'
            }`}
          >
            {/* Close button inside mobile menu */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Navigation Menu
              </span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <Icon name="close" size="md" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
