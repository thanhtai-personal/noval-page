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
import { useI18n } from '@/lib/i18n/i18n';

export default function AdminUserPage() {
  const { t } = useI18n();
  const [users, setUsers] = useState({
    items: [],
    total: 0,
  });
  const [roles, setRoles] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    page: 1,
    limit: 10,
  });


  const fetchUsers = async () => {
    const res = await api.get('/users/search', {
      params: {
        search: filters.search,
        role: filters.role,
        page: filters.page,
        limit: 10,
      },
    });
    setUsers(res.data);
  };

  const fetchRoles = async () => {
    const res = await api.get('/roles');
    setRoles(res.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const banUser = async (id: string) => {
    if (!confirm(t('user.isBanned'))) return;
    try {
      await api.post(`/users/${id}/ban`);
      fetchUsers();
      alert(t('user.bannedSuccess'))
    } catch (error) {
      alert(t('user.bannedError'))
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm(t('user.isDelete'))) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
      alert(t('user.deleteSuccess'))
    } catch (error) {
      alert(t('user.deleteError'))
    }
  };

  const totalPages = Math.ceil(users.total / filters.limit);

  return (
    <div className="w-full p-6 max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">{t('user.title')}</h1>
        <Button variant="outline" onClick={fetchUsers}>{t('user.refresh')}</Button>
      </div>
      <div className="flex justify-between items-center">
        <Drawer>
          <DrawerTrigger asChild>
            <Button>➕ {t('user.add')}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t('user.add_title')}</DrawerTitle>
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
          placeholder={t('user.search_placeholder')}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="w-64"
        />
        <Select
          onValueChange={(value) => setFilters({ ...filters, role: value === 'all' ? '' : value, page: 1 })}
          defaultValue="all"
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('user.role_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('user.role_all')}</SelectItem>
            {roles?.map((r: any) => (
              <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('user.email')}</TableHead>
            <TableHead>{t('user.name')}</TableHead>
            <TableHead>{t('user.role')}</TableHead>
            <TableHead>{t('user.action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.items?.map((u: any) => (
            <TableRow key={u._id}>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.role?.name || '—'}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => banUser(u._id)}>{t('user.ban')}</Button>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button size="sm" variant="outline">{t('user.edit')}</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>{t('user.add_title')}</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4">
                      <UserForm onSuccess={fetchUsers} defaultData={u} />
                    </div>
                  </DrawerContent>
                </Drawer>
                <Button size="sm" variant="destructive" onClick={() => deleteUser(u._id)}>{t('user.delete')}</Button>
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
              <span className="text-sm text-muted-foreground px-3 py-1 opacity-50">{t('user.prev')}</span>
            )}
          </PaginationItem>
          <span className="text-sm mt-1 px-2">{t('user.page')} {filters.page} / {totalPages}</span>
          <PaginationItem>
            {filters.page < totalPages ? (
              <PaginationNext onClick={() => setFilters({ ...filters, page: filters.page + 1 })} />
            ) : (
              <span className="text-sm text-muted-foreground px-3 py-1 opacity-50">{t('user.next')}</span>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
