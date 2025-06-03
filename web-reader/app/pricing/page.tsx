import { useTranslations } from "next-intl";

import { title } from "@/components/common/utils/primitives";

export default function PricingPage() {
  const t = useTranslations("pricing");

  return (
    <div>
      <h1 className={title()}>{t("title")}</h1>
    </div>
  );
}
