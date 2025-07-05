"use client";

import dynamic from "next/dynamic";
import { useSnackbar } from "notistack";
import React from "react";

import { REWARDS } from "@/utils/constants";
import {
  TReward,
  WheelOfLotteryRef,
} from "@/components/play/WheelOfLottery/WheelOfLottery";

const WheelOfLottery = dynamic(
  () => import("@/components/play/WheelOfLottery/WheelOfLottery"),
  { ssr: false },
);

const ClientRenderWrapper = (props: any) => {
  const wheelRef = React.useRef<WheelOfLotteryRef>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleWinner = (winner: TReward) => {
    enqueueSnackbar(`Bạn nhận được ${winner.value} kinh nghiệm`);
  };

  return (
    <div className="w-full max-h-screen flex flex-col mt-6 gap-4">
      <WheelOfLottery
        ref={wheelRef}
        rewards={REWARDS}
        onWinner={handleWinner}
        {...props}
      />
    </div>
  );
};

export default ClientRenderWrapper;
