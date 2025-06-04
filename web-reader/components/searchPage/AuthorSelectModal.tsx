import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

import { ApiInstant } from "@/utils/api";

interface AuthorSelectModalProps {
  open: boolean;
  onClose: () => void;
  selectedAuthors: any[];
  setSelectedAuthors: (authors: any[]) => void;
}

export function AuthorSelectModal({
  open,
  onClose,
  selectedAuthors,
  setSelectedAuthors,
}: AuthorSelectModalProps) {
  const t = useTranslations("search");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [authors, setAuthors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    ApiInstant.get("/authors", {
      params: {
        keyword: search,
        page,
        limit: pageSize,
      },
    })
      .then((res) => {
        setAuthors(res.data?.data || []);
        setTotal(res.data?.total || 0);
      })
      .finally(() => setLoading(false));
  }, [search, page, pageSize, open]);

  const totalPages = Math.ceil(total / pageSize);

  const toggleSelect = (author: any) => {
    if (selectedAuthors.some((a) => a._id === author._id)) {
      setSelectedAuthors(selectedAuthors.filter((a) => a._id !== author._id));
    } else {
      setSelectedAuthors([...selectedAuthors, author]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose} onTouchEnd={onClose}>
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">{t("choose_author")}</h2>
        <form className="mb-4 flex gap-2" onSubmit={handleSearch}>
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder={t("author") + "..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button size="sm" type="submit">
            {t("search")}
          </Button>
        </form>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 min-h-[180px]">
          {loading ? (
            <div className="col-span-3 text-center py-8">{t("search")}...</div>
          ) : authors.length === 0 ? (
            <div className="col-span-3 text-center py-8">{t("no_result")}</div>
          ) : (
            authors.map((author) => (
              <div
                key={author._id}
                className={`border rounded p-2 flex items-center gap-2 cursor-pointer ${selectedAuthors.some((a) => a._id === author._id) ? "border-primary-500 bg-primary-50" : "hover:border-primary-300"}`}
                onClick={() => toggleSelect(author)}
                onTouchEnd={() => toggleSelect(author)}
              >
                <input
                  readOnly
                  checked={selectedAuthors.some((a) => a._id === author._id)}
                  type="checkbox"
                />
                <span className="truncate">{author.name}</span>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          <Button
            disabled={page <= 1}
            size="sm"
            onClick={() => setPage(page - 1)}
            onTouchEnd={() => setPage(page - 1)}
          >
            {t("prev_page")}
          </Button>
          <span>
            Trang {page} / {totalPages || 1}
          </span>
          <Button
            disabled={page >= totalPages}
            size="sm"
            onClick={() => setPage(page + 1)}
            onTouchEnd={() => setPage(page + 1)}
          >
            {t("next_page")}
          </Button>
        </div>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="light" onClick={onClose} onTouchEnd={onClose}>
            {t("cancel")}
          </Button>
          <Button size="sm" onClick={onClose} onTouchEnd={onClose}>
            {t("selected", { count: selectedAuthors.length })}
          </Button>
        </div>
      </div>
    </div>
  );
}
