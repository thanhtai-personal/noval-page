import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import {
  Table, TableHeader, TableBody, TableCell, TableHead, TableRow,
} from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

const LIMIT = 20;

export default function AdminChapterPage() {
  const { storyId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchChapters = async () => {
    const res = await api.get(`stories/${storyId}/chapters`, {
      params: { page, limit: LIMIT }
    });
    console.log('Fetched chapters:', res);
    setChapters(res.data.data || []);
    setTotal(res.data.total || 0);
  };

  useEffect(() => {
    if (storyId) fetchChapters();
  }, [storyId, page]);

  const totalPages = Math.ceil(total / LIMIT);
  
  return (
    <div className="p-6 space-y-4 max-w-5xl">
      <h1 className="text-2xl font-semibold">📄 Danh sách chương</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Tên chương</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chapters?.map((ch: any, idx) => (
            <TableRow key={ch._id}>
              <TableCell>{(page - 1) * LIMIT + idx + 1}</TableCell>
              <TableCell>{ch.title}</TableCell>
              <TableCell>{ch.slug}</TableCell>
              <TableCell>{new Date(ch.createdAt).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>
                <Link to={`/chapters/${ch._id}`}>
                  <Button size="sm" variant="outline">Chi tiết</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="justify-end mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
          </PaginationItem>
          <span className="mt-1 text-sm">Trang {page} / {totalPages}</span>
          <PaginationItem>
            <PaginationNext onClick={() => setPage(Math.min(totalPages, page + 1))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
