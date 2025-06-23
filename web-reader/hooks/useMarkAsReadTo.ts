"use client";

import { useEffect } from "react"

const MARK_AS_READ_TIME = 10000

export const useMarkAsReadTo = (callback: any) => {
  useEffect(() => {
    const useMarkAsReadTo = setTimeout(() => {
      callback();
    }, MARK_AS_READ_TIME);

    return () => {
      clearTimeout(useMarkAsReadTo);
    }
  }, []);
}