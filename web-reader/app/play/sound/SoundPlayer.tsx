import { useSoundManager } from "./context/SoundManagerProvider";

export function SoundPlayerUI() {
  const { current, isPlaying, play, pause, stop, next, prev, currentIndex } =
    useSoundManager();
  if (!current) return null;
  return (
    <div className="flex gap-2 items-center p-3 bg-gray-200 rounded shadow">
      <img
        src={current.cover}
        alt=""
        width={48}
        height={48}
        style={{ borderRadius: 8 }}
      />
      <div>
        <div className="font-bold">{current.title}</div>
        <div className="text-xs">{current.artist}</div>
        <div className="flex gap-2 mt-1">
          <button onClick={prev}>⏮️</button>
          {isPlaying ? (
            <button onClick={pause}>⏸️</button>
          ) : (
            <button onClick={() => play(currentIndex)}>▶️</button>
          )}
          <button onClick={stop}>⏹️</button>
          <button onClick={next}>⏭️</button>
        </div>
      </div>
    </div>
  );
}
