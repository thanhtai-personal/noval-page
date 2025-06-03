import React from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Modal,
  ModalContent,
} from "@heroui/modal";
import { AudioReader } from "./AudioReader";

export interface ReadingSettingsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  color: string;
  setColor: (color: string) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  bgOptions: string[];
  colorOptions: string[];
  chapter?: any;
}

export const ReadingSettings: React.FC<ReadingSettingsProps> = ({
  fontSize,
  setFontSize,
  bgColor,
  setBgColor,
  color,
  setColor,
  brightness,
  setBrightness,
  bgOptions,
  colorOptions,
  chapter
}) => {
  const t = useTranslations("chapter");
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0-100
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const [currentChar, setCurrentChar] = React.useState(0);
  const [rate, setRate] = React.useState(() => 1);
  const rateOptions = [0.5, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.5];

  const getChapterText = () => {
    return chapter.content;
  };

  // Start reading
  const startReading = (text: string, startChar: number = 0) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text.slice(startChar));
      utterance.lang = locale === "vi" ? "vi-VN" : "en-US";
      utterance.rate = rate;
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setProgress(100);
        setCurrentChar(0);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onboundary = (event: any) => {
        if (typeof event.charIndex === 'number' && text.length > 0) {
          setCurrentChar(startChar + event.charIndex);
          setProgress(Math.min(100, Math.round(((startChar + event.charIndex) / text.length) * 100)));
        }
      };
      window.speechSynthesis.speak(utterance);
      utteranceRef.current = utterance;
      setIsSpeaking(true);
      setIsPaused(false);
      setProgress(Math.round((startChar / text.length) * 100));
    }
  };
  // Pause
  const pauseReading = () => {
    if (typeof window !== "undefined" && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(true);
    }
  };
  // Resume
  const resumeReading = () => {
    if (typeof window !== "undefined" && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    }
  };
  // Stop
  const stopReading = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setProgress(0);
      setCurrentChar(0);
    }
  };

  // Seek to position in audio
  const seekAudio = (percent: number) => {
    if (!chapter?.content) return;
    const text = chapter.content;
    const charIndex = Math.floor((percent / 100) * text.length);
    stopReading();
    setTimeout(() => {
      startReading(text, charIndex);
    }, 100);
  };

  // Auto-stop audio on refresh or navigation
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-pause and resume audio at new speed when rate changes
  React.useEffect(() => {
    if (!isSpeaking || isPaused) return;
    if (chapter?.content && typeof window !== "undefined" && "speechSynthesis" in window) {
      stopReading();
      setTimeout(() => {
        startReading(chapter.content, currentChar);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  return (
    <>
      <div className="relative w-full">
        <div
          className="cursor:pointer absolute right-0 px-4 py-2 rounded bg-black text-white font-medium shadow hover:bg-primary-600 transition"
          onClick={() => setOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </div>
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalContent className="p-0 bg-transparent shadow-none">
          <div className="p-6 bg-white dark:bg-gray-900 rounded shadow max-w-md w-full mx-auto">
            <div className="flex flex-col gap-4">
              {/* Config controls */}
              <div>
                <label className="block mb-1 font-medium">
                  {t("font_size")}
                </label>
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
                <label className="block mb-1 font-medium">
                  {t("bg_color")}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {bgOptions.map((bg) => (
                    <button
                      key={bg}
                      aria-label={t("choose_bg_color", { color: bg })}
                      className={`w-8 h-8 rounded border-2 ${bgColor === bg ? "border-primary-500" : "border-gray-200"}`}
                      style={{ background: bg }}
                      onClick={() => setBgColor(bg)}
                      type="button"
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  {t("text_color")}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      aria-label={t("choose_text_color", { color: c })}
                      className={`w-8 h-8 rounded border-2 ${color === c ? "border-primary-500" : "border-gray-200"}`}
                      style={{ background: c }}
                      onClick={() => setColor(c)}
                      type="button"
                    >
                      <span
                        className="block w-full h-full rounded"
                        style={{ background: c }}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {t("auto_text_color")}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  {t("brightness")}
                </label>
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
              {/* Audio reading controls at the bottom */}
              <AudioReader chapter={chapter} rate={rate} setRate={setRate} rateOptions={rateOptions} />
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
