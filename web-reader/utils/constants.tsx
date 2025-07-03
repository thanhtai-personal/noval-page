import { USDCoin } from "@/assets/icons/USDCoin";
import { TReward } from "@/components/play/WheelOfLottery/WheelOfLottery";

export const READ_PREFIX = "read-";

export const COLORS = [
  "#F04848",
  "#FFAF04",
  "#3A84CD",
  "#66CDAA",
  "#FFD700",
  "#7D5FFF",
  "#FF7B54",
  "#33C1FF",
  ...Array.from(
    { length: 27 },
    () =>
      `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`,
  ),
];

export const REWARDS: TReward[] = [
  {
    name: "EXP_1",
    value: 10,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+10 Exp</div>
    </div>
  },
  {
    name: "EXP_2",
    value: 20,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+20 Exp</div>
    </div>
  },
  {
    name: "EXP_3",
    value: 30,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+30 Exp</div>
    </div>
  },
  {
    name: "EXP_4",
    value: 40,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+40 Exp</div>
    </div>
  },
  {
    name: "EXP_5",
    value: 50,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+50 Exp</div>
    </div>
  },
  {
    name: "EXP_6",
    value: 60,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+60 Exp</div>
    </div>
  },
  {
    name: "EXP_7",
    value: 70,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+70 Exp</div>
    </div>
  },
  {
    name: "EXP_8",
    value: 80,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+80 Exp</div>
    </div>
  },
  {
    name: "EXP_9",
    value: 90,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+90 Exp</div>
    </div>
  },
  {
    name: "EXP_10",
    value: 100,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+100 Exp</div>
    </div>
  },
  {
    name: "EXP_11",
    value: 90,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+90 Exp</div>
    </div>
  },
  {
    name: "EXP_12",
    value: 80,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+80 Exp</div>
    </div>
  },
  {
    name: "EXP_13",
    value: 70,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+70 Exp</div>
    </div>
  },
  {
    name: "EXP_14",
    value: 60,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+60 Exp</div>
    </div>
  },
  {
    name: "EXP_15",
    value: 50,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+50 Exp</div>
    </div>
  },
  {
    name: "EXP_16",
    value: 40,
    render: () => <div className="flex flex-row items-center justify-center w-full h-full">
      <USDCoin />
      <div className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>+40 Exp</div>
    </div>
  },
]