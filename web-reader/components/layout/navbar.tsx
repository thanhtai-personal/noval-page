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

import { AuthActions } from "../auth/AuthActions";
import { SearchBox } from "../common/searchInput/SearchInput";
import { LinkWithRedirecting } from "../common/utils/LinkWithRedirecting";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/common/utils/theme-switch";
import { FacebookIcon } from "@/components/default/icons";
import { LogoIcon } from "@/assets/icons/Logo";
import { Switch } from "@heroui/switch";
import Cookies from 'js-cookie';
import { useTranslations } from "next-intl";

export const Navbar = () => {
  const handleUpdateLanguage = (value: boolean) => {
    Cookies.set('NEXT_LOCALE', value ? 'en' : 'vi', { expires: 365 });
    location.reload(); // hoặc dùng router.refresh() nếu cần
  };
  const t = useTranslations("nav");
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
            href="https://www.facebook.com/"
          >
            <FacebookIcon className="size-5 text-default-500" />
          </LinkWithRedirecting>
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
          <Switch
            defaultSelected
            color="secondary"
            endContent={<span className="mx-2">EN</span>}
            size="lg"
            startContent={<span className="mx-2">VI</span>}
            className="rounded-none"
            onChange={handleUpdateLanguage as any}
          >
          </Switch>
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
};
