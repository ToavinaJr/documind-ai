import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { QuotaProvider } from './context/QuotaContext';

import { PublicLayout } from './layouts/PublicLayout';
import { WorkspaceLayout } from './layouts/WorkspaceLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { SolutionsPage } from './pages/public/SolutionsPage';
import { PricingPage } from './pages/public/PricingPage';
import { TemplatesPage } from './pages/public/TemplatesPage';
import { AboutPage } from './pages/public/AboutPage';
import { FaqPage } from './pages/public/FaqPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Workspace Pages
import { DashboardPage } from './pages/workspace/DashboardPage';
import { ProjectsPage } from './pages/workspace/ProjectsPage';
import { DocumentsPage } from './pages/workspace/DocumentsPage';
import { DocumentDetailPage } from './pages/workspace/DocumentDetailPage';
import { OcrPage } from './pages/workspace/OcrPage';
import { AudioPage } from './pages/workspace/AudioPage';
import { AudioDetailPage } from './pages/workspace/AudioDetailPage';
import { VideoPage } from './pages/workspace/VideoPage';
import { VideoDetailPage } from './pages/workspace/VideoDetailPage';
import { DocumentStudioPage } from './pages/workspace/DocumentStudioPage';
import { PresentationsPage } from './pages/workspace/PresentationsPage';
import { VideoStudioPage } from './pages/workspace/VideoStudioPage';
import { ContentStudioPage } from './pages/workspace/ContentStudioPage';
import { WorkflowsPage } from './pages/workspace/WorkflowsPage';
import { WorkflowEditorPage } from './pages/workspace/WorkflowEditorPage';
import { TemplatesLibraryPage } from './pages/workspace/TemplatesLibraryPage';
import { HistoryPage } from './pages/workspace/HistoryPage';
import { UsageLimitsPage } from './pages/workspace/UsageLimitsPage';
import { BillingPage } from './pages/workspace/BillingPage';
import { MembersPage } from './pages/workspace/MembersPage';
import { RolesPage } from './pages/workspace/RolesPage';
import { SettingsPage } from './pages/workspace/SettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminOrganizationsPage } from './pages/admin/AdminOrganizationsPage';
import { AdminPlansPage } from './pages/admin/AdminPlansPage';
import { AdminFeaturesPage } from './pages/admin/AdminFeaturesPage';
import { AdminBillingPage } from './pages/admin/AdminBillingPage';
import { AdminSupportPage } from './pages/admin/AdminSupportPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <QuotaProvider>
            <BrowserRouter>
              <Routes>
                {/* 1. Public Space */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/solutions" element={<SolutionsPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/templates" element={<TemplatesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<LoginPage />} />
                </Route>

                {/* 2. Client Workspace with ProtectedRoute Guard */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/workspace" element={<WorkspaceLayout />}>
                    <Route index element={<Navigate to="/workspace/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="documents" element={<DocumentsPage />} />
                    <Route path="documents/:id" element={<DocumentDetailPage />} />
                    <Route path="ocr" element={<OcrPage />} />
                    <Route path="audio" element={<AudioPage />} />
                    <Route path="audio/:id" element={<AudioDetailPage />} />
                    <Route path="video" element={<VideoPage />} />
                    <Route path="video/:id" element={<VideoDetailPage />} />
                    <Route path="document-studio" element={<DocumentStudioPage />} />
                    <Route path="presentations" element={<PresentationsPage />} />
                    <Route path="video-studio" element={<VideoStudioPage />} />
                    <Route path="content-studio" element={<ContentStudioPage />} />
                    <Route path="workflows" element={<WorkflowsPage />} />
                    <Route path="workflows/:id" element={<WorkflowEditorPage />} />
                    <Route path="templates" element={<TemplatesLibraryPage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="usage" element={<UsageLimitsPage />} />
                    <Route path="billing" element={<BillingPage />} />
                    <Route path="billing/*" element={<BillingPage />} />
                    <Route path="members" element={<MembersPage />} />
                    <Route path="roles" element={<RolesPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="settings/*" element={<SettingsPage />} />
                  </Route>
                </Route>

                {/* 3. Platform Admin Backoffice with AdminRoute Guard */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="organizations" element={<AdminOrganizationsPage />} />
                    <Route path="organizations/:id" element={<AdminOrganizationsPage />} />
                    <Route path="plans" element={<AdminPlansPage />} />
                    <Route path="features" element={<AdminFeaturesPage />} />
                    <Route path="billing" element={<AdminBillingPage />} />
                    <Route path="subscriptions" element={<AdminBillingPage />} />
                    <Route path="payments" element={<AdminBillingPage />} />
                    <Route path="invoices" element={<AdminBillingPage />} />
                    <Route path="usage" element={<AdminOrganizationsPage />} />
                    <Route path="support" element={<AdminSupportPage />} />
                    <Route path="audit" element={<AdminAuditPage />} />
                    <Route path="audit-logs" element={<AdminAuditPage />} />
                    <Route path="platform-admins" element={<AdminUsersPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Route>
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </QuotaProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
