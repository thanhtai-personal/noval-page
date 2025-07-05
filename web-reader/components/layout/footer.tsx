import { useTranslations } from "next-intl";
import NextLink from "next/link";

import { FacebookIcon, YoutubeIcon } from "@/components/default/icons";
import { LogoIcon } from "@/assets/icons/Logo";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer
      className="w-full bg-[#00000099] z-[5]"
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="w-full relative overflow-hidden min-h-40">
        <div className="max-w-[1280px] py-6 mt-12 z-10 mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-auto h-16 text-primary" />
            <span className={`text-white font-bold text-lg tracking-wide`}>
              Vô ưu các
            </span>
          </div>
          <div className="flex items-center gap-6">
            <NextLink
              aria-label="Facebook"
              className="hover:text-primary transition text-white"
              href="https://www.facebook.com/people/V%C3%B4-%C6%B0u-c%C3%A1c/61576845076989/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FacebookIcon className="size-6" />
            </NextLink>
            <NextLink
              aria-label="Youtube"
              className="hover:text-primary transition text-white"
              href="https://youtube.com/@vouucac-93?si=6pggujchjpnJ4nWi"
              rel="noopener noreferrer"
              target="_blank"
            >
              <YoutubeIcon className="size-6" />
            </NextLink>
            <NextLink
              className="text-white text-sm hover:text-primary transition"
              href="/about"
            >
              {t("about", { defaultValue: "About" })}
            </NextLink>
            <NextLink
              className="text-white text-sm hover:text-primary transition"
              href="/contact"
            >
              {t("contact", { defaultValue: "Contact" })}
            </NextLink>
          </div>
          <div className="text-white text-xs text-muted-foreground mt-2 md:mt-0">
            {t("copyright", { defaultValue: "All rights reserved." })}
          </div>
        </div>
      </div>
    </footer>
  );
}
