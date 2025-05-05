'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DonateButton from './DonateButton';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cream-50 to-cream-100">
      {/* Navigation bar */}
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/icon.jpg"
              alt="PhotoBooth Logo" 
              width={40}
              height={40}
              className="rounded-md"
            />
          <h1 className="text-2xl font-bold text-amber-700">Yoyobooth</h1>
          </Link>
          <nav className="flex items-center">
            <ul className="flex space-x-6 items-center">
              <li><Link href="/" className="text-gray-800 hover:text-amber-700 transition">Home</Link></li>
              <li><Link href="/photo" className="text-gray-800 hover:text-amber-700 transition">Start Photo Booth</Link></li>
              <li><DonateButton /></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-amber-600 text-white py-8">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <Image
                  src="/icon.jpg"
                  alt="PhotoBooth Logo" 
                  width={30}
                  height={30}
                  className="rounded-md"
                />
              <h3 className="text-xl font-bold mb-2">Free PhotoBooth</h3>
              </div>
              <p className="text-gray-200">Free Online Photo Booth Service</p>
            </div>
            <div>
              <p className="text-gray-200">&copy; {new Date().getFullYear()} Free PhotoBooth. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 