import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";

const Fire1 = dynamic(() => import("./Fire1"));

export function Fire1Wrapper(props: any = {}) {
  const { ref, inView } = useInView({ triggerOnce: true });

  return <div ref={ref}>{inView && <Fire1 {...props} />}</div>;
}
