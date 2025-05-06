import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserProfileDrawer } from '@/components/drawer/UserProfileDrawer';
import { useNavigate } from 'react-router-dom';
import { authStore } from "@/stores/auth.store";
import { observer } from "mobx-react-lite";

export const Header = observer(() => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = authStore;
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <div className="text-xl font-bold text-primary">📚 WebTruyen Admin</div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Xin chào, <strong>{user?.name || 'Người dùng'}</strong>
        </span>
        <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
          Hồ sơ
        </Button>
      </div>

      <UserProfileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
});
