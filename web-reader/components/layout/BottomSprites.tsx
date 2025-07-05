"use client";

import { observer } from "mobx-react-lite";
import { useState } from "react";

import { useResize } from "@/hooks/useResize";
import { useAppStore } from "@/store/Provider";
import { isMobile } from "@/utils/funtions";
import GalaxyBackground from "@/components/animations/backgrounds/GalaxyBackground";
import Model3DContainer from "@/components/3dmodels/3DContainer";
import { FantasyIsland3DModel } from "@/components/3dmodels/models/FantasyIsland";

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
    <div className="absolute bottom-0 right-0 w-full z-0 bg-transparent">
      <div className="relative w-full h-full z-0 overflow-hidden">
        {appStore.animations.useUniverseBg && (
          <GalaxyBackground id="GalaxyBackground-footer" />
        )}
        {appStore.animations.useFantasyIsland && (
          <div className=" absolute bottom-0 left-0 w-full h-screen z-0 opacity-50">
            <Model3DContainer
              ambientLight={{ intensity: 1 }}
              camera={{ position: [0, 0, 10], fov: 30 }}
              directionalLight={{ intensity: 1, position: [10, 10, 10] }}
              id="FantasyIsland3DModel-footer"
            >
              <FantasyIsland3DModel rotate scale={0.0038} />
            </Model3DContainer>
          </div>
        )}
      </div>
    </div>
  );
});
