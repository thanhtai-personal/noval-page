"use client";

import { useResize } from "@/hooks/useResize";
import { useAppStore } from "@/store/Provider";
import { isMobile } from "@/utils/funtions";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import GalaxyBackground from "@/components/animations/backgrounds/GalaxyBackground";
import Sprite from "@/components/animations/sprites/Sprite";

import isLandChain from "@/assets/sprites/islandChain/islandchain.png";

export const BottomSprites = observer(() => {
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

  if (!appStore.animationMode || isMobile()) {
    return ""; // Do not render if animations are disabled
  }

  return (
    <div className="relative">
      <div className="absolute bottom-0 right-0 w-full z-0 bg-transparent">
        <div className="relative w-full h-full z-0 overflow-x-hidden">
          {/* <Sprite
            images={[isLandChain]}
            width={windowSize.width}
            layer={0}
            position={{
              bottom: 0,
              right: 0,
            }}
          /> */}
          <GalaxyBackground />
        </div>
      </div>
    </div>
  );
});
