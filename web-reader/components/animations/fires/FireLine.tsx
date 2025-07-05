"use client";

import { isMobile } from "@/utils/funtions";

import "./fireline.css";
import { observer } from "mobx-react-lite";

import { useAppStore } from "@/store/Provider";

export const FireLine = observer(
  ({ id = "fire-line", className, ...props }: any) => {
    const store = useAppStore();

    if (isMobile() || !store.ui.animationMode) return "";

    return (
      <div
        className={`${className} fireline w-full h-full pointer-events-none`}
        id={id}
        {...props}
      />
    );
  },
);

export default FireLine;
