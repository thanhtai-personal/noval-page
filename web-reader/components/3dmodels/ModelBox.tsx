import { useGLTF } from "@react-three/drei";

export const ModelBox: React.FC<{ path: string; [key: string]: any }> = ({
  path,
  ...props
}) => {
  const { scene } = useGLTF(path);

  return <primitive object={scene} {...props} />;
};
