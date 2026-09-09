import React from 'react';
import { Outlet } from 'react-router-dom';
import WorkspaceHeader from './WorkspaceHeader';
import Sidebar from './Sidebar';

export const AppShell = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1329] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <WorkspaceHeader onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />
      <div className="flex flex-1 relative">
        <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />
        <main className="flex-1 p-4 md:p-6 max-w-[1400px] w-full mx-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
