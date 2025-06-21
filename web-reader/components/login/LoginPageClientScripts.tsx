"use client";

import { useAppStore } from "@/store/Provider";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export const LoginPageClientScripts = observer(() => {

  const appStore = useAppStore();

  useEffect(() => {
    appStore.setAnimations({
      useIsland: false,
      useDNA: false,
    });

    return () => {
      appStore.resetAnimations();
    }
  }, [])

  return '';
})