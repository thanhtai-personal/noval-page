"use client";

import { useTranslations } from "next-intl";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Link from "next/link";

import styles from "./not-found.module.css";

import { useAppStore } from "@/store/Provider";

function NotFoundPage() {
  const t = useTranslations("notFound");
  const store = useAppStore();

  useEffect(() => {
    store.setAnimations({
      useIsland: false,
      useDNA: false,
      useFantasyIsland: false,
      useUniverseBg: false,
    });

    return () => {
      store.resetAnimations();
    };
  }, []);

  return (
    <section className={styles.page_404}>
      <div className={"container"}>
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <div className={styles.four_zero_four_bg}>
                <h1 className="text-center ">404</h1>
              </div>
              <div className={`${styles.contant_box_404} text-black`}>
                <h3 className="h2">{t("look_like_you_re_lost")}</h3>

                <p>{t("page_not_available")}</p>

                <Link className={styles.link_404} href={"/"}>
                  {t("go_to_home")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default observer(NotFoundPage);
