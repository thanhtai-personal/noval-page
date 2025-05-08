import { ReactNode, useState } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { UserForm } from '@/components/form/UserForm';
import { Button } from '@/components/ui/button';

interface UserFormDrawerProps {
  trigger?: ReactNode;
  mode?: 'create' | 'edit';
  defaultData?: any; // user object nếu edit
  onSuccess?: () => void;
}

export function UserFormDrawer({
  trigger,
  mode = 'create',
  defaultData,
  onSuccess,
}: UserFormDrawerProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger || <Button variant="default">➕ Thêm user</Button>}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{mode === 'edit' ? '✏️ Cập nhật người dùng' : '➕ Tạo người dùng mới'}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <UserForm
            mode={mode}
            defaultData={defaultData}
            onSuccess={handleSuccess}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
