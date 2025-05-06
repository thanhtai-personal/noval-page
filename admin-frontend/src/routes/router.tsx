import { Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';

// 👇 Lazy-loaded pages
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const CrawlerPage = lazy(() => import('@/pages/CrawlerPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));

export function AppRouter() {
  return (
    <Suspense fallback={<div className="text-center p-4">Đang tải trang...</div>}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Admin routes with layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedRoute>
          }
        >
          <Route path="crawl" element={<CrawlerPage />} />
          {/* Thêm các route con khác ở đây */}
        </Route>

        {/* Forbidden page */}
        <Route path="/403" element={<ForbiddenPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
