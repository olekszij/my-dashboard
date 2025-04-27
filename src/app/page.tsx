"use client";
import FrenchRadioPlayer from "./components/FrenchRadioPlayer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">French Radio Online</h1>
          <p className="text-gray-600">Écoutez les meilleures stations de radio françaises en direct</p>
        </div>
        <FrenchRadioPlayer />
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Profitez de la musique, des actualités et de la culture française en direct</p>
        </div>
      </div>
    </div>
  );
}
