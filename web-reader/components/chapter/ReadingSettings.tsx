import React from "react";

interface ReadingSettingsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  bgOptions: string[];
}

export const ReadingSettings: React.FC<ReadingSettingsProps> = ({
  fontSize,
  setFontSize,
  bgColor,
  setBgColor,
  brightness,
  setBrightness,
  bgOptions,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-white dark:bg-gray-900 shadow">
      <div>
        <label className="block mb-1 font-medium">Cỡ chữ</label>
        <input
          className="w-full"
          max={32}
          min={14}
          type="range"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
        <div className="text-sm mt-1">{fontSize}px</div>
      </div>
      <div>
        <label className="block mb-1 font-medium">Màu nền</label>
        <div className="flex gap-2 flex-wrap">
          {bgOptions.map((color) => (
            <button
              key={color}
              aria-label={`Chọn màu ${color}`}
              className={`w-8 h-8 rounded border-2 ${bgColor === color ? "border-primary-500" : "border-gray-200"}`}
              style={{ background: color }}
              onClick={() => setBgColor(color)}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">Độ sáng</label>
        <input
          className="w-full"
          max={100}
          min={60}
          type="range"
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
        />
        <div className="text-sm mt-1">{brightness}%</div>
      </div>
    </div>
  );
};
