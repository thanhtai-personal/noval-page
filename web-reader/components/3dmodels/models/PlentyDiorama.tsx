"use client";

import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";

export const PlentyDiorama: React.FC<any> = ({
  scale = 1,
  transition = false,
}: any) => {
  let error = false;
  let gltf: any;

  try {
    // Try to load the model
    gltf = useGLTF("models/isle_of_plenty_diorama.glb");
    // useGLTF.preload && useGLTF.preload("models/isle_of_plenty_diorama.glb");
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
      camera.position.setX(Math.sin(angleRef.current) * 5);
      camera.lookAt(0, 0, 0);
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [camera, transition]);

  if (error || !gltf?.scene) return '';

  return <primitive object={gltf.scene} scale={scale} />;
};
