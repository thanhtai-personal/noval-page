import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';

const RequireAuth = observer(({ children }: { children: React.JSX.Element }) => {
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
});

export default RequireAuth;
