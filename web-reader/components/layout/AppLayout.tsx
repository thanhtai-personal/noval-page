"use client";

import { observer } from "mobx-react-lite";

import { Navbar } from "@/components/layout/navbar";
import WallPaperBg1 from "@/components/animations/backgrounds/WallpaperBg1";
import { useAppStore } from "@/store/Provider";
import { Footer } from "./footer";
import { BottomSprites } from "./BottomSprites";
import { TopSprites } from "./TopSprites";
import { EntertaimentMenu } from "./EntertaimentMenu";

export const AppLayout = observer(({ children }: any) => {
  const store = useAppStore();

  return (
    <div className="relative flex flex-col h-screen max-w-[100vw] overflow-x-hidden overflow-y-auto">
      <div className="relative flex flex-col w-full">
        <div className="absolute w-full h-full">
          <div className="relative w-full h-full overflow-hidden">
            <TopSprites />
            <BottomSprites />
          </div>
        </div>

        {store.useLayout && <Navbar />}
        <WallPaperBg1>
          <main className="relative container min-h-screen mx-auto max-w-7xl lg:pb-[300px] px-6 flex-grow bg-transparent z-[5]">
            {children}
          </main>
        </WallPaperBg1>
        {store.useFooter && <Footer />}
      </div>
      {store.useGameMenu && <div className="absolute bottom-0 right-0 flex justify-center items-center">
        <EntertaimentMenu />
      </div>}
    </div>
  );
});
