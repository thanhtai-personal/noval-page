"use client";

import { observer } from "mobx-react-lite";

import { Navbar } from "@/components/layout/navbar";
import { useAppStore } from "@/store/Provider";

export const AppLayout = observer(({ children }: any) => {
  const store = useAppStore();

  return (
    <div className="relative flex flex-col h-screen">
      {store.useLayout && <Navbar />}
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
    </div>
  );
});
