/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// import all other standard pages are now handled dynamically, but we keep imports for fallback if needed
import DynamicPage from './pages/DynamicPage';
import AdminLayout from './components/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Events from './pages/admin/Events';

import { CMSProvider, useCMS } from './lib/CMSProvider';
import { AuthProvider } from './lib/AuthProvider';
import { CMSToolbar, AdminBadge } from './components/cms/CMSComponents';
import { DynamicPageWrapper } from './components/cms/DynamicPageWrapper';

function AppContent() {
  const { cmsData, isLoading } = useCMS();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <AdminBadge />
      <CMSToolbar />
      <Routes>
        {/* Public Routes via CMS */}
        <Route path="/" element={<Layout />}>
          {cmsData.pages.map(page => {
            if (page.path === '/') {
              return <Route key={page.id} index element={<DynamicPageWrapper pageId={page.id} />} />;
            }
            return (
              <Route 
                 key={page.id} 
                 path={page.path.replace(/^\//, '')} 
                 element={<DynamicPageWrapper pageId={page.id} />} 
              />
            );
          })}
          <Route path="page/:slug" element={<DynamicPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<Events />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CMSProvider>
    </AuthProvider>
  );
}
