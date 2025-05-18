'use client';

import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold">Đăng nhập</h2>
          <p className="text-gray-500 text-sm">Đăng nhập để tiếp tục đọc truyện</p>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col items-center gap-4">
          <Button
            startContent={<FcGoogle size={20} />}
            className="w-full"
            variant="flat"
            onClick={handleGoogleLogin}
          >
            Đăng nhập với Google
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
