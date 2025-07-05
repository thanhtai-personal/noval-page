"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { useAppStore } from "@/store/Provider";

// Game menu
export const PlayToEarn = observer(() => {
  const store = useAppStore();

  useEffect(() => {
    store.ui.openGameMode = false;

    return () => {
      store.ui.openGameMode = true;
    };
  }, []);

  return <div />;
});

export default PlayToEarn;
