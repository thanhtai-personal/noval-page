import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import bg01 from '@/assets/images/bg-01.jpg';

const LoginPage = observer(() => {
  const [email, setEmail] = useState('admin@development.com');
  const [password, setPassword] = useState('123456admin');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authStore.login(email, password);
      if (authStore.isAuthenticated) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 px-4"
      style={{
        backgroundImage: `url(${bg01})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        filter: 'blur(0px)',
      }}
    >
      <div className="min-w-max bg-black/50 grid md:grid-cols-2 w-full max-w-[700px] px-4 shadow-lg rounded-xl overflow-hidden">
        <Card className="rounded-none border-none">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Đăng nhập Quản Trị</h1>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <Label>Mật khẩu</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-4">
                {authStore.loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="hidden lg:block">
          <img
            src={bg01}
            alt="Illustration"
            className="h-full w-full max-w-[500px] object-cover"
          />
        </div>
      </div>
    </div>
  );
});

export default LoginPage;
