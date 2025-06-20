"use client";

import styles from "./MagicColorfulDot.module.css";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { isMobile } from "@/utils/funtions";
import { useAppStore } from "@/store/Provider";

const MagicColorfulDot = (props: any) => {
  const appStore = useAppStore();

  useEffect(() => {
    if (isMobile() || appStore.animationMode === false) return;

    const c: any = document.querySelector(`#canvas-${props.id}`);
    if (!c) return;

    const ctx = c.getContext("2d");

    const dpr = Math.min(2, window.devicePixelRatio);

    c.width = window.innerWidth * dpr;
    c.height = window.innerHeight * dpr;

    c.style.imageRendering = "pixelated";
    c.style.width = "100%";
    c.style.height = "100vh";

    const palettes = [
      [
        "#f72585",
        "#b5179e",
        "#7209b7",
        "#560bad",
        "#480ca8",
        "#3a0ca3",
        "#3f37c9",
        "#4361ee",
        "#4895ef",
        "#4cc9f0",
      ],
      ["#06d6a0", "#1b9aaa", "#ef476f", "#ffd166", "#118ab2", "#073b4c"],
      ["#fee440", "#f15bb5", "#9b5de5", "#00bbf9", "#00f5d4", "#38b000"],
    ];
    let currentPaletteIndex = 0; // Index de la palette actuelle
    const palette = [...palettes[currentPaletteIndex]];

    const points: any[] = [];

    const createPoint = (x: any, y: any, color: any) => ({
      x,
      y,
      vx: (Math.random() - 0.5) * 2, // Vitesse initiale aléatoire
      vy: (Math.random() - 0.5) * 2,
      wandering: false, // Mode erratique
      wanderTimer: 0, // Durée de l'erratique
      color,
      movementType: Math.random() < 0.5 ? "calm" : "aggressive", // Type de mouvement : calme ou agressif
    });

    for (let i = 0; i < 500; i++) {
      points.push(
        createPoint(
          Math.random() * c.width,
          Math.random() * c.height,
          Math.floor(Math.random() * palette.length),
        ),
      );
    }

    const mouse = { x: c.width / 2, y: c.height / 2 };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX * dpr;
      mouse.y = e.clientY * dpr;
    });

    // Flags pour les différentes actions
    let isRPressed = false;
    let isTPressed = false;

    window.addEventListener("keydown", (e) => {
      if (e.key === "r") {
        isRPressed = true;
      }
      if (e.key === "t") {
        isTPressed = true;
      }
      if (e.key === "c") {
        // Changement de palette de couleurs
        currentPaletteIndex = (currentPaletteIndex + 1) % palettes.length;
        palette.splice(0, palette.length, ...palettes[currentPaletteIndex]);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "r") {
        isRPressed = false;
      }
      if (e.key === "t") {
        isTPressed = false;
      }
    });

    function getAngle(cx: any, cy: any, ex: any, ey: any) {
      const dy = ey - cy;
      const dx = ex - cx;
      return Math.atan2(dy, dx); // range (-PI, PI]
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, c.width, c.height);

    const drawWind = (time: any) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, c.width, c.height);

      for (let i = 0; i < points.length; i++) {
        const point = points[i];

        if (!point.wandering && Math.random() < 0.005) {
          // Activer le mode erratique pour une durée limitée
          point.wandering = true;
          point.wanderTimer = Math.random() * 100 + 50; // Durée aléatoire en frames
        }

        if (point.wandering) {
          // Déplacement erratique
          point.vx += (Math.random() - 0.5) * 0.5;
          point.vy += (Math.random() - 0.5) * 0.5;
          point.wanderTimer--;

          if (point.wanderTimer <= 0) {
            point.wandering = false; // Retour au mouvement normal
          }
        } else {
          const angleToMouse = getAngle(point.x, point.y, mouse.x, mouse.y);

          if (isRPressed) {
            // Attraction vers la souris
            const attractionForce = 0.3; // Intensité de l'attraction
            point.vx += Math.cos(angleToMouse) * attractionForce;
            point.vy += Math.sin(angleToMouse) * attractionForce;
          }

          if (isTPressed) {
            // Répulsion depuis la souris
            const repulsionForce = 0.5; // Intensité de la répulsion
            point.vx += Math.cos(angleToMouse + Math.PI) * repulsionForce;
            point.vy += Math.sin(angleToMouse + Math.PI) * repulsionForce;
          }

          // Mouvement naturel
          const randomness = Math.sin(time / 1000 + i) * 0.5;
          const angle = angleToMouse + randomness;

          if (!isRPressed && !isTPressed) {
            // Seulement si aucune action n'est en cours
            if (point.movementType === "calm") {
              point.vx += Math.cos(angle) * 0.05; // Accélération plus douce
              point.vy += Math.sin(angle) * 0.05;
            } else if (point.movementType === "aggressive") {
              point.vx += Math.cos(angle) * 0.2; // Accélération plus forte
              point.vy += Math.sin(angle) * 0.2;
            }
          }

          // Appliquer un léger amortissement pour un mouvement plus fluide
          point.vx *= 0.98;
          point.vy *= 0.98;
        }

        // Mise à jour des positions
        point.x += point.vx;
        point.y += point.vy;

        // Rebondir sur les bords
        if (point.x < 0) point.x = c.width;
        if (point.x > c.width) point.x = 0;
        if (point.y < 0) point.y = c.height;
        if (point.y > c.height) point.y = 0;

        // Dessiner le point
        ctx.fillStyle = palette[point.color];
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = (time: any) => {
      requestAnimationFrame(animate);
      drawWind(time);
    };

    window.addEventListener("resize", () => {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, c.width, c.height);
    });

    animate(0);
  }, [appStore.animationMode, props.id]);

  if (isMobile() || appStore.animationMode === false) {
    return "";
  }

  return (
    <canvas className={styles.galaxybg} id={`canvas-${props.id}`}></canvas>
  );
};

export default observer(MagicColorfulDot);
