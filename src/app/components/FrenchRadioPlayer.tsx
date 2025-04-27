"use client";
import { useState, useRef, useEffect } from "react";

interface RadioStation {
  id: string;
  name: string;
  url: string;
  description: string;
}

const FRENCH_RADIO_STATIONS: RadioStation[] = [
  {
    id: "rireetchansons",
    name: "Rire & Chansons",
    url: "http://cdn.nrjaudio.fm/adwz2/fr/30401/mp3_128.mp3?origine=fluxradios",
    description: "Humour & chansons"
  },
  {
    id: "nrj",
    name: "NRJ",
    url: "http://cdn.nrjaudio.fm/adwz2/fr/30001/mp3_128.mp3?origine=fluxradios",
    description: "Hits & Pop"
  },
  {
    id: "nostalgie",
    name: "Nostalgie",
    url: "http://cdn.nrjaudio.fm/adwz2/fr/30601/mp3_128.mp3?origine=fluxradios",
    description: "Chansons françaises et internationales"
  },
  {
    id: "cheriefm",
    name: "Chérie FM",
    url: "https://scdn.nrjaudio.fm/adwz2/fr/30201/mp3_128.mp3?origine=fluxradios",
    description: "Pop Love Music"
  },
  {
    id: "rtl",
    name: "RTL",
    url: "http://streaming.radio.rtl.fr/rtl-1-44-128",
    description: "Actualités, talk, musique"
  },
  {
    id: "rtl2",
    name: "RTL2",
    url: "http://streaming.radio.rtl2.fr/rtl2-1-44-128",
    description: "Le son pop-rock"
  },
  {
    id: "funradio",
    name: "Fun Radio",
    url: "http://icecast.rtl.fr/fun-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg",
    description: "Le son dancefloor"
  },
  {
    id: "fc",
    name: "France Culture",
    url: "http://direct.franceculture.fr/live/franceculture-hifi.aac",
    description: "Le meilleur de la musique"
  },

  {
    id: "skyrock",
    name: "Skyrock",
    url: "http://icecast.skyrock.net/s/natio_mp3_128k",
    description: "Rap, RnB, Hip-Hop"
  }
];

export default function FrenchRadioPlayer() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, current]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">French Radio Online</h1>
      {/* Текущая станция */}
      <div className="mb-2 text-center">
        <div className="text-lg font-semibold text-blue-900">{FRENCH_RADIO_STATIONS[current].name}</div>
        <div className="text-xs text-gray-600">{FRENCH_RADIO_STATIONS[current].description}</div>
      </div>
      {/* Кастомный плеер */}
      <div className="mb-8 flex flex-col items-center justify-center">
        <audio
          ref={audioRef}
          key={FRENCH_RADIO_STATIONS[current].url}
          src={FRENCH_RADIO_STATIONS[current].url}
          autoPlay
          onError={() =>
            alert(
              'Ошибка воспроизведения. Попробуйте открыть поток в VLC или другом приложении.'
            )
          }
        />
        <div className="flex items-center justify-center w-full mt-6">
          <button
            onClick={handlePlayPause}
            className="w-28 h-28 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg focus:outline-none"
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{ minWidth: 112, minHeight: 112 }}
          >
            {isPlaying ? (
              <svg className="w-16 h-16" fill="none" viewBox="0 0 48 48">
                <rect x="12" y="10" width="8" height="28" rx="2" fill="white" />
                <rect x="28" y="10" width="8" height="28" rx="2" fill="white" />
              </svg>
            ) : (
              <svg className="w-16 h-16" fill="none" viewBox="0 0 48 48">
                <polygon points="14,10 40,24 14,38" fill="white" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Кнопки выбора станции */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {FRENCH_RADIO_STATIONS.map((station, i) => (
          <button
            key={station.id}
            onClick={() => { setCurrent(i); setIsPlaying(true); }}
            className={`p-4 rounded-lg border transition-all text-left font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              current === i
                ? "bg-blue-100 border-blue-500 text-blue-900"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900"
            }`}
            aria-current={current === i}
          >
            <div className="font-bold text-lg text-black mb-1">{station.name}</div>
            <div className="text-xs text-gray-600">{station.description}</div>
          </button>
        ))}
      </div>
      
    </div>
  );
} 