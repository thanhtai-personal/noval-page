import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';
import { RoleSlug } from '@/constants/role.enum'; // Giả sử bạn có enum này

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, user } = authStore;

  // ❌ Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Không có quyền truy cập
  const role = user?.role;
  if (role !== RoleSlug.ADMIN && role !== RoleSlug.SUPER_ADMIN) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default observer(ProtectedRoute);
