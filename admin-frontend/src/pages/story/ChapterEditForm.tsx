import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@radix-ui/themes";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useI18n } from "@/lib/i18n/i18n"; // Thêm import

export type Chapter = {
  _id?: string;
  chapterNumber: number;
  title: string;
  content: string;
  slug?: string;
};

export default function ChapterEditForm({
  chapter,
  onSave,
  onCancel,
  loading,
}: {
  chapter: Chapter;
  onSave: (data: Chapter) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const { t } = useI18n(); // Lấy hàm dịch
  const [editChapter, setEditChapter] = useState<Chapter>(chapter);
  const handleChange = (field: keyof Chapter, value: any) => {
    setEditChapter((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...editChapter });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 text-black">
      <label className="block mb-1 font-medium">
        {t("chapter.number")}
        <Input
          type="number"
          value={editChapter.chapterNumber}
          onChange={(e) => handleChange("chapterNumber", Number(e.target.value))}
          required
        />
      </label>
      <label className="block mb-1 font-medium">
        {t("chapter.title")}
        <Input
          value={editChapter.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </label>
      <div>
        <label className="block mb-1 font-medium">{t("chapter.content")}</label>
        <SimpleEditor content={editChapter.content} onChange={(newContent) => {
          setEditChapter((prev) => ({ ...prev, content: newContent }));
        }} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" loading={loading}>
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
}