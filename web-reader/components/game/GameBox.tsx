"use client";
import "./gamebox.css";
import { useState } from "react";
import { observer } from "mobx-react-lite";

import { GameMenu } from "./GameMenu";

import WheelWrapper from "@/app/play/wheel-of-lottery/ClientRenderWrapper";
import { useAppStore } from "@/store/Provider";

export const GameBox = observer(({ onClose, opened }: any) => {
  const [openLotteryModal, setOpenLotteryModal] = useState(false);
  const store = useAppStore();

  return (
    <>
      <div
        className={`fixed z-[10] bg-transparent top-0 -left-0 w-full h-full flex justify-center items-center gb-box ${
          openLotteryModal && "showing"
        } backdrop-blur-sm`}
      >
        <WheelWrapper />
      </div>
      <div
        className={`fixed z-[10] cursor-pointer bg-transparent top-16 md:top-40 right-8 md:right-24 uppercase gb-close-icon ${
          openLotteryModal && "showing"
        }`}
        onClick={() => {
          setOpenLotteryModal(false);
          store.ui.showPlayerControl = false;
        }}
      >
        <img
          alt="delete-sign"
          className="w-[40px] h-[40px] md:w-[94px] md:h-[94px]"
          height="94"
          src="https://img.icons8.com/3d-fluency/94/delete-sign.png"
          width="94"
        />
      </div>
      <GameMenu
        openLotteryModal={() => {
          setOpenLotteryModal(true);
          store.ui.showPlayerControl = true;
        }}
        opened={opened}
        onClose={onClose}
      />
    </>
  );
});
