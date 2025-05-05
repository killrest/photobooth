'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DonateButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/donate"
      className={`flex items-center justify-center px-5 py-3 rounded-full transition-all duration-300 ${
        isHovered 
          ? 'bg-amber-600 text-white shadow-lg translate-y-[-2px]' 
          : 'bg-amber-500 text-white shadow-md'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="mr-2 text-lg font-semibold flex items-center">
        ☕️
        <span className="ml-2">Support Us</span>
      </span>
    </Link>
  );
} 