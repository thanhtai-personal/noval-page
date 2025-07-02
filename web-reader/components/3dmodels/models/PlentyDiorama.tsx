"use client";

import { Html, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect, Suspense, ReactNode } from "react";
import { ModelBox } from "../ModelBox";

useGLTF.preload("/models/isle_of_plenty_diorama.glb");

type PlentyDioramaProps = {
  scale: number;
  transition?: boolean;
  position?: any;
  fallBack?: ReactNode;
};

export const PlentyDiorama: React.FC<PlentyDioramaProps> = ({
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
      camera.position.setX(Math.sin(angleRef.current) * 5);
      camera.lookAt(0, 0, 0);
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [camera, transition]);

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
        scale={scale}
        position={position}
        path={"/models/isle_of_plenty_diorama.glb"}
      />
    </Suspense>
  );
};
