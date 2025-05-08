// src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';

export const Sidebar = () => {
  const location = useLocation();

  const links = [
    { to: '/stories', label: '📚 Quản lý truyện' },
    { to: '/crawl', label: '🛠 Crawl dữ liệu' },
    { to: '/users', label: '👤 Người dùng' },
  ];

  return (
    <aside className="w-[250px] border-r border-border bg-background p-4">
      <NavigationMenu orientation="vertical" className="w-full">
        <NavigationMenuList className="w-full flex flex-col gap-2">
          {links.map((item) => (
            <NavigationMenuItem
              className={`w-full block rounded px-3 py-2 font-medium transition-colors ${location.pathname.startsWith(item.to)
                  ? 'bg-muted text-primary'
                  : 'hover:bg-accent hover:text-accent-foreground'
                }`} key={item.to}>
              <Link
                to={item.to}
              >
                {item.label}
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
};
