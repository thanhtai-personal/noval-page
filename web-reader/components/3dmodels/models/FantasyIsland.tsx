"use client";

import { Html, useGLTF } from "@react-three/drei";
import { Suspense, ReactNode, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

import { ModelBox } from "../ModelBox";

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
    <Suspense
      fallback={
        fallBack ?? (
          <Html center>
            <div>Loading...</div>
          </Html>
        )
      }
    >
      <ModelBox
        path={"/models/fantasy_mystical_island.glb"}
        position={position}
        scale={scale}
      />
    </Suspense>
  );
};
