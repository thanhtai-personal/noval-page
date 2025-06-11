"use client";

import { observer } from "mobx-react-lite";
import { useAppStore } from "@/store/Provider";
import gsap from "gsap";

import styles from "./3dcardhover.module.css";

export const ThreeDCardHover = observer(({ children, id }: any) => {
  const appStore = useAppStore();

  function handleMouseMove(e: any) {
    const wrapper = document.getElementById(`card-wrapper-${id}`);
    if (!wrapper) return;

    const bounds = wrapper.getBoundingClientRect();

    const leftX = e.clientX - bounds.x;
    const topY = e.clientY - bounds.y;
    const mouseX = leftX - bounds.width / 2;
    const mouseY = topY - bounds.height / 2;

    gsap.to(wrapper, {
      ["--mouse-x"]: mouseX,
      ["--mouse-y"]: mouseY,
      duration: 0.2,
    });
  }

  function handleMouseLeave() {
    const wrapper = document.getElementById(`card-wrapper-${id}`);
    if (!wrapper) return;

    gsap.to(wrapper, {
      ["--mouse-x"]: 0,
      ["--mouse-y"]: 0,
      duration: 0.2,
    });
  }

  if (!appStore.animationMode) {
    return children;
  }

  return (
    <div className="threed-card-hover w-full h-full relative">
      <div
        className={`${styles.cardWrapper} w-full h-full relative`}
        id={`card-wrapper-${id}`}
        tabIndex={-1}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div className={`${styles.glowCard} ${styles.animatedGradient} w-full h-full`}>
          <div className={`${styles.inner} w-full h-full`}>{children}</div>
        </div>
      </div>
    </div>
  );
});

export default ThreeDCardHover;
