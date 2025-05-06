// src/components/layout/Sidebar.tsx
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-border p-4">
      <nav className="space-y-4">
        <Link to="/dashboard" className="block font-medium hover:text-blue-600">
          Dashboard
        </Link>
        <Link to="/stories" className="block font-medium hover:text-blue-600">
          Quản lý truyện
        </Link>
        <Link to="/crawl" className="block font-medium hover:text-blue-600">
          Crawl dữ liệu
        </Link>
        <Link to="/users" className="block font-medium hover:text-blue-600">
          Người dùng
        </Link>
      </nav>
    </aside>
  );
};
