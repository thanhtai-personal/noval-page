// src/components/layout/UserProfileDrawer.tsx
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const UserProfileDrawer = ({ open, onClose, onLogout }: Props) => {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="ml-auto max-w-sm w-full">
        <DrawerHeader>
          <DrawerTitle>Thông tin người dùng</DrawerTitle>
          <DrawerDescription>Quản lý thông tin cá nhân của bạn.</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2 space-y-2">
          <p><strong>Email:</strong> admin@development.com</p>
          <p><strong>Vai trò:</strong> Admin</p>
          {/* Có thể thêm trường chỉnh sửa tên, mật khẩu ở đây */}
        </div>

        <DrawerFooter>
          <Button variant="destructive" onClick={onLogout}>
            Đăng xuất
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="text-black">Đóng</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
