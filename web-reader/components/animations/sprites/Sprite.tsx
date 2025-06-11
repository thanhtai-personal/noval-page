'use client';
import { useEffect, useRef, useState } from 'react';

interface SpriteProps {
  images: string[];
  interval?: number;
  start?: boolean;
  draggable?: boolean;
  position?: { top: number; left: number };
}

const Sprite = ({
  images,
  interval = 100,
  start = true,
  draggable = true,
  position = { top: 0, left: 0 },
}: SpriteProps) => {
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
        'text/plain',
        JSON.stringify({ offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top })
      );
    };

    sprite?.addEventListener('dragstart', onDragStart);

    return () => {
      sprite?.removeEventListener('dragstart', onDragStart);
    };
  }, [draggable]);

  return (
    <div
      ref={spriteRef}
      draggable={draggable}
      style={{
        display: 'inline-block',
        cursor: draggable ? 'grab' : 'default',
        position: 'absolute',
        top: position.top,
        left: position.left,
      }}
    >
      <img src={images[currentIndex]} alt={`Sprite ${currentIndex}`} />
    </div>
  );
};

export default Sprite;
