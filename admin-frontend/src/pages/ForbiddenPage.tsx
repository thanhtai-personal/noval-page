import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { authStore } from '@/stores/auth.store';
import { observer } from 'mobx-react-lite';

const ForbiddenPage = observer(() => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="w-screen flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Không có quyền truy cập</h1>
      <p className="text-gray-600 mb-6">Bạn không có quyền truy cập vào trang này.</p>
      <Button variant="outline" className="text-black" onClick={handleLogout}>
        Đăng xuất và quay lại trang đăng nhập
      </Button>
    </div>
  );
});

export default ForbiddenPage;
