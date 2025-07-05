import { observer } from "mobx-react-lite";

import styles from "./DNA2.module.css";

import { useAppStore } from "@/store/Provider";

const DNA2 = observer(({ className = "", ...props }: any) => {
  const appStore = useAppStore();

  if (!appStore.ui.animationMode) return null;

  const total = 64;
  const dots = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className={`${styles.dots} ${className}`} {...props}>
      {dots.map((i) => (
        <div key={i} className={styles.dots__dot} />
      ))}
    </div>
  );
});

export default DNA2;
