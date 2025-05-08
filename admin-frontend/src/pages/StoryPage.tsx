import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import {
  Table, TableHeader, TableBody, TableCell, TableHead, TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
  from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Pagination, PaginationContent, PaginationItem
  , PaginationNext, PaginationPrevious
} from '@/components/ui/pagination';

export default function AdminStoryPage() {
  const [stories, setStories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    author: '',
    category: '',
    page: 1,
  });

  const [totalPages, setTotalPages] = useState(1);

  const fetchFilters = async () => {
    const [authorRes, catRes] = await Promise.all([
      api.get('/authors'),
      api.get('/categories'),
    ]);
    setAuthors(authorRes.data?.data || []);
    setCategories(catRes.data?.data || []);
  };

  const fetchStories = async () => {
    const res = await api.get('/stories', {
      params: {
        search: filters.search,
        author: filters.author,
        category: filters.category,
        page: filters.page,
        limit: 10,
      },
    });
    setStories(res.data.data || []);
    setTotalPages(res.data.totalPages);
  };

  const handleCrawl = async (id: string) => {
    await api.post(`/crawler/stories/${id}`);
    alert('✅ Đã gửi yêu cầu crawl chương mới');
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchStories();
  }, [filters]);

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <h1 className="text-2xl font-semibold">📚 Quản lý truyện</h1>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="🔍 Tìm tên truyện..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="w-64"
        />

        <Select
          onValueChange={(value: any) => setFilters({ ...filters, author: value, page: 1 })}
          defaultValue={filters.author}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tác giả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {(authors || []).map((a: any) => (
              <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value: any) => setFilters({ ...filters, category: value, page: 1 })}
          defaultValue={filters.category}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Thể loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {(categories || []).map((c: any) => (
              <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên truyện</TableHead>
            <TableHead>Tác giả</TableHead>
            <TableHead>Thể loại</TableHead>
            <TableHead className="text-center">Số chương</TableHead>
            <TableHead>Nguồn</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(stories || []).map((s: any) => (
            <TableRow key={s._id}>
              <TableCell>{s.title}</TableCell>
              <TableCell>{s.author?.name || '—'}</TableCell>
              <TableCell>
                {(s.categories || []).map((c: any) => c.name).join(', ')}
              </TableCell>
              <TableCell className="text-center">{s.chapterCount || s.chapters?.length || 0}</TableCell>
              <TableCell>{s.source}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => handleCrawl(s._id)}>Crawl</Button>
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
              <PaginationPrevious
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              />
            ) : (
              <span className="opacity-50 cursor-not-allowed">Previous</span>
            )}
          </PaginationItem>
          <span className="px-2 mt-1 text-sm">Trang {filters.page} / {totalPages}</span>
          <PaginationItem>
            {filters.page < totalPages ? (
              <PaginationNext
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              />
            ) : (
              <span className="opacity-50 cursor-not-allowed">Next</span>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
