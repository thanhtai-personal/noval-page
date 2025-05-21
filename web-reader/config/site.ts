export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vô ưu các",
  description: "Không gian tiên hiệp, vô thúc vô ưu",
  navItems: [
    {
      label: "Truyện hay",
      href: "/search?sort=recommends",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Liên hệ",
      href: "/contact",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Đăng xuất",
      href: "/logout",
    },
  ],
  links: {},
};
