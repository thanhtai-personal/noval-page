import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
  forwardRef,
  useImperativeHandle,
} from "react";

export type SoundTrack = {
  id: string;
  url: string;
  title?: string;
  artist?: string;
  cover?: string;
};

export type SoundManagerAPI = {
  play: (index?: number) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  seek: (sec: number) => void;
  isPlaying: boolean;
  current: SoundTrack | null;
  list: SoundTrack[];
  currentIndex: number;
  audio: HTMLAudioElement | null;
};

const SoundManagerContext = createContext<SoundManagerAPI | null>(null);

export function useSoundManager() {
  const ctx = useContext(SoundManagerContext);
  if (!ctx) throw new Error("useSoundManager must be used within SoundManagerProvider");
  return ctx;
}

type Props = {
  list: SoundTrack[];
  children: ReactNode;
  autoPlay?: boolean;
  initialIndex?: number;
};

export const SoundManagerProvider = forwardRef<SoundManagerAPI, Props>(
  (
    {
      list,
      children,
      autoPlay = false,
      initialIndex = 0,
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [current, setCurrent] = useState<SoundTrack | null>(list[initialIndex] || null);

    // Mảng chứa tất cả audio preload
    const audioArrRef = useRef<HTMLAudioElement[]>([]);

    // Preload lại khi list đổi
    useEffect(() => {
      audioArrRef.current.forEach(a => {
        a.pause();
        a.src = "";
      });
      audioArrRef.current = list.map(track => {
        const audio = new Audio(track.url);
        audio.preload = "auto";
        audio.load();
        return audio;
      });
      setCurrent(list[initialIndex] || null);
      setCurrentIndex(initialIndex);
      setIsPlaying(autoPlay);

      // fix sound was not play as first time load
      play();
      stop();
    }, [list, initialIndex, autoPlay]);

    // Xử lý play/pause theo state
    useEffect(() => {
      audioArrRef.current.forEach((audio, idx) => {
        audio.pause();
        audio.currentTime = 0;
        audio.onended = null;
      });

      const audio = audioArrRef.current[currentIndex];
      if (!audio) return;

      audio.onended = () => next();

      setCurrent(list[currentIndex] || null);

      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
      // eslint-disable-next-line
    }, [currentIndex, isPlaying, list]);

    function play(idx?: number) {
      if (typeof idx === "number") {
        setCurrentIndex(idx);
        setIsPlaying(true);
      } else {
        setIsPlaying(true);
      }
    }
    function pause() {
      setIsPlaying(false);
    }
    function stop() {
      setIsPlaying(false);
      const audio = audioArrRef.current[currentIndex];
      if (audio) audio.currentTime = 0;
    }
    function next() {
      setCurrentIndex((prev) => (prev + 1) % list.length);
      setIsPlaying(true);
    }
    function prev() {
      setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
      setIsPlaying(true);
    }
    function seek(sec: number) {
      const audio = audioArrRef.current[currentIndex];
      if (audio) audio.currentTime = sec;
    }

    useImperativeHandle(ref, () => ({
      play,
      pause,
      stop,
      next,
      prev,
      seek,
      isPlaying,
      current,
      list,
      currentIndex,
      audio: audioArrRef.current[currentIndex] || null,
    }));

    const value: SoundManagerAPI = {
      play, pause, stop, next, prev, seek,
      isPlaying,
      current,
      list,
      currentIndex,
      audio: audioArrRef.current[currentIndex] || null,
    };

    // Không cần <audio /> nữa!
    return (
      <SoundManagerContext.Provider value={value}>
        {children}
      </SoundManagerContext.Provider>
    );
  }
);

SoundManagerProvider.displayName = "SoundManagerProvider";
