import React, { ReactNode, useRef, useImperativeHandle, forwardRef, useState } from "react";
import spinSvg from "@/assets/spin.svg";
import Image from "next/image";
import { COLORS } from "@/utils/constants";
import { SoundHiddenPlayer } from "@/app/play/sound/SoundHiddenPlayer";
import { SoundManagerAPI, SoundManagerProvider } from "@/app/play/sound/context/SoundManagerProvider";
import "./wheel-of-lottery.css"

export type TReward = {
  render: () => ReactNode;
  name?: string;
};

const ANIMATION_TIME = 14000;
const DEFAULT_ROTATE = 75;

export interface WheelOfLotteryRef {
  setWinner: (winner?: TReward) => void;
}

export const WheelOfLottery = forwardRef<WheelOfLotteryRef, {
  rewards: TReward[];
  colors?: string[];
  onWinner?: (winner: TReward) => void;
}>(({ rewards, colors = COLORS, onWinner }, ref) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef(true);
  const rotateRef = useRef(DEFAULT_ROTATE);
  const audioRef = useRef<SoundManagerAPI>();
  const [winner, setWinner] = useState<TReward | null>(null);

  useImperativeHandle(ref, () => ({
    setWinner: (w?: TReward) => {
      setWinner(w ?? null);
    }
  }));

  function handleClick() {
    const hat = wrapperRef.current;
    audioRef.current?.play();
    if (!tokenRef.current || !hat) return;
    tokenRef.current = false;
    const oldDeg = rotateRef.current;

    const rotateLoopDeg = Math.floor(Math.random() * 25 + 10) * 360;
    let deg = Math.floor(Math.random() * 360) + rotateLoopDeg + oldDeg;

    if (winner) {
      const winnerIndex = rewards.findIndex((r) => r.name === winner.name);
      if (winnerIndex >= 0) {
        const partDeg = 360 / rewards.length;
        let randomDeg = Math.floor(partDeg * Math.random());
        if (randomDeg < 5 && partDeg > 10) {
          randomDeg = 7;
        }

        const winnerDeg = 360 - (partDeg * winnerIndex + randomDeg);
        const deltaDeg = 360 - (oldDeg % 360);
        const resetDeg = oldDeg + deltaDeg; //rotate to 0deg
        const winnerTickDeg = 90;
        deg = resetDeg + rotateLoopDeg + winnerDeg + winnerTickDeg
      }
    }

    rotateRef.current = deg;
    hat.style.transform = `rotate(${deg}deg)`;
    hat.style.transition = "transform 14s cubic-bezier(0.25, 0.1, 0, 1)";
    shadowRef.current?.classList.add("shadow-animation");

    let toId = setTimeout(() => {
      tokenRef.current = true;
      winner && onWinner?.(winner);
      shadowRef.current?.classList.remove("shadow-animation");
      audioRef.current?.stop();
      clearTimeout(toId);
    }, ANIMATION_TIME);
  }

  return (
    <div className="flex flex-col items-center justify-center wheel-of-lottery">
      <div className="relative w-full max-w-[400px] sm:max-w-[500px] aspect-square mx-auto">
        <div className="absolute inset-0 rounded-full w-full h-full z-0"
          ref={shadowRef}
          style={{
            boxShadow: '4px 4px 8px 6px rgba(247, 92, 2, 0.3)',
          }}
        >
          <div className="animation-div w-full h-full relative flex justify-center items-center">
            {/* <div className="absolute top-[5%] left-[5%] w-[90%] h-[90%] rounded-full"></div> */}
            {/* <div className="absolute top-[3%] left-[3%] w-[92%] h-[92%] rounded-full"></div> */}
            {/* <div className="absolute top-[7%] left-[7%] w-[86%] h-[86%] rounded-full"></div> */}
          </div>
        </div>
        <div className="relative w-full max-w-[400px] sm:max-w-[500px] aspect-square mx-auto">
          {/* Spin Button */}
          <button
            id="wheel-start-btn"
            onClick={handleClick}
            className="absolute z-10 left-1/2 top-1/2 w-[22%] h-[22%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
          >
            <Image
              alt="click-to-start"
              className="cursor-pointer"
              src={spinSvg}
              width={90}
              height={90}
            />
          </button>
          {/* Wheel */}
          <div
            ref={wrapperRef}
            style={{
              transform: `rotate(${DEFAULT_ROTATE}deg)`,
            }}
            className="relative w-full h-full rounded-full shadow-xl bg-background transition-transform duration-[7s] ease-[cubic-bezier(0.25,0.1,0,1)]"
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                ${rewards
                    .map(
                      (r, i) =>
                        `${colors[i % colors.length]} ${((i * 100) / rewards.length).toFixed(2)}% ${(((i + 1) * 100) / rewards.length).toFixed(2)}%`
                    )
                    .join(",\n")}
              )`,
              }}
            ></div>
            {rewards.map((reward, idx) => (
              <div
                key={idx}
                className="absolute left-1/2 top-1/2 w-[60%] text-center text-white font-semibold text-[3.9vw] sm:text-xl select-none drop-shadow-md"
                style={{
                  transform: `rotate(${270 + ((360 / rewards.length) * idx)}deg)`,
                  transformOrigin: "0 0",
                  paddingLeft: "3%",
                  pointerEvents: "none",
                }}
              >
                {reward.render()}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SoundManagerProvider autoPlay list={tracks} ref={audioRef as any}>
        <SoundHiddenPlayer />
      </SoundManagerProvider>
    </div>
  );
});

const tracks = [
  { id: "1", url: "/audio/spinning.wav", title: "spinning", artist: "A", cover: "" },
];

WheelOfLottery.displayName = "WheelOfLottery";

export default WheelOfLottery;
