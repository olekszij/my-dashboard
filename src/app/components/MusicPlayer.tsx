"use client";

import { useRef, useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";

interface Track {
  url: string;
  name: string;
  artist?: string;
  cover?: string;
  duration?: number;
}

// Используем кастомную картинку из public
const PLACEHOLDER = "/music.jpg";
const STORAGE_KEY = "music-player-playlist";

export default function MusicPlayer() {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  // Save playlist to localStorage (only file names, not blobs)
  useEffect(() => {
    if (playlist.length > 0) {
      const meta = playlist.map(({ name }) => name);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
    }
  }, [playlist]);

  useEffect(() => {
    return () => {
      playlist.forEach(track => URL.revokeObjectURL(track.url));
    };
  }, [playlist]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => setProgress(audio.currentTime);
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, [current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const setDur = () => setDuration(audio.duration || 0);
    audio.addEventListener("loadedmetadata", setDur);
    return () => audio.removeEventListener("loadedmetadata", setDur);
  }, [current]);

  // Свайп вверх/вниз для открытия/закрытия плейлиста (fix infinite loop + null cleanup)
  useEffect(() => {
    const el = playlistRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      if (deltaY < -40 && !playlistOpen) {
        setPlaylistOpen(true);
      } else if (deltaY > 40 && playlistOpen) {
        setPlaylistOpen(false);
      }
    };

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [playlistOpen]); // Only depend on playlistOpen state

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const tracks: Track[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("audio/")) continue;
      tracks.push({
        url: URL.createObjectURL(file),
        name: file.name,
        artist: undefined,
        cover: undefined,
        duration: undefined,
      });
    }
    if (tracks.length > 0) {
      setPlaylist(tracks);
      setCurrent(0);
      setIsPlaying(false);
      setError(null);
      setProgress(0);
      setDuration(tracks[0].duration || 0);
      audioRef.current?.pause();
      audioRef.current?.load();
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleEnded = () => {
    if (current < playlist.length - 1) {
      setCurrent(current + 1);
      setTimeout(() => audioRef.current?.play(), 100);
    } else {
      setIsPlaying(false);
    }
  };

  const playTrack = (idx: number) => {
    setCurrent(idx);
    setTimeout(() => {
      audioRef.current?.load();
      audioRef.current?.play();
      setError(null);
      setProgress(0);
      setDuration(playlist[idx]?.duration || 0);
    }, 100);
  };

  const handleAudioError = () => {
    setError("Файл не поддерживается этим браузером или повреждён.");
    setIsPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setProgress(val);
    }
  };

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <section
      className="w-full h-full flex flex-col"
      style={{
        minHeight: '100vh',
        maxHeight: '100vh',
        background: '#fff',
        borderRadius: 24,
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <header className="w-full py-6 flex items-center justify-center border-b border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Music Player</h1>
      </header>
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center w-full pb-20" style={{ padding: 'clamp(12px,4vw,32px)', minHeight: 0 }}>
        {/* Кнопка выбора файлов и эквалайзер */}
        <div className="flex flex-row items-center justify-center w-full mb-4 gap-4">
          <label className="inline-block cursor-pointer">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300 transition-colors text-2xl">
              <PlusOutlined />
            </span>
            <input
              type="file"
              accept="audio/*"
              multiple
              // @ts-expect-error: webkitdirectory is a non-standard attribute for folder selection in Chromium browsers
              webkitdirectory="true"
              onChange={e => handleFiles(e.target.files)}
              className="hidden"
            />
          </label>
          {/* Эквалайзер: 21 тонкая полоска, темно-серые цвета */}
          <span className="flex-1 flex items-center h-12">
            <svg width="100%" height="40" viewBox="0 0 210 40" className="w-full h-10" aria-hidden="true" preserveAspectRatio="none">
              {Array.from({ length: 21 }).map((_, i) => {
                const color = i % 2 === 0 ? '#222' : '#444';
                const x = 5 + i * 10;
                const base = 8 + (i % 7) * 3;
                const animDur = (0.7 + (i % 5) * 0.13).toFixed(2) + 's';
                if (!isPlaying) {
                  return <rect key={i} x={x} y={20} width={3} height={0} rx={1.5} fill={color} opacity={0} />;
                }
                return (
                  <rect key={i} x={x} y={40-base} width={3} height={base} rx={1.5} fill={color} opacity={1}>
                    <animate attributeName="height" values={`${base};32;8;${base}`} dur={animDur} repeatCount="indefinite"/>
                    <animate attributeName="y" values={`${40-base};8;32;${40-base}`} dur={animDur} repeatCount="indefinite"/>
                  </rect>
                );
              })}
            </svg>
          </span>
        </div>
        {/* Заглушка плеера, если нет треков */}
        {playlist.length === 0 && (
          <>
            <div className="w-full flex flex-col items-center gap-4 p-0 m-0">
              <img
                src={PLACEHOLDER}
                alt="No cover"
                style={{
                  width: '100%',
                  display: 'block',
                  aspectRatio: '1/1',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  margin: 0,
                  padding: 0,
                  opacity: 0.7,
                }}
              />
              <span className="text-lg sm:text-2xl font-bold text-gray-400 text-center truncate w-full">
                No track selected
              </span>
              <span className="text-base text-gray-300 text-center w-full">—</span>
            </div>
            {/* Неактивный прогресс-бар */}
            <div className="w-full flex flex-col gap-2 items-center">
              <div className="flex items-center w-full gap-2">
                <span className="text-xs text-gray-300 w-10 sm:w-12 text-right">0:00</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={0}
                  disabled
                  className="flex-1 accent-gray-200 h-2 rounded-lg bg-gray-100 cursor-not-allowed"
                />
                <span className="text-xs text-gray-300 w-10 sm:w-12 text-left">0:00</span>
              </div>
            </div>
            {/* Плейлист пустой */}
            <div className="w-full flex-1 min-h-0 overflow-y-auto mt-4">
              <ul className="flex flex-col gap-2 h-full">
                <li className="text-center text-gray-300 py-4">Playlist is empty</li>
              </ul>
            </div>
          </>
        )}
        {/* Обычный плеер, если есть треки */}
        {playlist.length > 0 && (
          <>
            <div className="w-full flex flex-col items-center gap-4 p-0 m-0">
              <img
                src={playlist[current]?.cover || PLACEHOLDER}
                alt="cover"
                style={{
                  width: '100%',
                  display: 'block',
                  aspectRatio: '1/1',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  margin: 0,
                  padding: 0,
                }}
              />
              <span className="text-lg sm:text-2xl font-bold text-gray-900 text-center truncate w-full">
                {playlist[current]?.name.replace(/\.[^.]+$/, "")}
              </span>
              {playlist[current]?.artist && (
                <span className="text-base text-gray-500 text-center w-full">{playlist[current]?.artist}</span>
              )}
            </div>
            <audio
              ref={audioRef}
              src={playlist[current]?.url}
              onEnded={handleEnded}
              onError={handleAudioError}
              className="hidden"
              controls={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            {error && (
              <div className="text-red-400 text-xs text-center w-full bg-red-50 rounded p-2">
                {error}
              </div>
            )}
            <div className="w-full flex flex-col gap-2 items-center">
              <div className="flex items-center w-full gap-2">
                <span className="text-xs text-gray-500 w-10 sm:w-12 text-right">{formatTime(progress)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={progress}
                  onChange={handleSeek}
                  className="flex-1 accent-purple-500 h-2 rounded-lg bg-gray-200"
                />
                <span className="text-xs text-gray-500 w-10 sm:w-12 text-left">{formatTime(duration)}</span>
              </div>
            </div>
            {/* Плейлист: свайп/скролл вверх-вниз для показа/скрытия */}
            <div
              ref={playlistRef}
              className={`w-full flex-1 min-h-0 transition-all duration-500 ${
                playlistOpen 
                  ? 'max-h-[calc(100vh-400px)] opacity-100' 
                  : 'max-h-0 opacity-0 pointer-events-none'
              }`}
              style={{ 
                overflowY: playlistOpen ? 'auto' : 'hidden',
                marginBottom: playlistOpen ? '1rem' : '0'
              }}
            >
              <ul className="flex flex-col gap-2 h-full">
                {playlist.map((track, idx) => (
                  <li
                    key={track.url}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all select-none
                      ${idx === current ? "bg-gray-200 shadow font-bold text-gray-900" : "bg-gray-50 hover:bg-gray-200 text-gray-700"}`}
                    onClick={() => playTrack(idx)}
                  >
                    <img
                      src={track.cover || PLACEHOLDER}
                      alt="cover"
                      className="w-10 h-10 rounded object-cover border border-gray-200 bg-gray-100"
                    />
                    <span className="truncate text-base">{track.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Кнопка для ручного открытия/закрытия плейлиста */}
            <button
              className="mx-auto mt-2 mb-2 block text-xs text-gray-400 hover:text-gray-700 transition"
              onClick={() => setPlaylistOpen(v => !v)}
              aria-label={playlistOpen ? 'Hide playlist' : 'Show playlist'}
            >
              {playlistOpen ? 'Hide playlist ▲' : 'Show playlist ▼'}
            </button>
          </>
        )}
      </main>
      {/* Bottom Bar: тёмно-серые кнопки */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 flex items-center justify-center py-3 gap-8 sm:gap-16 shadow-lg md:static md:shadow-none md:border-0 md:bg-transparent">
        <button
          onClick={() => playTrack(Math.max(current - 1, 0))}
          disabled={current === 0}
          className="p-3 sm:p-4 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition disabled:opacity-40"
          aria-label="Previous"
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M15.5 19 8.5 12l7-7" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button
          onClick={handlePlayPause}
          className="p-5 sm:p-6 rounded-full bg-gray-800 text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><rect x="6.5" y="5.5" width="3" height="13" rx="1.5" fill="#fff"/><rect x="14.5" y="5.5" width="3" height="13" rx="1.5" fill="#fff"/></svg>
          ) : (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M7 5v14l11-7z" fill="#fff"/></svg>
          )}
        </button>
        <button
          onClick={() => playTrack(Math.min(current + 1, playlist.length - 1))}
          disabled={current === playlist.length - 1}
          className="p-3 sm:p-4 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition disabled:opacity-40"
          aria-label="Next"
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M8.5 5l7 7-7 7" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </nav>
      {/* Footer */}
      <footer className="w-full py-4 flex items-center justify-center border-t border-gray-100 text-xs text-gray-400 md:static md:bg-transparent">
        &copy; {new Date().getFullYear()} My Music Player
      </footer>
    </section>
  );
} 