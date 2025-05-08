import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableHeader, TableBody, TableCell, TableHead, TableRow,
} from '@/components/ui/table';
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle,
} from '@/components/ui/drawer';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { UserForm } from "@/components/form/UserForm";

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    page: 1,
  });

  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    const res = await api.get('/user', {
      params: {
        search: filters.search,
        role: filters.role,
        page: filters.page,
        limit: 10,
      },
    });
    setUsers(res.data.items);
    setTotalPages(res.data.totalPages);
  };

  const fetchRoles = async () => {
    const res = await api.get('/role');
    setRoles(res.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const banUser = async (id: string) => {
    if (!confirm('Cấm người dùng này?')) return;
    await api.post(`/user/${id}/ban`);
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Xóa người dùng này?')) return;
    await api.delete(`/user/${id}`);
    fetchUsers();
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👤 Quản lý người dùng</h1>
        <Drawer>
          <DrawerTrigger asChild>
            <Button>➕ Thêm user</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Thêm người dùng mới</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <UserForm onSuccess={fetchUsers} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Filter */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Tìm tên hoặc email..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="w-64"
        />
        <Select
          onValueChange={(value) => setFilters({ ...filters, role: value === 'all' ? '' : value, page: 1 })}
          defaultValue="all"
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {roles.map((r: any) => (
              <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u: any) => (
            <TableRow key={u._id}>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.role?.name || '—'}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => banUser(u._id)}>Cấm</Button>
                <Button size="sm" variant="outline">Sửa</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteUser(u._id)}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination className="mt-4 justify-end">
        <PaginationContent>
          <PaginationItem>
            {filters.page > 1 ? (
              <PaginationPrevious onClick={() => setFilters({ ...filters, page: filters.page - 1 })} />
            ) : (
              <span className="text-sm text-muted-foreground px-3 py-1 opacity-50">Trước</span>
            )}
          </PaginationItem>
          <span className="text-sm mt-1 px-2">Trang {filters.page} / {totalPages}</span>
          <PaginationItem>
            {filters.page < totalPages ? (
              <PaginationNext onClick={() => setFilters({ ...filters, page: filters.page + 1 })} />
            ) : (
              <span className="text-sm text-muted-foreground px-3 py-1 opacity-50">Sau</span>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
