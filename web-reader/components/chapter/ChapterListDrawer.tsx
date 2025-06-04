import React from "react";

interface ChapterListDrawerProps {
  open: boolean;
  onClose: () => void;
  chapters: Array<{ _id: string; title: string; index: number }>;
  currentChapterId?: string;
  onSelectChapter: (chapterId: string) => void;
}

export const ChapterListDrawer: React.FC<ChapterListDrawerProps> = ({
  open,
  onClose,
  chapters,
  currentChapterId,
  onSelectChapter,
}) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg z-50 transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700 ${open ? "translate-x-0" : "translate-x-full"}`}
      style={{ display: "none" }} // Hide by default, will show on desktop only
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Danh sách chương</h2>
        <button
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          onClick={onClose}
          onTouchEnd={onClose}
        >
          ✕
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-56px)] p-4">
        <ul>
          {chapters.map((chapter) => (
            <li
              key={chapter._id}
              className={`py-2 px-3 rounded cursor-pointer mb-1 ${chapter._id === currentChapterId ? "bg-primary-100 dark:bg-primary-800 font-bold" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              onClick={() => onSelectChapter(chapter._id)}
              onTouchEnd={() => onSelectChapter(chapter._id)}
            >
              {chapter.index + 1}. {chapter.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
