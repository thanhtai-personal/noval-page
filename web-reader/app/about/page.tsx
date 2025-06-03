import { title } from "@/components/common/utils/primitives";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");
  return (
    <div>
      <h1 className={title()}>{t("title")}</h1>
    </div>
  );
}
