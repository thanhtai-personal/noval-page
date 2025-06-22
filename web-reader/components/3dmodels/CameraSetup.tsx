"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export const CameraSetup = ({ position = [0, 0, 10] }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.setX(position?.[0]);
    camera.position.setY(position?.[1]);
    camera.position.setZ(position?.[2]);
    camera.lookAt(0, 0, 0);
  }, [camera, position]);
  return null;
};
