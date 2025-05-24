import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';
import { RoleSlug } from '@/constants/role.enum'; // Giả sử bạn có enum này

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, user, loadingAuth } = authStore;
  const role = user?.role;

  // ❌ Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (loadingAuth) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }
  // ❌ Không có quyền truy cập
  if (role !== RoleSlug.ADMIN && role !== RoleSlug.SUPER_ADMIN) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default observer(ProtectedRoute);
