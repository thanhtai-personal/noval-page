import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserProfileDrawer } from '@/components/drawer/UserProfileDrawer';
import { useNavigate } from 'react-router-dom';
import { authStore } from "@/stores/auth.store";
import { observer } from "mobx-react-lite";
import { useI18n } from '@/lib/i18n/i18n';

export const Header = observer(() => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = authStore;
  const navigate = useNavigate();
  const { t, locale, setLocale } = useI18n();

  const handleLogout = async () => {
    await authStore.logout();
    navigate('/login');
  };

  const engFlag = (
    <svg viewBox="0 0 55.2 38.4" xmlns="http://www.w3.org/2000/svg" className="w-6 h-4">
      <rect fill="#012169" height="38.4" width="55.2" />
      <g>
        <polygon fill="#FFF" points="0,0 22.08,14.4 22.08,0 33.12,0 33.12,14.4 55.2,0 55.2,5.12 36.96,17.28 55.2,17.28 55.2,21.12 36.96,21.12 55.2,33.28 55.2,38.4 33.12,24 33.12,38.4 22.08,38.4 22.08,24 0,38.4 0,33.28 18.24,21.12 0,21.12 0,17.28 18.24,17.28 0,5.12" />
        <polygon fill="#C8102E" points="0,2.08 24.96,17.28 24.96,0 30.24,0 30.24,17.28 55.2,2.08 55.2,7.04 34.56,19.2 55.2,19.2 55.2,19.2 34.56,19.2 55.2,31.36 55.2,36.32 30.24,21.12 30.24,38.4 24.96,38.4 24.96,21.12 0,36.32 0,31.36 20.64,19.2 0,19.2 0,19.2 20.64,19.2 0,7.04" />
        <rect fill="#FFF" height="38.4" width="11.04" x="22.08" y="0" />
        <rect fill="#FFF" height="9.6" width="55.2" x="0" y="14.4" />
        <rect fill="#C8102E" height="38.4" width="5.28" x="24.96" y="0" />
        <rect fill="#C8102E" height="3.84" width="55.2" x="0" y="17.28" />
      </g>
    </svg>
  );
  const viFlag = (
    <svg viewBox="0 0 55.2 38.4" xmlns="http://www.w3.org/2000/svg" className="w-6 h-4">
      <rect fill="#DA251D" height="38.4" width="55.2" />
      <g>
        <polygon fill="#FFFF00" points="27.6,11.52 29.97,18.82 37.65,18.82 31.44,23.33 33.81,30.63 27.6,26.12 21.39,30.63 23.76,23.33 17.55,18.82 25.23,18.82" />
      </g>
    </svg>
  );

  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <div className="text-xl font-bold text-primary">📚 WebTruyen Admin</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {t('header.hello')}, <strong>{user?.name || t('header.user')}</strong>
        </span>
        <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
          {t('header.profile')}
        </Button>
        <div className="flex gap-1 ml-2">
          <button
            className={`rounded p-1 border ${locale === 'vi' ? 'border-primary' : 'border-transparent'}`}
            onClick={() => setLocale('vi')}
            aria-label="Chuyển sang tiếng Việt"
          >
            {viFlag}
          </button>
          <button
            className={`rounded p-1 border ${locale === 'en' ? 'border-primary' : 'border-transparent'}`}
            onClick={() => setLocale('en')}
            aria-label="Switch to English"
          >
            {engFlag}
          </button>
        </div>
      </div>
      <UserProfileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
});
