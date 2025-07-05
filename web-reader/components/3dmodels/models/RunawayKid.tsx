"use client";

import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect, Suspense, ReactNode } from "react";

import { ModelBox } from "../ModelBox";

useGLTF.preload("/models/runaway_kid.glb");

type RunawayKidProps = {
  scale: number;
  transition?: boolean;
  position?: any;
  fallBack?: ReactNode;
};

export const RunawayKid: React.FC<RunawayKidProps> = ({
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
      angleRef.current += 0.01;
      if (angleRef.current > Math.PI * 2) angleRef.current -= Math.PI * 2;
      camera.position.x = Math.sin(angleRef.current) * 1.07;
      camera.position.z = Math.cos(angleRef.current) * 1.07;
      camera.lookAt(0, 0, 0);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frameId);
  }, [camera, transition]);

  return (
    <Suspense fallback={fallBack ?? <span>Loading...</span>}>
      <ModelBox
        path={"/models/runaway_kid.glb"}
        position={position}
        scale={scale}
      />
    </Suspense>
  );
};
