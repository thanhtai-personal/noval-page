import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/lib/i18n/i18n";
import { Button, Link } from "@radix-ui/themes";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import ChapterEditForm, { Chapter } from "./ChapterEditForm";

export default function StoryDetailView({
  story,
  chapters,
}: {
  story: any;
  chapters: any[];
}) {
  const { t } = useI18n();

  // Paging state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sort chapters by chapterNumber descending
  const sortedChapters = [...chapters].sort(
    (a, b) => b.chapterNumber - a.chapterNumber
  );
  const totalPages = Math.ceil(sortedChapters.length / pageSize);
  const pagedChapters = sortedChapters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  const handleEditChapter = (chapter: Chapter) => setEditingChapter(chapter);
  const handleCloseDrawer = () => setEditingChapter(null);

  const handleSaveChapter = async (_data: Chapter) => {
    // TODO: Gọi API cập nhật chương ở đây
    // await updateChapter(data);
    handleCloseDrawer();
    // Có thể reload lại danh sách chương nếu cần
  };

  return (
    <>
      <div className="flex gap-6">
        <img
          src={story.cover || "/placeholder.jpg"}
          alt={story.title}
          className="w-40 h-60 rounded border object-cover"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{story.title}</h1>
          <div className="text-sm text-muted-foreground">
            <strong>{t("story.author")}:</strong>{" "}
            {story.author?.name || t("story.unknown")}
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>{t("story.source")}:</strong>{" "}
            {story.url ? (
              <Link
                href={story.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {story.source}
              </Link>
            ) : (
              story.source || t("story.unknown")
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>{t("story.categories")}:</strong>{" "}
            {(story.categories || []).map((c: any) => (
              <Badge key={c._id} variant="outline" className="mr-1">
                {c.name}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>{t("story.tags")}:</strong>{" "}
            {(story.tags || []).map((t: any) => (
              <Badge key={t._id} variant="secondary" className="mr-1">
                {t.name}
              </Badge>
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>
              📖 <strong>{story.totalChapters || 0}</strong>{" "}
              {t("story.chapters")}
            </span>
            <span>
              👁️ {story.views || 0} {t("story.views")}
            </span>
            <span>
              👍 {story.likes || 0} {t("story.likes")}
            </span>
            <span>
              ⭐ {story.recommends || 0} {t("story.recommends")}
            </span>
          </div>
        </div>
      </div>
      {story.intro && (
        <Card>
          <CardHeader>
            <CardTitle>{t("story.intro")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {story.intro}
            </p>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>{t("story.description")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  story.description ||
                  `<i>${t("story.default_description")}</i>`,
              }}
            />
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>📚 {t("story.latest_chapters")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {pagedChapters.map((ch) => (
              <div key={ch._id} className="relative">
                <Link
                  href={`/reader/${story.slug}/${ch.chapterNumber}`}
                  className="block text-sm hover:text-blue-600 hover:underline"
                >
                  <Card className="p-3 h-full">
                    <p className="font-medium">
                      {t("story.chapter")} {ch.chapterNumber}
                    </p>
                    <p className="text-muted-foreground">{ch.title}</p>
                  </Card>
                </Link>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="1"
                    color="yellow"
                    className="px-2 py-1 text-xs rounded text-white flex items-center justify-center"
                    title={t("story.edit")}
                    onClick={() => handleEditChapter(ch)}
                  >
                    <Pencil2Icon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="1"
                    color="red"
                    className="px-2 py-1 text-xs rounded text-white flex items-center justify-center"
                    title={t("story.delete")}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {/* Drawer for editing chapter */}
          <Drawer open={!!editingChapter} onOpenChange={(open) => { if (!open) handleCloseDrawer(); }}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{t("user.add_title")}</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                {editingChapter && (
                  <ChapterEditForm
                    chapter={editingChapter}
                    onSave={handleSaveChapter}
                    onCancel={handleCloseDrawer}
                  />
                )}
              </div>
            </DrawerContent>
          </Drawer>
          {/* Paging controls */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <Pagination className="justify-end mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  />
                </PaginationItem>
                <span className="mt-1 text-sm">
                  Trang {currentPage} / {totalPages}
                </span>
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
