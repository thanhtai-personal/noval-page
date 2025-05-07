import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';

type Props = {
  children: React.ReactNode;
};

const PublicOnlyRoute = ({ children }: Props) => {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await authStore.fetchUser(); // gọi /auth/me
          setValid(true);
        } catch {
          authStore.logout();
        }
      }
      setChecking(false);
    };
    validate();
  }, []);

  if (checking) return null;
  if (authStore.isAuthenticated || valid) {
    return <Navigate to="/crawl" replace />;
  }
  return <>{children}</>;
};

export default observer(PublicOnlyRoute);
