"use client";

import { observer } from "mobx-react-lite";

import { Navbar } from "@/components/layout/navbar";
import WallPaperBg1 from "@/components/animations/backgrounds/WallpaperBg1";
import Model3DContainer from "@/components/3dmodels/3DContainer";
import { XBoxBlue } from "@/components/3dmodels/models/XBoxBlue";
import { useAppStore } from "@/store/Provider";

import { Footer } from "./footer";
import { BottomSprites } from "./BottomSprites";
import { TopSprites } from "./TopSprites";
import { EntertaimentMenu } from "./EntertaimentMenu";
import Image from "next/image";
import xboxImageIcon from "@/assets/icons8-gamepad-48.png"

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
      {store.useGameMenu && (
        <div className="absolute bottom-0 right-0 flex justify-center items-center">
          <EntertaimentMenu />
        </div>
      )}

      {store.openGameMode && (
        <div
          className="fixed cursor-pointer z-50 bottom-0 -right-[140px] p-4 rounded-full overflow-visible" title="play to earn">
          {store.animationMode ? <div className="">
            <Model3DContainer
              camera={{ position: [4, 4, 1], fov: 45 }}
              ambientLight={{ intensity: 1 }}
              directionalLight={{ intensity: 1, position: [5, 5, 5] }}
              id="XboxBlue"
              fallback={<Image
                alt="click-to-play"
                className="cursor-pointer"
                src={xboxImageIcon}
                width={48}
                height={48}
              />}
            >
              <XBoxBlue
                transition
                scale={3}
                fallBack={<Image
                  alt="click-to-play"
                  className="cursor-pointer"
                  src={xboxImageIcon}
                  width={48}
                  height={48}
                />}
              />
            </Model3DContainer>
          </div> : <div>
            <Image
              alt="click-to-play"
              className="cursor-pointer"
              src={xboxImageIcon}
              width={48}
              height={48} />
          </div>}
        </div>
      )}
    </div>
  );
});
