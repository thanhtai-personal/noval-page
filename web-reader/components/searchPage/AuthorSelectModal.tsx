"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
} from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@heroui/checkbox";

import { ApiInstant } from "@/utils/api";

interface AuthorSelectModalProps {
  open: boolean;
  onClose: () => void;
  selectedAuthors: any[];
  setSelectedAuthors: (authors: any[]) => void;
}

const fetchAuthors = async ({
  keyword,
  page,
  pageSize,
}: {
  keyword: string;
  page: number;
  pageSize: number;
}) => {
  const res = await ApiInstant.get("/authors", {
    params: {
      keyword,
      page,
      limit: pageSize,
    },
  });

  return res.data as { data: any[]; total: number };
};

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

  // React Query fetch
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["authors", search, page, pageSize, open],
    queryFn: () => fetchAuthors({ keyword: search, page, pageSize }),
    enabled: open, // chỉ fetch khi modal mở
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });

  const authors = data?.data || [];
  const total = data?.total || 0;
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
    // useQuery sẽ tự động fetch lại khi search thay đổi
  };

  return (
    <Modal isOpen={open} size="5xl" onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <span className="text-lg font-bold">{t("choose_author")}</span>
        </ModalHeader>
        <ModalBody>
          <form className="mb-4 flex gap-2" onSubmit={handleSearch}>
            <Input
              className="w-full"
              placeholder={t("author") + "..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button size="sm" type="submit">
              {t("search")}
            </Button>
          </form>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 min-h-[180px]">
            {isLoading ? (
              <div className="col-span-3 flex justify-center items-center py-8">
                <Spinner className="mr-2" size="md" />
                {t("search")}...
              </div>
            ) : isError ? (
              <div className="col-span-3 text-center py-8 text-red-500">
                {t("no_result")}
              </div>
            ) : authors.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                {t("no_result")}
              </div>
            ) : (
              authors.map((author: any, index: number) =>
                author.name ? (
                  <div
                    key={author._id || index}
                    className={`flex justify-start gap-4 items-center cursor-pointer p-0 m-0 transition`}
                    onClick={() => toggleSelect(author)}
                    onTouchEnd={() => toggleSelect(author)}
                  >
                    <Checkbox
                      key={author._id}
                      checked={
                        !!selectedAuthors.find((a) => a._id === author._id)
                      }
                      value={author.slug}
                    >
                      {author.name}
                    </Checkbox>
                  </div>
                ) : (
                  <div key={index} />
                ),
              )
            )}
          </div>
          <div className="flex justify-between items-center mb-4">
            <Button
              disabled={page <= 1}
              size="sm"
              variant="bordered"
              onClick={() => setPage(page - 1)}
              onTouchEnd={() => setPage(page - 1)}
            >
              {t("prev_page")}
            </Button>
            <span>
              {t("page")} {page} / {totalPages || 1}
            </span>
            <Button
              disabled={page >= totalPages}
              size="sm"
              variant="bordered"
              onClick={() => setPage(page + 1)}
              onTouchEnd={() => setPage(page + 1)}
            >
              {t("next_page")}
            </Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            onTouchEnd={onClose}
          >
            {t("cancel")}
          </Button>
          <Button size="sm" onClick={onClose} onTouchEnd={onClose}>
            {t("selected", { count: selectedAuthors.length })}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
