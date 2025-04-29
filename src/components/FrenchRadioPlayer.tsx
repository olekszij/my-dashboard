"use client";
import React, { useState, useRef, useEffect } from "react";

interface RadioStation {
  id: string;
  name: string;
  urls: string[]; // Multiple URLs as fallbacks
  description: string;
  previewImage: string;
}

const FRENCH_RADIO_STATIONS: RadioStation[] = [
  {
    id: "rireetchansons",
    name: "Rire & Chansons",
    urls: [
      "https://scdn.nrjaudio.fm/adwz2/fr/30401/mp3_128.mp3?origine=fluxradios",
      "http://cdn.nrjaudio.fm/adwz2/fr/30401/mp3_128.mp3?origine=fluxradios",
      "https://stream.fluxradios.fr/rireetchansons.mp3"
    ],
    description: "Humour & chansons",
    previewImage: "/images/radio/rireetchansons.png"
  },
  {
    id: "nrj",
    name: "NRJ",
    urls: [
      "https://scdn.nrjaudio.fm/adwz2/fr/30001/mp3_128.mp3?origine=fluxradios",
      "http://cdn.nrjaudio.fm/adwz2/fr/30001/mp3_128.mp3?origine=fluxradios",
      "https://stream.fluxradios.fr/nrj.mp3"
    ],
    description: "Hits & Pop",
    previewImage: "/images/radio/nrj.png"
  },
  {
    id: "nostalgie",
    name: "Nostalgie",
    urls: [
      "https://scdn.nrjaudio.fm/adwz2/fr/30601/mp3_128.mp3?origine=fluxradios",
      "http://cdn.nrjaudio.fm/adwz2/fr/30601/mp3_128.mp3?origine=fluxradios",
      "https://stream.fluxradios.fr/nostalgie.mp3"
    ],
    description: "Chansons françaises et internationales",
    previewImage: "/images/radio/nostalgie.png"
  },
  {
    id: "cheriefm",
    name: "Chérie FM",
    urls: [
      "https://scdn.nrjaudio.fm/adwz2/fr/30201/mp3_128.mp3?origine=fluxradios",
      "http://cdn.nrjaudio.fm/adwz2/fr/30201/mp3_128.mp3?origine=fluxradios",
      "https://stream.fluxradios.fr/cheriefm.mp3"
    ],
    description: "Pop Love Music",
    previewImage: "/images/radio/cheriefm.png"
  },
  {
    id: "franceculture",  // Изменено с "fc" на "franceculture"
    name: "France Culture",
    urls: [
      "http://icecast.radiofrance.fr/franceculture-hifi.aac",
      "http://direct.franceculture.fr/live/franceculture-hifi.aac",
      "http://icecast.radiofrance.fr/franceculture-midfi.mp3",
      "http://direct.franceculture.fr/live/franceculture-midfi.mp3"
    ],
    description: "Le meilleur de la musique",
    previewImage: "/images/radio/franceculture.png"
  },
  {
    id: "skyrock",
    name: "Skyrock",
    urls: [
      "https://icecast.skyrock.net/s/natio_mp3_128k",
      "http://icecast.skyrock.net/s/natio_mp3_128k",
      "https://stream.fluxradios.fr/skyrock.mp3"
    ],
    description: "Rap, RnB, Hip-Hop",
    previewImage: "/images/radio/skyrock.png"
  },
  {
    id: "radioclassique",
    name: "Radio Classique",
    urls: [
      "http://radioclassique.ice.infomaniak.ch/radioclassique-high.mp3",
      "http://broadcast.infomaniak.ch/radioclassique-high.mp3",
      "https://stream.fluxradios.fr/radioclassique.mp3"
    ],
    description: "Musique classique",
    previewImage: "/images/radio/radioclassique.png"
  },
  {
    id: "europe2",
    name: "Europe 2",
    urls: [
      "http://europe2.lmn.fm/europe2.mp3",
      "http://europe2.lmn.fm/europe2.aac",
      "https://stream.fluxradios.fr/europe2.mp3"
    ],
    description: "Hits & Pop",
    previewImage: "/images/radio/europe2.png"
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
    description: "Actualités, talk, musique",
    previewImage: "/images/radio/franceinter.png"
  },
  {
    id: "ouifm",
    name: "Ouï FM",
    urls: [
      "http://ouifm.ice.infomaniak.ch/ouifm-high.mp3",
      "http://broadcast.infomaniak.net/ouifm-high.mp3",
      "http://broadcast.infomaniak.ch/ouifm-high.mp3",
      "https://stream.fluxradios.fr/ouifm.mp3"
    ],
    description: "Rock & Indé",
    previewImage: "/images/radio/ouifm.png"
  },

  {
    id: "mouv",
    name: "Mouv'",
    urls: [
      "http://icecast.radiofrance.fr/mouv-hifi.aac",
      "http://direct.mouv.fr/live/mouv-hifi.aac",
      "http://icecast.radiofrance.fr/mouv-midfi.mp3",
      "http://direct.mouv.fr/live/mouv-midfi.mp3"
    ],
    description: "Urban Music & Hip-Hop",
    previewImage: "/images/radio/mouv.png"
  }
];

// Add this function before the FrenchRadioPlayer component
const getStationLogo = (stationId: string): string => {
  const availableLogos = [
    'cheriefm',
    'europe2',
    'franceculture',
    'franceinter',
    'mouv',
    'nostalgie',
    'nrj',
    'ouifm',
    'radio',
    'radioclassique',
    'rireetchansons',
    'rtl',
    'skyrock'
  ];

  return availableLogos.includes(stationId)
    ? `/images/radio/${stationId}.png`
    : '/images/radio/radio.png';
};

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
    <>
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg mb-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">French Radio Online</h1>

        {/* Station selection buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FRENCH_RADIO_STATIONS.map((station, index) => (
            <div
              key={station.id}
              className={`p-4 rounded-lg shadow-md transition-all duration-200 ${current === index
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-white hover:bg-gray-50"
                }`}
              onClick={() => handleStationChange(index)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={getStationLogo(station.id)}
                  alt={station.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/radio/radio.png';
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{station.name}</h3>
                  <p className="text-sm text-gray-700">{station.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>

      {/* Fixed bottom player bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className={`w-14 h-14 flex items-center justify-center transition-colors focus:outline-none ${isLoading
                ? 'text-gray-400 cursor-wait'
                : 'text-gray-900 hover:text-gray-700'
                }`}
              aria-label={isPlaying ? "Pause" : "Play"}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <div className="flex items-center justify-center space-x-0.5 bg-white rounded-full w-10 h-10 shadow-sm">
                  <div className="w-1 h-8 bg-black animate-[equalizer_1s_ease-in-out_infinite]"></div>
                  <div className="w-1 h-6 bg-black animate-[equalizer_1.2s_ease-in-out_infinite]"></div>
                  <div className="w-1 h-4 bg-black animate-[equalizer_0.8s_ease-in-out_infinite]"></div>
                  <div className="w-1 h-6 bg-black animate-[equalizer_1.4s_ease-in-out_infinite]"></div>
                  <div className="w-1 h-8 bg-black animate-[equalizer_1s_ease-in-out_infinite]"></div>
                </div>
              ) : (
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <div className="flex items-center space-x-3">
              <div>
                <div className="font-semibold text-gray-900">{FRENCH_RADIO_STATIONS[current].name}</div>
                <div className="text-sm text-gray-700">{FRENCH_RADIO_STATIONS[current].description}</div>
              </div>
              <img
                src={getStationLogo(FRENCH_RADIO_STATIONS[current].id)}
                alt={FRENCH_RADIO_STATIONS[current].name}
                className="w-12 h-12 rounded-full object-cover shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/radio/radio.png';
                }}
              />
            </div>
          </div>
          <audio
            ref={audioRef}
            key={FRENCH_RADIO_STATIONS[current].urls[currentUrlIndex]}
            src={FRENCH_RADIO_STATIONS[current].urls[currentUrlIndex]}
            crossOrigin="anonymous"
          />
        </div>
      </div>
    </>
  );
}

// Add keyframe animation for equalizer
const styles = `
@keyframes equalizer {
  0% { height: 32px; }
  50% { height: 16px; }
  100% { height: 32px; }
}
`;

// Add styles to head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}