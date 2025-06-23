import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";

const SliderComponent = dynamic(() => import("./SliderComponent"));

function LazySlider(props: any = {}) {
  const { ref, inView } = useInView({ triggerOnce: true });

  return <div ref={ref}>{inView && <SliderComponent {...props} />}</div>;
}

export default LazySlider;
