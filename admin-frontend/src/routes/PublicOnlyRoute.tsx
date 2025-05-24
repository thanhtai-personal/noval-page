import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';

type Props = {
  children: React.ReactNode;
};

const PublicOnlyRoute = ({ children }: Props) => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const validate = async () => {
      try {
        await authStore.fetchUser(); // call /auth/me
      } catch {
        authStore.logout();
      } finally {
        setChecking(false);
      }
    };
    validate();
  }, []);

  if (checking) return null;
  if (authStore.isAuthenticated) {
    return <Navigate to="/crawl" replace />;
  }
  return <>{children}</>;
};

export default observer(PublicOnlyRoute);
