import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils'; // dùng để gộp className
import { useI18n } from '@/lib/i18n/i18n';

export const Sidebar = () => {
  const location = useLocation();
  const { t, locale, setLocale } = useI18n();

  const links = [
    { to: '/stories', label: t('sidebar.stories') },
    { to: '/crawl', label: t('sidebar.crawl') },
    { to: '/users', label: t('sidebar.users') },
  ];

  return (
    <aside className="min-w-68 max-w-96 min-h-screen border-r bg-background p-4">
      <NavigationMenu orientation="vertical" className="w-full">
        <NavigationMenuList className="w-full flex flex-col gap-1">
          {links.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavigationMenuItem key={item.to} className="w-full justify-start items-start">
                <Link
                  to={item.to}
                  className={cn(
                    'block rounded px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
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
