"use client";

import { useEffect } from "react";

export const useResize = (callback: () => void) => {
  const handleResize = () => {
    callback();
  };

  useEffect(() => {
    callback(); // Initial call to set the size on mount
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [callback]);
}