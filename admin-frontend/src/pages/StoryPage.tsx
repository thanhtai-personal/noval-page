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
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination';
import { Link } from "react-router-dom";
import { useI18n } from '@/lib/i18n/i18n';

const LIMIT = 20;

export default function AdminStoryPage() {
  const { t } = useI18n();
  const [stories, setStories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: '',
    author: '',
    category: '',
    page: 1,
  });

  const [gotoPage, setGotoPage] = useState('');

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
        limit: LIMIT,
      },
    });
    setStories(res.data.data || []);
    setTotalPages(Math.ceil(Number(res.data.total) / LIMIT));
  };

  const handleCrawl = async (id: string) => {
    await api.post(`/crawler/stories/${id}`);
    alert('✅ Đã gửi yêu cầu crawl chương mới');
  };

  const handleGoto = () => {
    const page = parseInt(gotoPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setFilters({ ...filters, page });
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchStories();
  }, [filters]);

  const getPageRange = () => {
    const current = filters.page;
    const range = [];

    const start = Math.max(1, current - 1);
    const end = Math.min(totalPages, current + 1);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="w-full p-6 max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">{t('story.title')}</h1>
        <Button variant="outline" onClick={fetchStories}>{t('story.refresh')}</Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="🔍 Tìm tên truyện..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="w-64"
        />

        <Select
          onValueChange={(value) => setFilters({ ...filters, author: value === 'all' ? '' : value, page: 1 })}
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
          onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? '' : value, page: 1 })}
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
            <TableHead>#</TableHead>
            <TableHead>Tên truyện</TableHead>
            <TableHead>Tác giả</TableHead>
            <TableHead>Thể loại</TableHead>
            <TableHead className="text-center">Số chương</TableHead>
            <TableHead>Nguồn</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(stories || []).map((s: any, idx: number) => (
            <TableRow key={s.slug}>
              <TableCell>{(filters.page - 1) * LIMIT + idx + 1}</TableCell>
              <TableCell>{s.title}</TableCell>
              <TableCell>{s.author?.name || '—'}</TableCell>
              <TableCell>
                {(s.categories || []).map((c: any) => c.name).join(', ')}
              </TableCell>
              <TableCell className="text-center">{s.totalChapters || 0}</TableCell>
              <TableCell>{s.source}</TableCell>
              <TableCell>
                <div className="flex gap-2 w-full justify-end items-center">
                  <Button size="sm" onClick={() => handleCrawl(s._id)}>Crawl</Button>
                  <Link to={`/stories/${s.slug}`}>
                    <Button size="sm" variant="outline">Xem chi tiết</Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination className="mt-4 justify-between items-center">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
            />
          </PaginationItem>

          {getPageRange().map((p) => (
            <PaginationItem key={p}>
              <Button
                variant={p === filters.page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters({ ...filters, page: p })}
              >
                {p}
              </Button>
            </PaginationItem>
          ))}
          <span>...</span>
          <PaginationItem key={totalPages}>
              <Button
                variant={totalPages === filters.page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters({ ...filters, page: totalPages })}
              >
                {totalPages}
              </Button>
            </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => setFilters({ ...filters, page: Math.min(totalPages, filters.page + 1) })}
            />
          </PaginationItem>
        </PaginationContent>

        {/* Goto input */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Trang..."
            value={gotoPage}
            onChange={(e) => setGotoPage(e.target.value)}
            className="w-20"
          />
          <Button size="sm" onClick={handleGoto}>Go</Button>
        </div>
      </Pagination>
    </div>
  );
}
