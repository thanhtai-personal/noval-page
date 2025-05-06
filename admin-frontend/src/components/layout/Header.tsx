// src/components/layout/Header.tsx
import React from 'react';

export const Header = () => {
  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-border bg-white shadow-sm">
      <div className="text-xl font-bold">📘 WebTruyen Admin</div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Admin</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};
