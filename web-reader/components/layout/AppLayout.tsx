"use client";

import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useState } from "react";

import { GameBox } from "../game/GameBox";
import { PlayerPanel } from "../game/PlayerPanel";

import { Footer } from "./footer";
import { BottomSprites } from "./BottomSprites";
import { TopSprites } from "./TopSprites";
import { EntertaimentMenu } from "./EntertaimentMenu";

import { Navbar } from "@/components/layout/navbar";
import WallPaperBg1 from "@/components/animations/backgrounds/WallpaperBg1";
import { useAppStore } from "@/store/Provider";
import xboxImageIcon from "@/assets/icons8-gamepad-48.png";

export const AppLayout = observer(({ children }: any) => {
  const store = useAppStore();

  const [showingGameMenu, setShowingGameMenu] = useState(false);

  const openGameModal = () => {
    setShowingGameMenu((prev) => !prev);
  };

  return (
    <div className="relative flex flex-col h-screen max-w-[100vw] overflow-x-hidden overflow-y-auto">
      <div className="relative flex flex-col w-full">
        <div className="absolute w-full h-full">
          <div className="relative w-full h-full overflow-hidden">
            <TopSprites />
            <BottomSprites />
          </div>
        </div>

        <GameBox
          opened={showingGameMenu}
          onClose={() => setShowingGameMenu(false)}
        />

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

      {store.openGameMode && <PlayerPanel />}

      {store.openGameMode && (
        <div
          className={`
            fixed z-20 bottom-2  bg-orange-500/25 ${
              store.animationMode
                ? "-right-[160px] hover:-right-[50px] transition-all duration-300"
                : "right-6 p-4"
            } rounded-full backdrop:blur-xl btn-play-to-earn ${
              !showingGameMenu && "showing"
            }
          `}
          style={{
            boxShadow: "0px 0px 4px 3px rgba(247, 92, 2, 0.9)",
          }}
          title="play to earn"
        >
          {/* {store.animationMode && !isMobile() ? (
            // <Link href={"/play"} target="game-play">
            <div className="cursor-pointer " onClick={openGameModal}>
              <Model3DContainer
                camera={{ position: [3, 0, 3], fov: 45 }}
                ambientLight={{ intensity: 1 }}
                directionalLight={{ intensity: 1, position: [5, 5, 5] }}
                id="XboxBlue"
                fallback={
                  <Image
                    alt="click-to-play"
                    className="cursor-pointer"
                    src={xboxImageIcon}
                    width={48}
                    height={48}
                  />
                }
              >
                <XBoxBlue
                  transition
                  scale={3}
                  fallBack={
                    <Html center>
                      <Image
                        alt="click-to-play"
                        className="cursor-pointer"
                        src={xboxImageIcon}
                        width={48}
                        height={48}
                      />
                    </Html>
                  }
                />
              </Model3DContainer>
            </div>
            // </Link>
          ) : (
            // <Link href={"/play"} target="game-play">
            <Image
              alt="click-to-play"
              onClick={openGameModal}
              src={xboxImageIcon}
              width={48}
              height={48}
              className="cursor-pointer w-[28px] h-[28px] md:w-[48px] md:h-[48px]"
            />
            // </Link>
          )} */}
          <Image
            alt="click-to-play"
            className="cursor-pointer w-[28px] h-[28px] md:w-[48px] md:h-[48px]"
            height={48}
            src={xboxImageIcon}
            width={48}
            onClick={openGameModal}
          />
        </div>
      )}
    </div>
  );
});
