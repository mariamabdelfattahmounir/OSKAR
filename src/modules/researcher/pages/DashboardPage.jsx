import React from 'react';
import ResearcherDashboardHeader from '../components/ResearcherDashboardHeader';
import DashboardKpiGrid from '../components/DashboardKpiGrid';
import ActiveStudiesSection from '../components/ActiveStudiesSection';
import DashboardUpdatesSection from '../components/DashboardUpdatesSection';
import AiToolkitBanner from '../components/AiToolkitBanner';
import QuickLaunchTemplates from '../components/QuickLaunchTemplates';
import StatisticalToolsGrid from '../components/StatisticalToolsGrid';

export const DashboardPage = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 sm:space-y-7 pb-12">
      {/* 01. Dashboard Header / Introduction */}
      <ResearcherDashboardHeader />

      {/* 02. Research KPI Metric Overview */}
      <DashboardKpiGrid />

      {/* 03. Active Clinical Studies Table */}
      <ActiveStudiesSection />

      {/* 04. Updates & Notifications Section */}
      <DashboardUpdatesSection />

      {/* 05. AI Research Credits / Quota Banner */}
      <AiToolkitBanner />

      {/* 06. Quick Launch New Research Protocol Templates (2x2 Grid) */}
      <QuickLaunchTemplates />

      {/* 07. OSKAR Statistical & Research Tools */}
      <StatisticalToolsGrid />
    </div>
  );
};

export default DashboardPage;
