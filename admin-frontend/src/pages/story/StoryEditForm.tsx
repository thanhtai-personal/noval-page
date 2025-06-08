import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/i18n";
import { Button } from "@radix-ui/themes";
import {
  PlusIcon,
  UploadIcon,
  CheckIcon,
  Cross2Icon,
} from "@/components/ui/RadixIcons";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SimpleEditor as TiptapSimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function StoryEditForm({
  story,
  allCategories,
  allSources,
  onChange,
  onSave,
  onCancel,
}: any) {
  const { t } = useI18n();
  const [editStory, setEditStory] = useState<any>({ ...story });
  const [tagInput, setTagInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageSize = 10; // số chương mỗi trang

  useEffect(() => {
    setEditStory({ ...story });
  }, [story]);

  const handleEditChange = (field: string, value: any) => {
    setEditStory((prev: any) => {
      const updated = { ...prev, [field]: value };
      onChange && onChange(updated);
      return updated;
    });
  };

  const handleTagAdd = () => {
    if (
      tagInput.trim() &&
      !(editStory?.tags || []).some((t: any) => t.name === tagInput.trim())
    ) {
      handleEditChange("tags", [
        ...(editStory?.tags || []),
        { name: tagInput.trim() },
      ]);
      setTagInput("");
    }
  };

  const handleTagRemove = (name: string) => {
    handleEditChange(
      "tags",
      (editStory?.tags || []).filter((t: any) => t.name !== name)
    );
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: upload file lên server, lấy url và cập nhật editStory.cover
    // handleEditChange('cover', url);
  };

  // Giả sử editStory.chapters là mảng các chương
  const sortedChapters = (editStory?.chapters || [])
    .slice()
    .sort((a: any, b: any) => b.chapterNumber - a.chapterNumber);

  const totalPages = Math.ceil(sortedChapters.length / pageSize);
  const pagedChapters = sortedChapters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <div className="flex w-full justify-end gap-2 mb-4">
        <Button color="green" onClick={() => onSave && onSave(editStory)}>
          <CheckIcon />
        </Button>
        <Button color="gray" onClick={() => onCancel && onCancel()}>
          <Cross2Icon />
        </Button>
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col items-center">
          <img
            src={editStory?.cover || "/placeholder.jpg"}
            alt={editStory?.title}
            className="w-40 h-60 rounded border object-cover"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleCoverUpload}
          />
          <Button
            size="1"
            className="mt-2 px-3 py-1 text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon />
          </Button>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <Input
            className="text-2xl font-bold"
            value={editStory?.title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleEditChange("title", e.target.value)
            }
            placeholder={t("story.title")}
          />
          <div className="text-sm text-muted-foreground">
            <strong>{t("story.author")}:</strong>{" "}
            {editStory?.author?.name || t("story.unknown")}
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>{t("story.source")}:</strong>{" "}
            <Input
              className="border rounded px-2 py-1"
              value={editStory?.source || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEditChange("source", e.target.value)}
            />
            <datalist id="source-list">
              {allSources.map((s: any) => (
                <option key={s._id} value={s.name} />
              ))}
            </datalist>
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>{t("story.categories")}:</strong>{" "}
            <Select
              value={editStory?.categories?.[0]?._id || ""}
              onValueChange={(value: string) =>
                handleEditChange(
                  "categories",
                  value === ""
                    ? []
                    : [allCategories.find((c: any) => c._id === value)]
                )
              }
            >
              <option value="">{t("story.choose_category")}</option>
              {allCategories.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>{t("story.tags")}:</strong>{" "}
            <div className="flex flex-wrap gap-1">
              {(editStory?.tags || []).map((t: any) => (
                <Badge
                  key={t.name}
                  variant="secondary"
                  className="mr-1 flex items-center gap-1"
                >
                  {t.name}
                  <Button
                    color="red"
                    size="1"
                    variant="ghost"
                    className="ml-1 text-xs"
                    onClick={() => handleTagRemove(t.name)}
                  >
                    ×
                  </Button>
                </Badge>
              ))}
              <Input
                className="text-xs w-24 flex items-center gap-2"
                value={tagInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTagInput(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") handleTagAdd();
                }}
                placeholder={t("story.add_tag")}
              />
              <Button
                size="1"
                className="px-2 py-0.5 text-xs"
                onClick={handleTagAdd}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>
              📖 <strong>{editStory?.totalChapters || 0}</strong> {t("story.chapters")}
            </span>
            <span>
              👁️ {editStory?.views || 0} {t("story.views")}
            </span>
            <span>
              👍 {editStory?.likes || 0} {t("story.likes")}
            </span>
            <span>
              ⭐ {editStory?.recommends || 0} {t("story.recommends")}
            </span>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("story.intro")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TiptapSimpleEditor content={story.intro} onChange={() => {}} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("story.description")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TiptapSimpleEditor content={story.description} onChange={() => {}} />
        </CardContent>
      </Card>
    </>
  );
}
