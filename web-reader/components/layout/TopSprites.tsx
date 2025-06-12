import { useResize } from "@/hooks/useResize";
import { useAppStore } from "@/store/Provider";
import { isMobile } from "@/utils/funtions";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import Sprite from "@/components/animations/sprites/Sprite";

import islandPng from "@/assets/sprites/island/01.png";
import islandPng2 from "@/assets/sprites/island/I01.png";

export const TopSprites = observer(() => {
  const appStore = useAppStore();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useResize(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });

  if (!appStore.animationMode || isMobile()) {
    return ""; // Do not render if animations are disabled
  }

  return (
    <div className="absolute w-full h-full -z-0 bg-transparent">
        <div className="relative w-full h-full z-0">
          <Sprite
            images={[islandPng]}
            width={450}
            layer={0}
            position={{
              top: windowSize.height - 300,
              left: windowSize.width - 500,
            }}
          />

          <Sprite
            images={[islandPng2]}
            width={450}
            layer={0}
            position={{
              top: windowSize.height + 500,
              left: 0,
            }}
          />
        </div>
      </div>
  );
});
