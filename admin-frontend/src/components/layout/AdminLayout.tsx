// src/components/layout/AdminLayout.tsx
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-4 overflow-y-auto flex-1">{children}</main>
      </div>
    </div>
  );
};
