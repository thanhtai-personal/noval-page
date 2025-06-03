import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = (await headers()).get("x-next-intl-locale") || "vi";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
