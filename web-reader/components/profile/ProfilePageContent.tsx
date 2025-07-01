"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Pagination } from "@heroui/pagination";
import { Avatar } from "@heroui/avatar";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { observer } from "mobx-react-lite";
import { useAppStore } from "@/store/Provider";
import { useTheme } from "next-themes";
import { READ_PREFIX } from "@/utils/constants";

interface ReadItem {
  slug: string;
  index: string;
}
const PAGE_SIZE = 20;

function ProfilePageContent() {
  const t = useTranslations("profile");
  const [readItems, setReadItems] = useState<ReadItem[]>([]);
  const [page, setPage] = useState(1);
  const appStore = useAppStore();
  const { theme } = useTheme();

  useEffect(() => {
    const items: ReadItem[] = [];

    Object.keys(localStorage).forEach((key) => {
      if (key?.startsWith(READ_PREFIX)) {
        const slug = key.replace(READ_PREFIX, "");
        const index = localStorage.getItem(key) || "0";

        items.push({ slug, index });
      }
    });
    setReadItems(items);
  }, []);

  useEffect(() => {
    appStore.setAnimations({
      useIsland: false,
      useDNA: false,
      useUniverseBg: theme === "dark",
    });

    return () => {
      appStore.resetAnimations();
    };
  }, [theme]);

  const totalPages = Math.ceil(readItems.length / PAGE_SIZE);
  const paginated = readItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4 ">
          <Avatar name={appStore.profile?.name || t("guest")} />
          <div>
            <h1 className="text-xl font-bold">
              {appStore.profile?.name || appStore.profile?.email || t("guest")}
            </h1>
            <p className="text-sm text-gray-500">{t("title")}</p>
          </div>
        </div>

        {appStore.profile && (
          <div className="flex flex-col items-end gap-4 ">
            <div className="flex flex-row items-center">
              <span>{t("exp")}</span>: {appStore.profile.exp || 0}
            </div>
            <div className="flex flex-row items-center">
              <span>{t("level")}</span>: {appStore.profile.level || 1}
            </div>
            <div className="flex flex-row items-center">
              <span>{t("coin")}</span>: {appStore.profile.coin || 0}
            </div>
          </div>
        )}
      </div>

      <Card>
        <CardBody>
          <h2 className="text-lg font-semibold mb-4">
            {t("read_stories")} ({readItems.length})
          </h2>
          {paginated.length === 0 ? (
            <p className="text-sm text-gray-500">{t("no_saved")}</p>
          ) : (
            <ul className="space-y-2">
              {paginated.map(({ slug, index }) => (
                <li key={slug}>
                  <Link href={`/truyen/${slug}/chuong/${index}`}>
                    <span className="text-blue-600 hover:underline">
                      {slug.replace(/-/g, " ")} - {t("read_until", { index })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={page}
            size="sm"
            total={totalPages}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

export default observer(ProfilePageContent);
