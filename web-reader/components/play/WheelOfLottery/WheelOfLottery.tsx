import { ReactNode, useEffect, useRef } from "react";

export type TReward = {
  render: () => ReactNode;
  name?: string;
};

const REWARDS: TReward[] = [
  {
    name: "Phần thưởng 1",
    render: () => "Phần thưởng 1",
  },
  {
    name: "Phần thưởng 2",
    render: () => "Phần thưởng 2",
  },
  {
    name: "Phần thưởng 3",
    render: () => "Phần thưởng 3",
  },
  {
    name: "Phần thưởng 4",
    render: () => "Phần thưởng 4",
  },
  {
    name: "Phần thưởng 5",
    render: () => "Phần thưởng 5",
  },
  {
    name: "Phần thưởng 6",
    render: () => "Phần thưởng 6",
  },
  {
    name: "Phần thưởng 7",
    render: () => "Phần thưởng 7",
  },
];

const COLORS = [
  "#FFAF04",
  "#3A84CD",
  "#F04848",
  "#FFD700",
  "#66CDAA",
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

export const WheelOfLottery: React.FC<{
  rewards: TReward[];
  colors?: string[];
  onWinner?: (winner: TReward) => void;
}> = ({ rewards = REWARDS, colors = COLORS, onWinner }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef(true);
  const rotateRef = useRef(0);

  useEffect(() => {
    const hat = wrapperRef.current;
    const startBtn = document.getElementById("wheel-start-btn");

    function handleClick() {
      if (!tokenRef.current || !hat) return;
      tokenRef.current = false;
      const oldDeg = rotateRef.current;
      const deg = Math.floor(Math.random() * 360) + 1080 + oldDeg;
      rotateRef.current = deg;
      hat.style.transform = `rotate(${deg}deg)`;
      hat.style.transition = "transform 7s cubic-bezier(0.25, 0.1, 0, 1)";
      setTimeout(() => {
        tokenRef.current = true;
        calcResult(deg, rewards.length);
      }, 7000);
    }

    function calcResult(deg: number, n: number = 6) {
      // Chia đều n phần, mỗi phần 360/n độ, start từ -(360/n/2)deg
      let partDeg = 360 / n;
      let startDeg = partDeg / 2;

      let angle = ((deg % 360) + (360 - startDeg)) % 360; // shift -30deg để đúng vị trí phần 1
      let index = Math.floor(angle / partDeg) % n;
      console.log("winner", rewards[(index + 1) % rewards.length]);
      alert((index + 1) % rewards.length)
      onWinner?.(rewards[(index + 1) % rewards.length]);
    }

    startBtn?.addEventListener("click", handleClick);
    return () => {
      startBtn?.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen"> 
      <div className="relative w-full max-w-[400px] sm:max-w-[500px] aspect-square mx-auto">
        {/* Spin Button */}
        <button
          id="wheel-start-btn"
          className="absolute z-10 left-1/2 top-1/2 w-[22%] h-[22%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <img
            src="https://w.ladicdn.com/source/spin-btn1.svg"
            alt="Quay"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </button>
        {/* Wheel */}
        <div
          ref={wrapperRef}
          className="relative w-full h-full rounded-full shadow-xl bg-background transition-transform duration-[7s] ease-[cubic-bezier(0.25,0.1,0,1)]"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
      ${rewards
        .map(
          (r, i) =>
            `${colors[i % colors.length]} ${((i * 100) / rewards.length).toFixed(2)}% ${(((i + 1) * 100) / rewards.length).toFixed(2)}%`,
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
                transform: `rotate(${(-180 / rewards.length) - (360 / rewards.length) * idx}deg)`,
                transformOrigin: "0 50%",
                paddingLeft: "5%",
                pointerEvents: "none",
              }}
            >
              {reward.render()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WheelOfLottery;
