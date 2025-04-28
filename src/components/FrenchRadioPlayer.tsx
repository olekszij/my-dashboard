"use client";
import React, { useState, useRef, useEffect } from "react";

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
    url: "https://cdn.nrjaudio.fm/adwz2/fr/30401/mp3_128.mp3?origine=fluxradios",
    description: "Humour & chansons"
  },
  {
    id: "nrj",
    name: "NRJ",
    url: "https://cdn.nrjaudio.fm/adwz2/fr/30001/mp3_128.mp3?origine=fluxradios",
    description: "Hits & Pop"
  },
  {
    id: "nostalgie",
    name: "Nostalgie",
    url: "https://cdn.nrjaudio.fm/adwz2/fr/30601/mp3_128.mp3?origine=fluxradios",
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
    url: "https://streaming.radio.rtl.fr/rtl-1-44-128",
    description: "Actualités, talk, musique"
  },
  {
    id: "rtl2",
    name: "RTL2",
    url: "https://streaming.radio.rtl2.fr/rtl2-1-44-128",
    description: "Le son pop-rock"
  },
  {
    id: "funradio",
    name: "Fun Radio",
    url: "https://icecast.rtl.fr/fun-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg",
    description: "Le son dancefloor"
  },
  {
    id: "fc",
    name: "France Culture",
    url: "https://direct.franceculture.fr/live/franceculture-hifi.aac",
    description: "Le meilleur de la musique"
  },
  {
    id: "skyrock",
    name: "Skyrock",
    url: "https://icecast.skyrock.net/s/natio_mp3_128k",
    description: "Rap, RnB, Hip-Hop"
  }
];

export default function FrenchRadioPlayer() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleError = () => {
        setError(`Error playing ${FRENCH_RADIO_STATIONS[current].name}. Please try another station.`);
        setIsPlaying(false);
        setIsLoading(false);
      };

      const handleLoadStart = () => {
        setIsLoading(true);
        setError(null);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
        setError(null);
      };

      audio.addEventListener('error', handleError);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);

      if (isPlaying) {
        audio.play().catch((err) => {
          console.error('Playback error:', err);
          handleError();
        });
      } else {
        audio.pause();
      }

      return () => {
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [isPlaying, current]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">French Radio Online</h1>
      
      {/* Current station */}
      <div className="mb-2 text-center">
        <div className="text-lg font-semibold text-blue-900">{FRENCH_RADIO_STATIONS[current].name}</div>
        <div className="text-xs text-gray-600">{FRENCH_RADIO_STATIONS[current].description}</div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Custom player */}
      <div className="mb-8 flex flex-col items-center justify-center">
        <audio
          ref={audioRef}
          key={FRENCH_RADIO_STATIONS[current].url}
          src={FRENCH_RADIO_STATIONS[current].url}
          crossOrigin="anonymous"
        />
        <div className="flex items-center justify-center w-full mt-6">
          <button
            onClick={handlePlayPause}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-colors shadow-lg focus:outline-none relative ${
              isLoading 
                ? 'bg-gray-400 cursor-wait' 
                : 'bg-black hover:bg-gray-800 text-white'
            }`}
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={isLoading}
            style={{ minWidth: 112, minHeight: 112 }}
          >
            {isLoading ? (
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <div className="flex items-center justify-center space-x-1">
                <div className="w-1 h-8 bg-white animate-[equalizer_1s_ease-in-out_infinite]"></div>
                <div className="w-1 h-8 bg-white animate-[equalizer_1.1s_ease-in-out_infinite]"></div>
                <div className="w-1 h-8 bg-white animate-[equalizer_1.2s_ease-in-out_infinite]"></div>
                <div className="w-1 h-8 bg-white animate-[equalizer_1.3s_ease-in-out_infinite]"></div>
                <div className="w-1 h-8 bg-white animate-[equalizer_1.4s_ease-in-out_infinite]"></div>
              </div>
            ) : (
              <svg className="w-16 h-16" fill="none" viewBox="0 0 48 48">
                <polygon points="14,10 40,24 14,38" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Station selection buttons */}
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