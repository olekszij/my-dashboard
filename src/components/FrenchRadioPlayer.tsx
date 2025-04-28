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
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-lg focus:outline-none ${
                isLoading 
                  ? 'bg-gray-400 cursor-wait' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              aria-label={isPlaying ? "Pause" : "Play"}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <div className="flex items-center justify-center space-x-0.5">
                  <div className="w-1 h-8 bg-white animate-[equalizer_1s_ease-in-out_infinite]"></div>
                  <div className="w-1 h-6 bg-white animate-[equalizer_1.2s_ease-in-out_infinite]"></div>
                  <div className="w-1 h-4 bg-white animate-[equalizer_0.8s_ease-in-out_infinite]"></div>
                  <div className="w-1 h-6 bg-white animate-[equalizer_1.4s_ease-in-out_infinite]"></div>
                  <div className="w-1 h-8 bg-white animate-[equalizer_1s_ease-in-out_infinite]"></div>
                </div>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <div>
              <div className="font-semibold text-gray-900">{FRENCH_RADIO_STATIONS[current].name}</div>
              <div className="text-sm text-gray-500">{FRENCH_RADIO_STATIONS[current].description}</div>
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