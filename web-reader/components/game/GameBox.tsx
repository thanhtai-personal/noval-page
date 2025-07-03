"use client";
import "./gamebox.css"
import { useState } from "react";
import { GameMenu } from "./GameMenu";
import WheelWrapper from "@/app/play/wheel-of-lottery/ClientRenderWrapper";

export const GameBox = ({ onClose, opened }: any) => {
  const [openLotteryModal, setOpenLotteryModal] = useState(false);

  return (
    <>
      <div
        className={
          `fixed z-[10] bg-transparent top-0 -left-0 w-full h-full flex justify-center items-center gb-box ${openLotteryModal && "showing"
          }`}>
        <WheelWrapper />
      </div>
      <div
        onClick={() => setOpenLotteryModal(false)}
        className={
          `fixed z-[10] cursor-pointer bg-transparent top-16 md:top-40 right-8 md:right-24 uppercase gb-close-icon ${openLotteryModal && "showing"
          }`}>
        <img className="w-[40px] h-[40px] md:w-[94px] md:h-[94px]" width="94" height="94" src="https://img.icons8.com/3d-fluency/94/delete-sign.png" alt="delete-sign" />
      </div>
      <GameMenu onClose={onClose} opened={opened} openLotteryModal={() => setOpenLotteryModal(true)} />
    </>
  )
}