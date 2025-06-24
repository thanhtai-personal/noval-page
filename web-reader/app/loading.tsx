import DeadlineLoading from "@/components/common/DeadLineLoading/DeadlineLoading";
import { useTranslations } from "next-intl";

export default function GlobalLoading() {
  const t = useTranslations("global");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <DeadlineLoading label={t("loading")} />
    </div>
  );
}