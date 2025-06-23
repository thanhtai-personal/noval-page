"use client";

import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";

export const MagicalHelp: React.FC<any> = ({
  scale = 1,
  transition = false,
}: any) => {
  let gltf: any;
  let error = false;
  try {
    gltf = useGLTF("models/magical_help.glb");
  } catch (e) {
    error = true;
  }
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
      return <primitive object={gltf.scene} scale={scale} />;
    };
    return () => cancelAnimationFrame(frameId);
  }, [camera, transition]);


  if (error || !gltf?.scene) {
    return '';
  }

  return <primitive object={gltf.scene} scale={scale} />;
};
