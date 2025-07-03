import Link from "next/link"
import "./gameMenu.css"

export const GameMenu = ({
  openLotteryModal,
  onClose,
  opened,
}: any) => {

  return (<div className="game-menu-items fixed z-[10] bottom-10 right-10 flex flex-col justify-center items-center gap-4">
    <div className={`cursor-pointer ${opened && "inside"}`} onClick={() => openLotteryModal?.()}>
      <img className="w-[32px] h-[32px] md:w-[64px] md:h-[64px]" width="64" height="64"
        src="https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-lottery-lifestyle-entertainment-vol3-microdots-premium-microdot-graphic.png" alt="external-lottery-lifestyle-entertainment-vol3-microdots-premium-microdot-graphic"
      />
    </div>
    <div className={`${opened && "inside"}`}>
      <Link href={"/play"} target="game-play">
        <img  className="w-[32px] h-[32px] md:w-[64px] md:h-[64px]" width="64" height="64" src="https://img.icons8.com/3d-fluency/94/more.png" alt="more"/>
      </Link>
    </div>
    <div onClick={() => onClose?.()} className={`${opened && "inside"}`}>
      <img width="100" height="100" src="https://img.icons8.com/keek/100/delete-sign.png" alt="delete-sign"/>
    </div>
  </div >
  )
}