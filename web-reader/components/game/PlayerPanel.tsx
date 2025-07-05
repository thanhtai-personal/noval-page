"use client";

import "./player-control.css";

import { useAppStore } from "@/store/Provider";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { RunawayKid } from "@/components/3dmodels/models/RunawayKid";
import Model3DContainer from "@/components/3dmodels/3DContainer";
import { Html } from "@react-three/drei";
import { getLevelName } from "@/utils/funtions";

export const PlayerPanel = observer(() => {
  const store = useAppStore();
  const t = useTranslations("profile");

  return (
    <div
      className={`fixed z-10 left-10 top-20 h-screen flex flex-col justify-start player-control ${store.showPlayerControl && "showing"}`}
    >
      {store.isLoggedIn ? (
        <>
          <div className={`hidden md:flex flex-col`}>
            <div className="flex flex-col justify-center items-center  rounded-md p-0 backdrop-blur-sm bg-slate-100/10 rounded-t-full">
              <div style={{ transform: "translateY(70px)" }}>
                <Model3DContainer
                  camera={{ position: [3, 0, 3], fov: 90 }}
                  ambientLight={{ intensity: 3 }}
                  directionalLight={{ intensity: 2, position: [2, 2, 2] }}
                  id="XboxBlue"
                  fallback={
                    <Html center>
                      <div>{t("loading")}</div>
                    </Html>
                  }
                >
                  <RunawayKid
                    transition
                    scale={0.6}
                    fallBack={
                      <Html center>
                        <div>{t("loading")}</div>
                      </Html>
                    }
                  />
                </Model3DContainer>
              </div>
              <div className="flex w-full flex-col bg-slate-500 rounded-md p-4">
                <div className="font-bold text-red-700 text-center">
                  {getLevelName(store.profile.level)}
                </div>
                <div className="mt-2 font-bold text-gray-950 inline-flex justify-between items-center w-full px-4">
                  <div>{t("exp")}:</div>
                  <div>{store.profile.exp}</div>
                </div>
                <div className="font-bold text-gray-950 inline-flex justify-between items-center w-full px-4">
                  <div>{t("coin")}:</div>
                  <div>{store.profile.coin}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex md:hidden"></div>
        </>
      ) : (
        <div className="p-6 gap-4 flex-col bg-slate-600 h-fit hidden md:flex justify-center items-center rounded-md">
          {/* <div>{t("user_info")}</div> */}
          {/* <div className="flex justify-center items-center h-full w-full border-t border-solid border-orange-950"> */}

          <Link href={"/login"}>
            <div className="flex flex-col justify-center items-center">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/glyph-neue/64/fraud.png"
                alt="fraud"
              />
              {t("please_login")}
            </div>
          </Link>
          {/* </div> */}
        </div>
      )}
    </div>
  );
});
