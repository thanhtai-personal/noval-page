import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface UserFormProps {
  mode?: 'create' | 'edit';
  defaultData?: any; // user object
  onSuccess?: () => void;
}

export function UserForm({
  mode = 'create',
  defaultData,
  onSuccess,
}: UserFormProps) {
  const [email, setEmail] = useState(defaultData?.email || '');
  const [name, setName] = useState(defaultData?.name || '');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(defaultData?.role?._id || '');
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    const res = await api.get('/role');
    setRoles(res.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async () => {
    if (!email || !roleId || (mode === 'create' && !password)) {
      alert('Vui lòng nhập đầy đủ Email, Vai trò và Mật khẩu (nếu tạo mới)');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'edit') {
        await api.patch(`/user/${defaultData._id}`, {
          email,
          name,
          role: roleId,
        });
        alert('✅ Cập nhật người dùng thành công');
      } else {
        await api.post('/user', {
          email,
          name,
          password,
          role: roleId,
        });
        alert('✅ Tạo người dùng thành công');
        // Reset form nếu tạo
        setEmail('');
        setName('');
        setPassword('');
        setRoleId('');
      }

      onSuccess?.();
    } catch (err: any) {
      alert(err?.response?.data?.message || '❌ Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
        />
      </div>

      <div>
        <Label>Tên</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Họ tên"
        />
      </div>

      {mode === 'create' && (
        <div>
          <Label>Mật khẩu</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
        </div>
      )}

      <div>
        <Label>Vai trò</Label>
        <Select value={roleId} onValueChange={(value) => setRoleId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn vai trò..." />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r: any) => (
              <SelectItem key={r._id} value={r._id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading
          ? mode === 'edit'
            ? 'Đang cập nhật...'
            : 'Đang tạo...'
          : mode === 'edit'
          ? 'Cập nhật người dùng'
          : 'Tạo người dùng'}
      </Button>
    </div>
  );
}
