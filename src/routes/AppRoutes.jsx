import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import AppShell from '../layouts/AppShell';
import ProtectedRoute from './ProtectedRoute';

// Public & Auth Pages
import LandingPage from '../modules/public/pages/LandingPage';
import LoginPage from '../modules/auth/pages/LoginPage';
import RoleSelectionPage from '../modules/auth/pages/RoleSelectionPage';
import RegisterMultiStepPage from '../modules/auth/pages/RegisterMultiStepPage';
import PendingVerificationPage from '../modules/auth/pages/PendingVerificationPage';
import BillingPage from '../modules/billing/pages/BillingPage';

// Researcher Pages
import ResearcherDashboard from '../modules/researcher/pages/DashboardPage';
import ResearcherStudies from '../modules/researcher/pages/StudiesPage';
import ResearcherStudyNew from '../modules/researcher/pages/StudyNewPage';
import ResearcherStudyContinue from '../modules/researcher/pages/StudyContinuePage';
import ResearcherSampleSize from '../modules/researcher/pages/SampleSizePage';
import ResearcherStatistics from '../modules/researcher/pages/StatisticsPage';
import StudyCreateRctPage from '../modules/researcher/pages/StudyCreateRctPage';
import StudyCreateProspectivePage from '../modules/researcher/pages/StudyCreateProspectivePage';
import StudyCreateRetrospectivePage from '../modules/researcher/pages/StudyCreateRetrospectivePage';
import StudyCreateCrossSectionalPage from '../modules/researcher/pages/StudyCreateCrossSectionalPage';
import StudyWorkspacePage from '../modules/researcher/pages/StudyWorkspacePage';

// Reviewer Pages
import ReviewerDashboard from '../modules/reviewer/pages/DashboardPage';
import ReviewerEvaluation from '../modules/reviewer/pages/EvaluationPage';
import ReviewerArchive from '../modules/reviewer/pages/ArchivePage';

// Role Dashboards
import SupervisorDashboard from '../modules/supervisor/pages/DashboardPage';
import InstitutionDashboard from '../modules/institution/pages/DashboardPage';
import AdminDashboard from '../modules/admin/pages/DashboardPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/role-selection" element={<RoleSelectionPage />} />
        <Route path="/auth/register" element={<RoleSelectionPage />} />
        <Route path="/auth/register/:role/:step" element={<RegisterMultiStepPage />} />
        <Route path="/auth/register/:role" element={<RegisterMultiStepPage />} />
        <Route path="/auth/pending" element={<PendingVerificationPage />} />
      </Route>

      {/* Protected App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        {/* Billing */}
        <Route path="/billing" element={<BillingPage />} />

        {/* Researcher Routes */}
        <Route
          path="/researcher/dashboard"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <ResearcherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/studies"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <ResearcherStudies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/study/new"
          element={<Navigate to="/researcher/studies/new" replace />}
        />
        <Route
          path="/researcher/studies/new"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <ResearcherStudyNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/study/continue"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <ResearcherStudyContinue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/studies/continue"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <ResearcherStudyContinue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/study/view"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <StudyWorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/studies/view"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <StudyWorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/sample-size"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <ResearcherSampleSize />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/studies/create"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <ResearcherStudyNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/study/create"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <ResearcherStudyNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/statistical-engine"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <ResearcherStatistics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/billing"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/statistics"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <ResearcherStatistics />
            </ProtectedRoute>
          }
        />
        {/* RCT Direct Routes */}
        <Route
          path="/researcher/study/create/rct"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <StudyCreateRctPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/studies/create/rct"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <StudyCreateRctPage />
            </ProtectedRoute>
          }
        />

        {/* Prospective Direct Routes */}
        <Route
          path="/researcher/study/create/prospective"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <StudyCreateProspectivePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/studies/create/prospective"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <StudyCreateProspectivePage />
            </ProtectedRoute>
          }
        />

        {/* Retrospective Direct Routes */}
        <Route
          path="/researcher/study/create/retrospective"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <StudyCreateRetrospectivePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/studies/create/retrospective"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <StudyCreateRetrospectivePage />
            </ProtectedRoute>
          }
        />

        {/* Cross-Sectional Direct Routes */}
        <Route
          path="/researcher/study/create/cross-sectional"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <StudyCreateCrossSectionalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/studies/create/cross-sectional"
          element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <StudyCreateCrossSectionalPage />
            </ProtectedRoute>
          }
        />

        {/* Reviewer Routes */}
        <Route
          path="/reviewer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
              <ReviewerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/evaluations/:id"
          element={
            <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
              <ReviewerEvaluation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/archive"
          element={
            <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
              <ReviewerArchive />
            </ProtectedRoute>
          }
        />

        {/* Supervisor Routes */}
        <Route
          path="/supervisor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
              <SupervisorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Institution Routes */}
        <Route
          path="/institution/dashboard"
          element={
            <ProtectedRoute allowedRoles={['institution', 'admin']}>
              <InstitutionDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
