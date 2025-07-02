"use client";
import "./gamebox.css"
import { useState } from "react";
import { GameMenu } from "./GameMenu";

export const GameBox = ({ children, onClose }: any) => {
  const [openLotteryModal, setOpenLotteryModal] = useState(false);

  return (
    <>
      {openLotteryModal && <div
        className="fixed z-[10] bg-transparent top-0 -left-0 w-full h-full flex justify-center items-center gb-box">
        {children}
      </div>}
      {openLotteryModal && <div
        onClick={() => setOpenLotteryModal(false)}
        className="fixed z-[10] cursor-pointer bg-transparent top-40 right-24 uppercase gb-close-icon">
        <img width="94" height="94" src="https://img.icons8.com/3d-fluency/94/delete-sign.png" alt="delete-sign" />
      </div>}
      <GameMenu openLotteryModal={() => setOpenLotteryModal(true)} />
    </>
  )
}