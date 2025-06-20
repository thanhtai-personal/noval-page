import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { Text } from "@react-three/drei";

const CameraPositionLabel: React.FC = () => {
  const { camera } = useThree();
  const textRef = useRef<any>();
  const [label, setLabel] = useState("");

  // Đặt lại vị trí nếu cần
  useEffect(() => {
    camera.position.set(0, 0, 8); // đảm bảo dùng đúng giá trị mong muốn
    camera.updateProjectionMatrix(); // cần thiết sau khi đổi fov hoặc position
  }, [camera]);

  useFrame(() => {
    const { x, y, z } = camera.position;
    setLabel(`X:${x.toFixed(1)} Y:${y.toFixed(1)} Z:${z.toFixed(1)}`);
    if (textRef.current) {
      textRef.current.lookAt(camera.position);
    }
  });

  return (
    <Text
      ref={textRef}
      position={[0, 3, 0]}
      fontSize={0.3}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      {label}
    </Text>
  );
};

export default CameraPositionLabel;
