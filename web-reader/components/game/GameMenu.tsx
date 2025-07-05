import Link from "next/link";
import "./gameMenu.css";
import { useTranslations } from "next-intl";

export const GameMenu = ({ openLotteryModal, onClose, opened }: any) => {
  const t = useTranslations("gameMenu");

  return (
    <div className="game-menu-items fixed z-[10] bottom-10 right-10 flex flex-col justify-center items-center gap-4">
      <div
        className={`cursor-pointer ${opened && "inside"} flex flex-col justify-center items-center gap-2`}
        onClick={() => openLotteryModal?.()}
      >
        <img
          alt="external-lottery-lifestyle-entertainment-vol3-microdots-premium-microdot-graphic"
          className="w-[32px] h-[32px] md:w-[64px] md:h-[64px]"
          height="64"
          src="https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-lottery-lifestyle-entertainment-vol3-microdots-premium-microdot-graphic.png"
          width="64"
        />
        <span className="text-[8px]">{t("lottery")}</span>
      </div>
      <div
        className={`${opened && "inside"} flex flex-col justify-center items-center gap-2`}
      >
        <Link href={"/play"} target="game-play">
          <img
            alt="share-3"
            height="64"
            src="https://img.icons8.com/arcade/64/share-3.png"
            width="64"
          />
        </Link>
        <span className="text-[8px]">{t("more")}</span>
      </div>
      <div className={`${opened && "inside"}`} onClick={() => onClose?.()}>
        <img
          alt="delete-sign"
          height="100"
          src="https://img.icons8.com/keek/100/delete-sign.png"
          width="100"
        />
      </div>
    </div>
  );
};
