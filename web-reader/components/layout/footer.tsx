import { FacebookIcon, YoutubeIcon } from "@/components/default/icons";
import { LogoIcon } from "@/assets/icons/Logo";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import GalaxyBackground from "@/components/animations/backgrounds/GalaxyBackground";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full border-t border-default-200 bg-black">
      <div className="w-full relative overflow-hidden min-h-40">
        <div className="absolute pointer-events-none inset-0 z-0 w-full h-full opacity-50 flex items-center justify-center">
          <GalaxyBackground />
        </div>
        <div className="max-w-[1280px] py-6 mt-12 z-10 mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-auto h-16 text-primary" />
            <span className="text-white font-bold text-lg tracking-wide">Vô ưu các</span>
          </div>
          <div className="flex items-center gap-6">
            <NextLink
              href="https://www.facebook.com/people/V%C3%B4-%C6%B0u-c%C3%A1c/61576845076989/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-primary transition text-white"
            >
              <FacebookIcon className="size-6" />
            </NextLink>
            <NextLink
              href="https://youtube.com/@vouucac-93?si=6pggujchjpnJ4nWi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Youtube"
              className="hover:text-primary transition text-white"
            >
              <YoutubeIcon className="size-6" />
            </NextLink>
            <NextLink
              href="/about"
              className="text-white text-sm hover:text-primary transition"
            >
              {t("about", { defaultValue: "About" })}
            </NextLink>
            <NextLink
              href="/contact"
              className="text-white text-sm hover:text-primary transition"
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
