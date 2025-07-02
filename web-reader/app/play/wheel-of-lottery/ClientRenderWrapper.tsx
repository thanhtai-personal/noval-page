"use client";

import { TReward, WheelOfLotteryRef } from "@/components/play/WheelOfLottery/WheelOfLottery";
import { COLORS } from "@/utils/constants";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";

const WheelOfLottery = dynamic(
  () => import("@/components/play/WheelOfLottery/WheelOfLottery"),
  { ssr: false },
);

const ClientRenderWrapper = (props: any) => {
  const wheelRef = React.useRef<WheelOfLotteryRef>(null);
  const [size, setSize] = useState(6);

  const rewards = useMemo(() => {
    return REWARDS.filter((_, index) => index < size)
  }, [size])

  return <div className="w-full flex flex-col mt-6">
    <div className="flex flex-row justify-center items-center gap-4">
      <span >Select wheel size: </span>
      <select value={size} onChange={(e: any) => {
        const value: string = e?.target?.value || e as string;
        setSize(Number(value))
      }}
      >
        {REWARDS.map((rw, index) => (
          <option key={rw.name} value={index + 1}>{index + 1} colors</option>
        ))}
      </select>
    </div>
    <div className="flex flex-row justify-center items-center gap-4">
      <span >Select winner to test: </span>
      <select onChange={(e: any) => {
        const value: string = e?.target?.value || e as string;
        const winner = rewards.find((r) => r.name === value);
        wheelRef.current?.setWinner(winner);
      }}
      >
        <option key={'random'} value={-1} style={{
          background: `#FF00FF99`
        }}>Random</option>
        {REWARDS.map((rw, index) => (
          <option key={rw.name} value={rw.name} style={{
            background: `${COLORS[index]}99`
          }}>{rw.render()}</option>
        ))}
      </select>
    </div>
    <WheelOfLottery ref={wheelRef} rewards={rewards} {...props} />
  </div>;
};


const REWARDS: TReward[] = [
  {
    name: "PT 1",
    render: () => "PT 1",
  },
  {
    name: "PT 2",
    render: () => "PT 2",
  },
  {
    name: "PT 3",
    render: () => "PT 3",
  },
  {
    name: "PT 4",
    render: () => "PT 4",
  },
  {
    name: "PT 5",
    render: () => "PT 5",
  },
  {
    name: "PT 6",
    render: () => "PT 6",
  },
  {
    name: "PT 7",
    render: () => "PT 7",
  },
  {
    name: "PT 8",
    render: () => "PT 8",
  },
  {
    name: "PT 9",
    render: () => "PT 9",
  },
  {
    name: "PT 10",
    render: () => "PT 10",
  },
  {
    name: "PT 11",
    render: () => "PT 11",
  },
  {
    name: "PT 12",
    render: () => "PT 12",
  },
  {
    name: "PT 13",
    render: () => "PT 13",
  },
  {
    name: "PT 14",
    render: () => "PT 14",
  },
  {
    name: "PT 15",
    render: () => "PT 15",
  },
  {
    name: "PT 16",
    render: () => "PT 16",
  },
]

export default ClientRenderWrapper;
