"use client";

import { useEffect, useMemo, useRef } from "react";
import styles from "./thunderText.module.css";
import { ThunderMachine } from "./ThunderMachine";

export const ThunderText = ({
  text,
  id = "thunder-text",
  placeholder = "",
  maxLength = 24,
  width,
  height,
  useInput = false,
  speed = 3,
}: any) => {
  const machineRef = useRef<ThunderMachine | null>(null);

  useEffect(() => {
    if (!machineRef.current) {
      const instance = new ThunderMachine(id, `input-${id}`, width, height);
      instance.execute("");
      machineRef.current = instance;
    }
  }, [id, width, height]);

  useEffect(() => {
    machineRef.current?.execute("");
  }, [machineRef.current]);

  useEffect(() => {
    machineRef.current?.setText(text);
  }, [text, machineRef.current]);

  useEffect(() => {
    machineRef.current?.setSpeed(speed);
  }, [speed, machineRef.current]);

  return (
    <div className={`${styles.body}`}>
      <div className={`${styles.pageThunderToText}`}>
        {useInput && (
          <input
            id={`input-${id}`}
            type="text"
            maxLength={maxLength}
            placeholder={placeholder}
          />
        )}
        <canvas id={id}></canvas>
      </div>
    </div>
  );
};
