import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";

const FireLine = dynamic(() => import("./FireLine"));

export function FireLineWrapper(props: any = {}) {
  const { ref, inView } = useInView({ triggerOnce: true });

  return <div ref={ref}>{inView && <FireLine {...props} />}</div>;
}
