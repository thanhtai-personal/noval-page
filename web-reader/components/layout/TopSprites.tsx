"use client";

import { useResize } from "@/hooks/useResize";
import { useAppStore } from "@/store/Provider";
import { isMobile } from "@/utils/funtions";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import Sprite from "@/components/animations/sprites/Sprite";

import islandPng from "@/assets/sprites/island/01.png";
import islandPng2 from "@/assets/sprites/island/I01.png";
import DNA from "@/components/animations/dna/DNA";
import DNA2 from "@/components/animations/dna/DNA2";

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

  if (!appStore.animationMode || isMobile()) {
    return ""; // Do not render if animations are disabled
  }

  return (
    <div className="absolute w-full h-full z-[1] bg-transparent">
      <div className="relative w-full h-full z-[1]">
        <Sprite
          images={[islandPng]}
          width={450}
          layer={0}
          position={{
            top: windowSize.height - 300,
            left: windowSize.width - 500,
          }}
        />

        <div className="absolute top-[calc(100vh-0px)] left-[calc(50vw-250px)] w-full h-full z-0">
          <DNA2 />
        </div>

        <Sprite
          images={[islandPng2]}
          width={450}
          layer={0}
          position={{
            top: windowSize.height + 500,
            left: 0,
          }}
        />

        <div className="absolute top-[calc(100vh+800px)] left-[calc(-50vw+225px)] w-full h-full z-0">
          <DNA2 />
        </div>

        <div className="absolute -top-[40px] -left-[50vw] w-full h-full z-0">
          <DNA />
        </div>
      </div>
    </div>
  );
});
