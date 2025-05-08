// src/components/layout/AdminLayout.tsx
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex w-screen h-screen bg-background text-foreground overflow-auto overflow-x-hidden">
      <div className="w-full flex flex-col flex-1">
        <Header />
        <main className="w-full overflow-y-auto flex-1">
          <div className="w-full flex min-h-[calc(100vh-100px)]">
            <Sidebar />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
