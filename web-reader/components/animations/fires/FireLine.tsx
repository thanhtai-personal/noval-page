"use client";

import { isMobile } from "@/utils/funtions";
import "./fireline.css";
import { observer } from "mobx-react-lite";
import { useAppStore } from "@/store/Provider";

export const FireLine = observer(
  ({ id = "fire-line", className, ...props }: any) => {
    const uiConfig = useAppStore();

    if (isMobile() || !uiConfig.animationMode) return "";

    return (
      <div
        id={id}
        className={`${className} fireline w-full h-full pointer-events-none`}
        {...props}
      ></div>
    );
  },
);

export default FireLine;
