import { useProgress, Html } from "@react-three/drei";

export const Loader = () => {
  const { progress } = useProgress();

  return <Html center>{progress.toFixed(0)} % loaded</Html>;
};
