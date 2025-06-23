import { useEffect, useState } from "react";

export const useEaseInOutAnimationButton = (configValue?: boolean) => {
  const [animationState, setAnimationState] = useState<"in" | "out" | null>(
    null,
  );
  const [showButton, setShowButton] = useState(configValue);

  // Trigger animation on login/logout toggle
  useEffect(() => {
    setAnimationState("out");
    const timeout = setTimeout(() => {
      setShowButton(configValue);
      setAnimationState("in");
    }, 300); // match animation duration
    return () => clearTimeout(timeout);
  }, [configValue]);

  return [
    animationState === "in"
      ? "animation-button-rotate-in"
      : animationState === "out"
        ? "animation-button-rotate-out"
        : "",
    showButton,
  ];
};
