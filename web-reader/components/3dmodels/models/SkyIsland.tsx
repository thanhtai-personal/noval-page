"use client";

import { useGLTF } from "@react-three/drei";

export const SkyIsland: React.FC<any> = ({
  scale = 1
}: any) => {
  const gltf = useGLTF("models/skyisland.glb");
  return <primitive object={gltf.scene} scale={scale} />;
};
