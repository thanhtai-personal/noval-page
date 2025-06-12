"use client";

import { useEffect } from "react";

export const useResize = (callback: () => void) => {
  const handleResize = () => {
    callback();
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [callback]);
}