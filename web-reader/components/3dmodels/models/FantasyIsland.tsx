"use client";

import { useGLTF } from "@react-three/drei";
import { Suspense, ReactNode } from "react";
import { ModelBox } from "../ModelBox";
import { useRotate } from "../hooks/useRotate";

useGLTF.preload("/models/fantasy_mystical_island.glb");

type FantasyIsland3DModelProps = {
  scale: number;
  rotate?: boolean;
  position?: any;
  fallBack?: ReactNode;
}

export const FantasyIsland3DModel: React.FC<FantasyIsland3DModelProps> = ({
  scale = 1,
  rotate = false,
  position = [0, 0, 0],
  fallBack
}: any) => {

  useRotate(rotate);

  return (
    <Suspense fallback={fallBack ?? <span>Loading...</span>}>
      <ModelBox
        scale={scale}
        position={position}
        path={"/models/fantasy_mystical_island.glb"}
      />
    </Suspense>
  )
};
