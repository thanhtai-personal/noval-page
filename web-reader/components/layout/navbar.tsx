import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";

import { AuthActions } from "../auth/AuthActions";
import { SearchBox } from "../common/searchInput/SearchInput";
import { LinkWithRedirecting } from "../common/utils/LinkWithRedirecting";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/common/utils/theme-switch";
import { FacebookIcon } from "@/components/default/icons";
import { LogoIcon } from "@/assets/icons/Logo";
import { observer } from "mobx-react-lite";
import { useAppStore } from "@/store/Provider";
import { Button } from "@heroui/button";

export const Navbar = observer(() => {
  const t = useTranslations("nav");
  const appStore = useAppStore();

  const handleUpdateLanguage = () => {
    const value = Cookies.get("NEXT_LOCALE") !== "vi";

    Cookies.set("NEXT_LOCALE", value ? "vi" : "en", { expires: 365 });
    location.reload();
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <LogoIcon className="w-20 h-14 text-default-900" />
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {t(item.intlKey)}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <LinkWithRedirecting
            isExternal
            aria-label="TTV"
            href="https://www.facebook.com/people/V%C3%B4-%C6%B0u-c%C3%A1c/61576845076989/"
            target="_blank"
          >
            <FacebookIcon className="size-5 text-default-500" />
          </LinkWithRedirecting>

          <div
            className="cursor-pointer"
            onClick={() => appStore.toggleAnimationMode()}
            title={t("animationMode")}
          >
            🎬
          </div>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <SearchBox />
        </NavbarItem>
        <NavbarItem className="hidden sm:flex gap-2">
          <NavbarItem>
            <AuthActions />
          </NavbarItem>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex gap-2">
          <div
            className="cursor-pointer w-8 h-8 flex justify-center items-center"
            onClick={handleUpdateLanguage}
            onTouchEnd={handleUpdateLanguage}
          >
            {Cookies.get("NEXT_LOCALE") === "en" ? engFlag : viFlag}
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <SearchBox />
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <LinkWithRedirecting
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {t(item.intlKey)}
              </LinkWithRedirecting>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
});

const engFlag = (
  <svg viewBox="0 0 55.2 38.4" xmlns="http://www.w3.org/2000/svg">
    <rect fill="#012169" height="38.4" width="55.2" />
    <g>
      <polygon
        fill="#FFF"
        points="0,0 22.08,14.4 22.08,0 33.12,0 33.12,14.4 55.2,0 55.2,5.12 36.96,17.28 55.2,17.28 55.2,21.12 36.96,21.12 55.2,33.28 55.2,38.4 33.12,24 33.12,38.4 22.08,38.4 22.08,24 0,38.4 0,33.28 18.24,21.12 0,21.12 0,17.28 18.24,17.28 0,5.12"
      />
      <polygon
        fill="#C8102E"
        points="0,2.08 24.96,17.28 24.96,0 30.24,0 30.24,17.28 55.2,2.08 55.2,7.04 34.56,19.2 55.2,19.2 55.2,19.2 34.56,19.2 55.2,31.36 55.2,36.32 30.24,21.12 30.24,38.4 24.96,38.4 24.96,21.12 0,36.32 0,31.36 20.64,19.2 0,19.2 0,19.2 20.64,19.2 0,7.04"
      />
      <rect fill="#FFF" height="38.4" width="11.04" x="22.08" y="0" />
      <rect fill="#FFF" height="9.6" width="55.2" x="0" y="14.4" />
      <rect fill="#C8102E" height="38.4" width="5.28" x="24.96" y="0" />
      <rect fill="#C8102E" height="3.84" width="55.2" x="0" y="17.28" />
    </g>
  </svg>
);

const viFlag = (
  <svg viewBox="0 0 55.2 38.4" xmlns="http://www.w3.org/2000/svg">
    <rect fill="#DA251D" height="38.4" width="55.2" />
    <g>
      <polygon
        fill="#FFFF00"
        points="27.6,11.52 29.97,18.82 37.65,18.82 31.44,23.33 33.81,30.63 27.6,26.12 21.39,30.63 23.76,23.33 17.55,18.82 25.23,18.82"
      />
    </g>
  </svg>
);
