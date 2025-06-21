"use client";

import { useGLTF } from "@react-three/drei";
import { useRotate } from "../hooks/useRotate";

export const FantasyIsland3DModel: React.FC<any> = ({
  scale = 1,
  rotate = false,
}: any) => {
  const gltf = useGLTF("models/fantasy_mystical_island.glb");
  useRotate(rotate);

  return <primitive object={gltf.scene} scale={scale} />;
};
