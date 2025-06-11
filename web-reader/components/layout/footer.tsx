import { Navbar as HeroUINavbar } from "@heroui/navbar";
import { FacebookIcon } from "@/components/default/icons";
import { LogoIcon } from "@/assets/icons/Logo";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import GalaxyBackground from "@/components/animations/backgrounds/GalaxyBackground";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full border-t border-default-200 bg-background">
      <div className="w-full relative overflow-hidden min-h-40">
        <div className="absolute pointer-events-none inset-0 z-0 w-full h-full opacity-50 flex items-center justify-center">
          <GalaxyBackground />
        </div>
        <div className="max-w-5xl py-6 mt-12 z-10 mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-14 h-10 text-primary" />
            <span className="font-bold text-lg tracking-wide">Noval Page</span>
          </div>
          <div className="flex items-center gap-6">
            <NextLink
              href="https://www.facebook.com/people/V%C3%B4-%C6%B0u-c%C3%A1c/61576845076989/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-primary transition"
            >
              <FacebookIcon className="size-6" />
            </NextLink>
            <NextLink
              href="/about"
              className="text-sm hover:text-primary transition"
            >
              {t("about", { defaultValue: "About" })}
            </NextLink>
            <NextLink
              href="/contact"
              className="text-sm hover:text-primary transition"
            >
              {t("contact", { defaultValue: "Contact" })}
            </NextLink>
          </div>
          <div className="text-xs text-muted-foreground mt-2 md:mt-0">
            {t("copyright", { defaultValue: "All rights reserved." })}
          </div>
        </div>
      </div>
    </footer>
  );
}
