"use client";

import { useAppStore } from "@/store/Provider";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

// Game menu
export const PlayToEarn = observer(() => {
  const store = useAppStore();

  useEffect(() => {
    store.openGameMode = false;

    return () => {
      store.openGameMode = true;
    };
  }, []);

  return <div></div>;
});

export default PlayToEarn;
