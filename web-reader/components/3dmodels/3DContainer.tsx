"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "./Loader";
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  Text,
} from "@react-three/drei";
import CameraPositionLabel from "./CameraPositionLabel";

type Model3DContainerProps = {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  ambientLight?: any;
  directionalLight?: any;
  controlled?: boolean;
  camera: any;
  devTools?: boolean;
  [key: string]: any;
};

const Model3DContainer: React.FC<any> = ({
  children,
  fallback = <Loader />,
  camera,
  ambientLight, // = { intensity: 0.5 },
  directionalLight, // = { intensity: 1, position: [10, 10, 5] },
  controlled = false,
  devTools = false,
  ...props
}: Model3DContainerProps) => {
  return (
    <Canvas {...props}>
      {ambientLight && <ambientLight {...ambientLight} />}
      {directionalLight && <directionalLight {...directionalLight} />}
      <Suspense fallback={fallback}>{children}</Suspense>
      {controlled && <OrbitControls />}
      {devTools && (
        <>
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport
              axisColors={["red", "green", "blue"]}
              labelColor="white"
            />
          </GizmoHelper>
          <CameraPositionLabel />
        </>
      )}
    </Canvas>
  );
};

export default Model3DContainer;
