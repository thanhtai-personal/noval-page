"use client";

import { TReward, WheelOfLotteryRef } from "@/components/play/WheelOfLottery/WheelOfLottery";
import { REWARDS } from "@/utils/constants";
import dynamic from "next/dynamic";
import React from "react";

const WheelOfLottery = dynamic(
  () => import("@/components/play/WheelOfLottery/WheelOfLottery"),
  { ssr: false },
);

const ClientRenderWrapper = (props: any) => {
  const wheelRef = React.useRef<WheelOfLotteryRef>(null);

  const handleWinner = (winner: TReward) => {
    alert(`Bạn nhận được ${winner.value} kinh nghiệm`)
  }

  return <div className="w-full max-h-screen flex flex-col mt-6 gap-4">
    <WheelOfLottery ref={wheelRef} rewards={REWARDS} onWinner={handleWinner} {...props} />
  </div>;
};

export default ClientRenderWrapper;
