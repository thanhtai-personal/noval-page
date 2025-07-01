"use client";

import { Loader, useGLTF } from "@react-three/drei";
import { Suspense, ReactNode, useEffect, useRef } from "react";
import { ModelBox } from "../ModelBox";
import { useThree } from "@react-three/fiber";

useGLTF.preload("/models/fantasy_mystical_island.glb");

type FantasyIsland3DModelProps = {
  scale: number;
  rotate?: boolean;
  position?: any;
  fallBack?: ReactNode;
};

export const FantasyIsland3DModel: React.FC<FantasyIsland3DModelProps> = ({
  scale = 1,
  rotate = false,
  position = [0, 0, 0],
  fallBack,
}: any) => {

  const { camera } = useThree();
  const angleRef = useRef(0);

  useEffect(() => {
    if (!rotate) return;
    let frameId: number;
    const animate = () => {
      angleRef.current += 0.015;
      camera.position.setX(Math.sin(angleRef.current) * 5);
      camera.position.setZ(Math.cos(angleRef.current) * 5);
      camera.lookAt(0, 0, 0);
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [camera, rotate]);

  return (
    <Suspense fallback={fallBack ?? <Loader />}>
      <ModelBox
        scale={scale}
        position={position}
        path={"/models/fantasy_mystical_island.glb"}
      />
    </Suspense>
  );
};
