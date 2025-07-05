"use client";

import { observer } from "mobx-react-lite";
import { useState } from "react";

import { useResize } from "@/hooks/useResize";
import { useAppStore } from "@/store/Provider";
import { isMobile } from "@/utils/funtions";
import Sprite from "@/components/animations/sprites/Sprite";
import islandPng from "@/assets/sprites/island/01.png";
import islandPng2 from "@/assets/sprites/island/I01.png";
import DNA from "@/components/animations/dna/DNA";
import DNA2 from "@/components/animations/dna/DNA2";
import Model3DContainer from "@/components/3dmodels/3DContainer";
import { PlentyDiorama } from "@/components/3dmodels/models/PlentyDiorama";

export const TopSprites = observer(() => {
  const appStore = useAppStore();
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useResize(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  });

  if (!appStore.ui.animationMode || isMobile()) {
    return ""; // Do not render if animations are disabled
  }

  return (
    <div className="absolute w-full h-full z-[1] bg-transparent">
      <div className="relative w-full h-full z-[1]">
        {appStore.ui.animations?.useIsland && (
          <Sprite
            images={[islandPng]}
            layer={0}
            position={{
              top: windowSize.height - 300,
              left: windowSize.width - 500,
            }}
            width={450}
          />
        )}

        {appStore.ui.animations?.use3DIsland && (
          <div className=" absolute left-[calc(100vw-500px)] top-[calc(100vh-400px)] h-screen w-[500px] z-1 opacity-90">
            <Model3DContainer
              ambientLight={{ intensity: 1 }}
              camera={{ position: [0, 5, 10], fov: 30 }}
              directionalLight={{ intensity: 1, position: [10, 10, 10] }}
              id="PlentyDiorama"
            >
              <PlentyDiorama transition scale={0.0003} />
            </Model3DContainer>
          </div>
        )}

        {appStore.ui.animations?.useDNA && (
          <div className="absolute top-[calc(100vh+60px)] left-[calc(50vw-150px)] w-full h-full z-0">
            <DNA2 />
          </div>
        )}

        {appStore.ui.animations?.useIsland && (
          <Sprite
            images={[islandPng2]}
            layer={0}
            position={{
              top: windowSize.height + 500,
              left: 0,
            }}
            width={450}
          />
        )}

        {appStore.ui.animations?.useDNA && (
          <div className="absolute top-[calc(100vh+800px)] left-[calc(-50vw+225px)] w-full h-full z-0">
            <DNA2 />
          </div>
        )}

        {appStore.ui.animations?.useDNA && (
          <div className="absolute -top-[40px] -left-[50vw] w-full h-full z-50">
            <DNA />
          </div>
        )}
      </div>
    </div>
  );
});
