"use client";

import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect, Suspense, ReactNode } from "react";

import { ModelBox } from "../ModelBox";

useGLTF.preload("/models/xbox_one_game_pad_blue_edition.glb");

type XBoxBlueProps = {
  scale: number;
  transition?: boolean;
  position?: any;
  fallBack?: ReactNode;
};

export const XBoxBlue: React.FC<XBoxBlueProps> = ({
  scale = 1,
  transition = false,
  position = [0, 0, 0],
  fallBack,
}: any) => {
  const { camera } = useThree();

  const angleRef = useRef(0);

  useEffect(() => {
    if (!transition) return;
    let frameId: number;
    const animate = () => {
      angleRef.current += 0.03;
      camera.position.setY(Math.sin(angleRef.current) * 1.12);
      camera.lookAt(1, 0, 0);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frameId);
  }, [camera, transition]);

  return (
    <Suspense fallback={fallBack ?? <span>Loading...</span>}>
      <ModelBox
        path={"/models/xbox_one_game_pad_blue_edition.glb"}
        position={position}
        scale={scale}
      />
    </Suspense>
  );
};
