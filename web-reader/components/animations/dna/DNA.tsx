import { observer } from "mobx-react-lite";

import styles from "./DNA.module.css";

import { useAppStore } from "@/store/Provider";

const DNA = observer(({ className = "", ...props }: any) => {
  const appStore = useAppStore();

  if (!appStore.ui.animationMode) {
    return null; // Do not render if animations are disabled
  }

  const total = 20;
  const strands = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div
      className={`${styles.helix} ${className}`}
      style={{ "--total": total } as React.CSSProperties}
      {...props}
    >
      {strands.map((i) => (
        <div
          key={i}
          className={`${styles.strand} strand`}
          style={{ "--i": i } as React.CSSProperties}
        >
          <div className={`${styles.left} left`}>
            <div className={`${styles.dot} dot`} />
            <div className={`${styles.line} line`} />
          </div>
          <div className={`${styles.right} right`}>
            <div className={`${styles.dot} dot`} />
            <div className={`${styles.line} line`} />
          </div>
        </div>
      ))}
    </div>
  );
});

export default DNA;
