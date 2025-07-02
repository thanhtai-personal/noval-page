import { useSoundManager } from "./context/SoundManagerProvider";

export function SoundMiniPlayer() {
  const { current, isPlaying, play, pause, next, prev, currentIndex } = useSoundManager();
  if (!current) return null;
  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-gray-300 rounded">
      <span className="text-xs">{current.title}</span>
      <button onClick={prev}>⏮️</button>
      {isPlaying
        ? <button onClick={pause}>⏸️</button>
        : <button onClick={() => play(currentIndex)}>▶️</button>
      }
      <button onClick={next}>⏭️</button>
    </div>
  );
}
