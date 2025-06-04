import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/i18n";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import StoryEditForm from "./StoryEditForm";
import StoryDetailView from "./StoryDetailView";

export default function StoryDetailPage() {
  const { id } = useParams();
  const { t } = useI18n();
  const [story, setStory] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editStory, setEditStory] = useState<any>(null);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allSources, setAllSources] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStoryData() {
      try {
        const [storyRes] = await Promise.all([api.get(`/stories/${id}`)]);
        setStory(storyRes.data);
      } finally {
        setLoading(false);
      }
    }

    fetchStoryData();
  }, [id]);

  useEffect(() => {
    if (!story) return;
    async function fetChapters() {
      try {
        const [chaptersRes] = await Promise.all([
          api.get(`/stories/${story.slug}/chapters`, {
            params: {
              limit: 100,
              sort: "+chapterNumber",
            },
          }),
        ]);
        setChapters(chaptersRes.data.data || []);
      } finally {
        setLoading(false);
      }
    }

    fetChapters();
  }, [story]);

  useEffect(() => {
    if (editMode) {
      // Lấy danh sách category và source khi vào edit mode
      api
        .get("/categories")
        .then((res) => setAllCategories(res.data.data || []));
      api.get("/sources").then((res) => setAllSources(res.data.data || []));
      setEditStory({ ...story });
    }
  }, [editMode, story]);

  const handleEditStoryChange = (updated: any) => setEditStory(updated);
  const handleEditSave = (data: any) => {
    // TODO: Gửi API cập nhật truyện
    setEditMode(false);
    setStory(data);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-96 w-full rounded" />
      </div>
    );
  }

  if (!story) {
    return <p className="p-6 text-red-500">❌ Không tìm thấy truyện</p>;
  }

  return (
    <div className="p-6 max-w-4xl space-y-6 relative">
      {!editMode && (
        <div className="absolute top-2 right-6 flex gap-2 z-10">
          <button
            className="px-3 py-1 rounded bg-primary text-white text-sm flex items-center gap-1 shadow-md"
            onClick={() => setEditMode((v) => !v)}
            title={t("story.edit")}
            type="button"
          >
            <Pencil2Icon className="w-4 h-4" />
            {t("story.edit")}
          </button>
        </div>
      )}
      {editMode ? (
        <StoryEditForm
          story={editStory || story}
          allCategories={allCategories}
          allSources={allSources}
          onChange={handleEditStoryChange}
          onSave={handleEditSave}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <StoryDetailView story={story} chapters={chapters} />
      )}
    </div>
  );
}
