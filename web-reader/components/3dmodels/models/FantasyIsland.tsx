"use client";

import { useGLTF } from "@react-three/drei";
import { useRotate } from "../hooks/useRotate";

export const FantasyIsland3DModel: React.FC<any> = ({
  scale = 1,
  rotate = false,
}: any) => {

  let gltf: any;
  let error = null;
  try {
    gltf = useGLTF("models/fantasy_mystical_island.glb");
  } catch (e) {
    return ''
  }
  useRotate(rotate);

  if (error) {
    return <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>;
  }

  return <primitive object={gltf.scene} scale={scale} />;
};
