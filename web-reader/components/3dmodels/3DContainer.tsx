"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "./Loader";
import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei";
import CameraPositionLabel from "./CameraPositionLabel";
import { CameraSetup } from "./CameraSetup";

type Model3DContainerProps = {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  ambientLight?: any;
  directionalLight?: any;
  controlled?: boolean;
  camera: any;
  devTools?: boolean;
  id: string;
  [key: string]: any;
};

const Model3DContainer: React.FC<Model3DContainerProps> = ({
  children,
  fallback = <Loader />,
  camera,
  ambientLight, // = { intensity: 0.5 },
  directionalLight, // = { intensity: 1, position: [10, 10, 5] },
  controlled = false,
  devTools = false,
  id,
  ...props
}: Model3DContainerProps) => {
  return (
    <Canvas {...props} id={id}>
      {ambientLight && <ambientLight {...ambientLight} />}
      {directionalLight && <directionalLight {...directionalLight} />}
      <Suspense fallback={fallback}>
        <CameraSetup position={camera?.position || [0, 0, 10]} />
        {children}
      </Suspense>
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
