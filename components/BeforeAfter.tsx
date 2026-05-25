'use client';

import Image from 'next/image';
import { useState } from 'react';

interface BeforeAfterProps {
  before: string;
  after: string;
}

export default function BeforeAfter({ before, after }: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div
      className="relative w-full max-w-2xl h-96 bg-black rounded-lg overflow-hidden cursor-col-resize select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After image — full background */}
      <Image src={after} alt="After staging" fill className="object-cover" />

      {/* Before image — clipped overlay */}
      <div
        className="absolute left-0 top-0 h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <Image src={before} alt="Before staging" fill className="object-cover" />
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
        Before
      </div>
      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
        After
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 h-full w-0.5 bg-gold"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-gold text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
            ↔
          </div>
        </div>
      </div>
    </div>
  );
}
