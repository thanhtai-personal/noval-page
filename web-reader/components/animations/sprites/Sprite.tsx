"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { observer } from "mobx-react-lite";

import { useAppStore } from "@/store/Provider";
import { isMobile } from "@/utils/funtions";

interface SpriteProps {
  images: any[];
  interval?: number;
  start?: boolean;
  draggable?: boolean;
  position?: { top?: number; left?: number; bottom?: number; right?: number };
  width?: number;
  layer?: number;
}

const Sprite = observer(
  ({
    images,
    interval = 100,
    start = true,
    draggable = false,
    position = {},
    width = 100,
    layer = 0,
  }: SpriteProps) => {
    const appStore = useAppStore();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const spriteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!start || images.length === 0) return;

      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, interval);

      return () => clearInterval(timer);
    }, [images, interval, start]);

    useEffect(() => {
      if (!draggable) return;

      const sprite = spriteRef.current;

      const onDragStart = (e: DragEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();

        e.dataTransfer?.setData(
          "text/plain",
          JSON.stringify({
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top,
          }),
        );
      };

      sprite?.addEventListener("dragstart", onDragStart);

      return () => {
        sprite?.removeEventListener("dragstart", onDragStart);
      };
    }, [draggable]);

    if (!appStore.animationMode || isMobile()) {
      return ""; // Do not render if animations are disabled
    }

    return (
      <div
        ref={spriteRef}
        draggable={draggable}
        style={{
          display: "inline-block",
          cursor: draggable ? "grab" : "default",
          position: "absolute",
          top: position.top,
          left: position.left,
          bottom: position.bottom,
          right: position.right,
          zIndex: layer,
        }}
      >
        <Image
          alt={`Sprite ${currentIndex}`}
          src={images[currentIndex]}
          width={width} // specify dimensions or make it responsive
        />
      </div>
    );
  },
);

export default Sprite;
