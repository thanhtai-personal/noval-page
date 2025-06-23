"use client";
import { useEffect, useRef } from "react";
import styles from "./DeadlineLoading.module.css";

const animationTime = 20;
const days = 7;

export const DeadlineLoading = () => {
  const dayRef = useRef<HTMLSpanElement>(null);
  const deadlineTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progressFill = document.getElementById("progress-time-fill");
    const deathGroup = document.getElementById("death-group");
    const designerArm = document.getElementById("designer-arm-grop");

    if (progressFill)
      progressFill.style.animationDuration = `${animationTime}s`;
    if (deathGroup) deathGroup.style.animationDuration = `${animationTime}s`;

    const updateDesignerArmAnimation = () => {
      const timings = [
        { duration: "1.5s", delay: 0 },
        { duration: "1s", delay: 4000 },
        { duration: "0.7s", delay: 8000 },
        { duration: "0.3s", delay: 12000 },
        { duration: "0.2s", delay: 15000 },
      ];

      timings.forEach(({ duration, delay }) => {
        setTimeout(() => {
          if (designerArm) {
            designerArm.style.animationDuration = duration;
          }
        }, delay);
      });
    };

    const runTimer = (totalTime: number, totalDays: number) => {
      const time = totalTime * 1000;
      const dayDuration = time / totalDays;
      let currentDay = totalDays;

      if (dayRef.current) {
        dayRef.current.textContent = currentDay.toString();
      }

      const interval = setInterval(() => {
        currentDay--;
        if (dayRef.current) {
          dayRef.current.textContent = currentDay.toString();
        }

        if (currentDay === 0) {
          clearInterval(interval);
          if (dayRef.current) {
            dayRef.current.textContent = totalDays.toString();
          }
        }
      }, dayDuration);

      return interval;
    };

    const wrapDeadlineText = () => {
      if (deadlineTextRef.current) {
        const originalHtml = deadlineTextRef.current.innerHTML;
        deadlineTextRef.current.innerHTML = `
          <div class="mask-red"><div class="inner">${originalHtml}</div></div>
          <div class="mask-white"><div class="inner">${originalHtml}</div></div>
        `;
      }
    };

    wrapDeadlineText();
    updateDesignerArmAnimation();
    let interval = runTimer(animationTime, days);

    const loop = setInterval(() => {
      interval = runTimer(animationTime, days);
      updateDesignerArmAnimation();
      console.log("begin interval", animationTime * 1000);
    }, animationTime * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(loop);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.deadline}>
        <svg preserveAspectRatio="none" id="line" viewBox="0 0 581 158">
          {/* ... your full SVG remains unchanged except for JSX compliance (previous step) ... */}
        </svg>

        <div className={styles.deadlineDays} ref={deadlineTextRef}>
          Deadline{" "}
          <span className={styles.day} ref={dayRef}>
            7
          </span>{" "}
          <span className={styles.days}>days</span>
        </div>
      </div>
    </div>
  );
};

export default DeadlineLoading;
