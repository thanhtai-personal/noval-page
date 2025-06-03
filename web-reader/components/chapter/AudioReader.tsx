import React from "react";
import { useTranslations, useLocale } from "next-intl";

interface AudioReaderProps {
  chapter: any;
  rate: number;
  setRate: (r: number) => void;
  rateOptions: number[];
}

export const AudioReader: React.FC<AudioReaderProps> = ({
  chapter,
  rate,
  setRate,
  rateOptions,
}) => {
  const t = useTranslations("chapter");
  const locale = useLocale();
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const [currentChar, setCurrentChar] = React.useState(0);

  const getChapterText = () => chapter?.content || "";

  const startReading = (text: string, startChar: number = 0) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(
        text.slice(startChar),
      );

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
        if (typeof event.charIndex === "number" && text.length > 0) {
          setCurrentChar(startChar + event.charIndex);
          setProgress(
            Math.min(
              100,
              Math.round(((startChar + event.charIndex) / text.length) * 100),
            ),
          );
        }
      };
      window.speechSynthesis.speak(utterance);
      utteranceRef.current = utterance;
      setIsSpeaking(true);
      setIsPaused(false);
      setProgress(Math.round((startChar / text.length) * 100));
    }
  };

  const pauseReading = () => {
    if (typeof window !== "undefined" && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(true);
    }
  };
  const resumeReading = () => {
    if (typeof window !== "undefined" && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    }
  };
  const stopReading = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setProgress(0);
      setCurrentChar(0);
    }
  };
  const seekAudio = (percent: number) => {
    if (!chapter?.content) return;
    const text = chapter.content;
    const charIndex = Math.floor((percent / 100) * text.length);

    stopReading();
    setTimeout(() => {
      startReading(text, charIndex);
    }, 100);
  };

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

  React.useEffect(() => {
    if (!isSpeaking || isPaused) return;
    if (
      chapter?.content &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      stopReading();
      setTimeout(() => {
        startReading(chapter.content, currentChar);
      }, 100);
    }
  }, [rate]);

  return (
    <div className="mb-2 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-row gap-1 w-full items-center">
        <div className="flex gap-2 items-center mb-2">
          {!isSpeaking ? (
            <button
              aria-label={t("read_audio")}
              className="p-1 rounded bg-primary-600 text-white font-medium shadow hover:bg-primary-700 transition flex items-center justify-center"
              type="button"
              onClick={() => startReading(getChapterText())}
            >
              <svg
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  aria-label={t("resume_audio")}
                  className="p-1 rounded bg-primary-600 text-white font-medium shadow hover:bg-primary-700 transition flex items-center justify-center"
                  type="button"
                  onClick={resumeReading}
                >
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  aria-label={t("pause_audio")}
                  className="px-3 py-1 rounded bg-primary-600 text-white font-medium shadow hover:bg-primary-700 transition flex items-center justify-center"
                  type="button"
                  onClick={pauseReading}
                >
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2 w-full">
          <input
            className="flex-1 accent-primary-500"
            max={100}
            min={0}
            type="range"
            value={progress}
            onChange={(e) => seekAudio(Number(e.target.value))}
          />
          <div className="text-xs text-right text-gray-500 min-w-[40px]">
            {progress}%
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium min-w-[80px]">
            {t("audio_speed")}
          </label>
          <div className="relative flex-1 flex items-center">
            <div className="w-full h-2 bg-gray-200 rounded-full relative">
              <div
                className="absolute top-0 left-0 h-2 bg-primary-500 rounded-full transition-all"
                style={{
                  width: `${(rateOptions.indexOf(rate) / (rateOptions.length - 1)) * 100}%`,
                }}
              />
              {rateOptions.map((opt, idx) => (
                <button
                  key={opt}
                  aria-label={opt.toFixed(1) + "x"}
                  className={`absolute top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full border-2 transition-all ${rate === opt ? "bg-primary-500 border-primary-600" : "bg-white border-gray-400"}`}
                  style={{
                    left: `${(idx / (rateOptions.length - 1)) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  type="button"
                  onClick={() => setRate(opt)}
                >
                  <span className="sr-only">{opt.toFixed(1)}x</span>
                </button>
              ))}
            </div>
            <span className="ml-3 text-xs w-10 text-right">
              {rate.toFixed(1)}x
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
