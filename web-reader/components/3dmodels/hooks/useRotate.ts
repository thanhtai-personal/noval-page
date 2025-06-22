import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";

export const useRotate = (rotate?: boolean) => {
  const { camera } = useThree();
  const angleRef = useRef(0);

  useEffect(() => {
    if (!rotate) return;
    let frameId: number;
    const animate = () => {
      angleRef.current += 0.015;
      camera.position.setX(Math.sin(angleRef.current) * 5);
      camera.position.setZ(Math.cos(angleRef.current) * 5);
      camera.lookAt(0, 0, 0);
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [camera, rotate]);
};
