export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vo Uu Cac",
  description: "Xianxia space, carefree and unrestrained",
  navItems: [
    {
      intlKey: "bestStories",
      label: "Truyện hay nhất",
      href: "/search?sort=recommends",
    },
    {
      intlKey: "blog",
      label: "Blog",
      href: "/blog",
    },
    {
      intlKey: "contact",
      label: "Liên hệ",
      href: "/contact",
    },
  ],
  navMenuItems: [
    {
      intlKey: "profile",
      label: "Hồ sơ",
      href: "/profile",
    },
    {
      intlKey: "logout",
      label: "Đăng xuất",
      href: "/logout",
    },
  ],
  links: {},
};
