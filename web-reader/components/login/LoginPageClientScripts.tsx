"use client";

import { useAppStore } from "@/store/Provider";
import { observer } from "mobx-react-lite";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export const LoginPageClientScripts = observer(() => {
  const appStore = useAppStore();
  const { theme } = useTheme();

  useEffect(() => {
    appStore.setAnimations({
      useIsland: false,
      useDNA: false,
      useUniverseBg: theme === "dark",
    });

    return () => {
      appStore.resetAnimations();
    };
  }, [theme]);

  return "";
});
