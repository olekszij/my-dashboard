"use client";
import React, { useState, useRef, useEffect } from "react";

interface RadioStation {
  id: string;
  name: string;
  urls: string[]; // Multiple URLs as fallbacks
  description: string;
}

const FRENCH_RADIO_STATIONS: RadioStation[] = [
  {
    id: "rireetchansons",
    name: "Rire & Chansons",
    urls: [
      "https://scdn.nrjaudio.fm/adwz2/fr/30401/mp3_128.mp3?origine=fluxradios",
      "http://cdn.nrjaudio.fm/adwz2/fr/30401/mp3_128.mp3?origine=fluxradios"
    ],
    description: "Humour & chansons"
  },
  {
    id: "nrj",
    name: "NRJ",
    urls: [
      "https://scdn.nrjaudio.fm/adwz2/fr/30001/mp3_128.mp3?origine=fluxradios",
      "http://cdn.nrjaudio.fm/adwz2/fr/30001/mp3_128.mp3?origine=fluxradios"
    ],
    description: "Hits & Pop"
  },
  {
    id: "nostalgie",
    name: "Nostalgie",
    urls: [
      "https://scdn.nrjaudio.fm/adwz2/fr/30601/mp3_128.mp3?origine=fluxradios",
      "http://cdn.nrjaudio.fm/adwz2/fr/30601/mp3_128.mp3?origine=fluxradios"
    ],
    description: "Chansons françaises et internationales"
  },
  {
    id: "cheriefm",
    name: "Chérie FM",
    urls: [
      "https://scdn.nrjaudio.fm/adwz2/fr/30201/mp3_128.mp3?origine=fluxradios",
      "http://cdn.nrjaudio.fm/adwz2/fr/30201/mp3_128.mp3?origine=fluxradios"
    ],
    description: "Pop Love Music"
  },
  {
    id: "rtl",
    name: "RTL",
    urls: [
      "http://icecast.rtl.fr/rtl-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg",
      "http://streaming.radio.rtl.fr/rtl-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg",
      "http://streaming.radio.rtl.fr:80/rtl-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg"
    ],
    description: "Actualités, talk, musique"
  },
  {
    id: "rtl2",
    name: "RTL2",
    urls: [
      "http://icecast.rtl2.fr/rtl2-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg",
      "http://icecast.rtl.fr/rtl2-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg",
      "http://streaming.radio.rtl2.fr/rtl2-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg",
      "http://streaming.radio.rtl2.fr:80/rtl2-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg"
    ],
    description: "Le son pop-rock"
  },
  {
    id: "funradio",
    name: "Fun Radio",
    urls: [
      "http://icecast.funradio.fr/fun-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg",
      "http://icecast.rtl.fr/fun-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg",
      "http://streaming.radio.funradio.fr/fun-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg",
      "http://streaming.radio.funradio.fr:80/fun-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg"
    ],
    description: "Le son dancefloor"
  },
  {
    id: "fc",
    name: "France Culture",
    urls: [
      "http://icecast.radiofrance.fr/franceculture-hifi.aac",
      "http://direct.franceculture.fr/live/franceculture-hifi.aac",
      "http://icecast.radiofrance.fr/franceculture-midfi.mp3",
      "http://direct.franceculture.fr/live/franceculture-midfi.mp3"
    ],
    description: "Le meilleur de la musique"
  },
  {
    id: "skyrock",
    name: "Skyrock",
    urls: [
      "https://icecast.skyrock.net/s/natio_mp3_128k",
      "http://icecast.skyrock.net/s/natio_mp3_128k"
    ],
    description: "Rap, RnB, Hip-Hop"
  },
  {
    id: "radioclassique",
    name: "Radio Classique",
    urls: [
      "http://radioclassique.ice.infomaniak.ch/radioclassique-high.mp3",
      "http://broadcast.infomaniak.ch/radioclassique-high.mp3",
      "http://statslive.infomaniak.ch/playlist/radioclassique/radioclassique-high.mp3/playlist.m3u"
    ],
    description: "Musique classique"
  },
  {
    id: "europe2",
    name: "Europe 2",
    urls: [
      "http://europe2.lmn.fm/europe2.mp3",
      "http://europe2.lmn.fm/europe2.aac"
    ],
    description: "Hits & Pop"
  },
  {
    id: "franceinter",
    name: "France Inter",
    urls: [
      "http://icecast.radiofrance.fr/franceinter-hifi.aac",
      "http://direct.franceinter.fr/live/franceinter-hifi.aac",
      "http://icecast.radiofrance.fr/franceinter-midfi.mp3",
      "http://direct.franceinter.fr/live/franceinter-midfi.mp3"
    ],
    description: "Actualités, talk, musique"
  },
  {
    id: "ouifm",
    name: "Ouï FM",
    urls: [
      "http://ouifm.ice.infomaniak.ch/ouifm-high.mp3",
      "http://broadcast.infomaniak.net/ouifm-high.mp3",
      "http://broadcast.infomaniak.ch/ouifm-high.mp3",
      "http://statslive.infomaniak.ch/playlist/ouifm/ouifm-high.mp3/playlist.m3u"
    ],
    description: "Rock & Indé"
  }
];

export default function FrenchRadioPlayer() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleError = () => {
        // Try next URL if available
        if (currentUrlIndex < FRENCH_RADIO_STATIONS[current].urls.length - 1) {
          setCurrentUrlIndex(prev => prev + 1);
          setError(`Trying alternative stream for ${FRENCH_RADIO_STATIONS[current].name}...`);
        } else {
          setError(`Unable to play ${FRENCH_RADIO_STATIONS[current].name}. Please try another station.`);
          setIsPlaying(false);
          setIsLoading(false);
        }
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
  }, [isPlaying, current, currentUrlIndex]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleStationChange = (index: number) => {
    setCurrent(index);
    setCurrentUrlIndex(0);
    setIsPlaying(true);
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
          key={FRENCH_RADIO_STATIONS[current].urls[currentUrlIndex]}
          src={FRENCH_RADIO_STATIONS[current].urls[currentUrlIndex]}
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
            onClick={() => handleStationChange(i)}
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