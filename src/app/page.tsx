import React from 'react';
import FrenchRadioPlayer from '@/components/FrenchRadioPlayer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <FrenchRadioPlayer />
      </div>
    </main>
  );
}
