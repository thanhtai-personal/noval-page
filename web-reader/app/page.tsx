import LazyHomePage from "./LazyHomePage";
import { headers } from "next/headers";
import { createTranslator, getMessages } from "next-intl/server";

export async function generateMetadata() {
  const locale = headers().get("x-next-intl-locale") || "vi";
  const messages = await getMessages({ locale });
  const t = createTranslator({ locale, messages, namespace: "home" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function HomePage() {
  return <LazyHomePage />;
}
