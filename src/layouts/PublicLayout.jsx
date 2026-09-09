import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import Footer from './Footer';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1329] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
