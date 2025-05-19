import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const token = (await cookies()).get('token')?.value;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {token ? (
        <p className="text-green-600">Bạn đã đăng nhập! Token: <code>{token.slice(0, 20)}...</code></p>
      ) : (
        <p className="text-red-600">Không có token. Bạn chưa đăng nhập.</p>
      )}
    </div>
  );
}
