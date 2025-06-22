"use client";

import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";

export const MagicalHelp: React.FC<any> = ({
  scale = 1,
  transition = false,
}: any) => {
  const gltf = useGLTF("models/magical_help.glb");
  const { camera } = useThree();
  const angleRef = useRef(0);

  useEffect(() => {
    if (!transition) return;
    let frameId: number;
    const animate = () => {
      angleRef.current += 0.03;
      camera.position.setZ(Math.sin(angleRef.current) * 5);
      camera.lookAt(0, 0, 0);
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [camera, transition]);

  return <primitive object={gltf.scene} scale={scale} />;
};
