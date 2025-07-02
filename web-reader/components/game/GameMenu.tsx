import Link from "next/link"
import "./gameMenu.css"
import { useEffect, useState } from "react";

export const GameMenu = ({
  openLotteryModal
}: any) => {
  const [inside, setInside] = useState(false);

  useEffect(() => {
    const toId = setTimeout(() => {
      setInside(true);
    }, 850)

    return () => {
      clearTimeout(toId);
    }
  }, [])

  return (<div className="fixed z-[10] bottom-24 right-10 flex flex-col justify-center items-center gap-4">
    <div className={`game-menu-item cursor-pointer ${inside && "inside"}`} onClick={() => openLotteryModal?.()}
      style={{ animationDelay: '250ms' }}
    >
      <img width="64" height="64"
        src="https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-lottery-lifestyle-entertainment-vol3-microdots-premium-microdot-graphic.png" alt="external-lottery-lifestyle-entertainment-vol3-microdots-premium-microdot-graphic"
      />
    </div>
    <div className={`game-menu-item ${inside && "inside"}`}>
      <Link href={"/play"} target="game-play">
        <img width="94" height="94" src="https://img.icons8.com/3d-fluency/94/more.png" alt="more"/>
      </Link>
    </div>
  </div >
  )
}