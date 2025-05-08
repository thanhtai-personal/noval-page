import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils'; // dùng để gộp className

export const Sidebar = () => {
  const location = useLocation();

  const links = [
    { to: '/stories', label: '📚 Quản lý truyện' },
    { to: '/crawl', label: '🛠 Crawl dữ liệu' },
    { to: '/users', label: '👤 Người dùng' },
  ];

  return (
    <aside className="w-64 min-h-screen border-r bg-background p-4">
      <NavigationMenu orientation="vertical" className="w-full">
        <NavigationMenuList className="w-full flex flex-col gap-1">
          {links.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavigationMenuItem key={item.to} className="w-full justify-start items-start">
                <Link
                  to={item.to}
                  className={cn(
                    'block rounded px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-muted text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {item.label}
                </Link>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
};
