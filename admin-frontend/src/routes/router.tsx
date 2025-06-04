import { Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AppLoader } from "@/components/AppLoader";

// 👇 Lazy-loaded pages
const LoginPage = lazy(() => import('@/pages/login/LoginPage'));
const AdminUserPage = lazy(() => import('@/pages/user/UserPage'));
const CrawlerPage = lazy(() => import('@/pages/crawler/CrawlerPage'));
const StoryPage = lazy(() => import('@/pages/story/StoryPage'));
const StoryDetailPage = lazy(() => import('@/pages/story/StoryDetailPage'));
const AdminChapterPage = lazy(() => import('@/pages/story/chapter/ChapterPage'));
const ChapterDetailPage = lazy(() => import('@/pages/story/chapter/ChapterDetailPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));

export function AppRouter() {
  return (
    <Suspense fallback={<AppLoader />}>
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
          <Route path="/" element={<CrawlerPage />} />
          <Route path="crawl" element={<CrawlerPage />} />
          <Route path="stories" element={<StoryPage />} />
          <Route path="stories/:id" element={<StoryDetailPage />} />
          <Route path="users" element={<AdminUserPage />} />
          <Route path="chapters" element={<AdminChapterPage />} />
          <Route path="chapters/:id" element={<ChapterDetailPage />} />
          {/* Thêm các route con khác ở đây */}
        </Route>

        {/* Forbidden page */}
        <Route path="/403" element={<ForbiddenPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
