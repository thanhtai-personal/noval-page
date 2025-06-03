import { title } from "@/components/common/utils/primitives";
import { useTranslations } from "next-intl";

export default function DocsPage() {
  const t = useTranslations("docs");
  return (
    <div>
      <h1 className={title()}>{t("title")}</h1>
    </div>
  );
}
