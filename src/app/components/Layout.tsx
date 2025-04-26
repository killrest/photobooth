'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-purple-100">
      {/* Navigation bar */}
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">KacaKacaBooth</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-gray-800 hover:text-pink-600 transition">Home</Link></li>
              <li><Link href="/photo" className="text-gray-800 hover:text-pink-600 transition">Start Photo Booth</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">KacaKacaBooth</h3>
              <p className="text-gray-400">Free Online Photo Booth Service</p>
            </div>
            <div>
              <p className="text-gray-400">&copy; {new Date().getFullYear()} KacaKacaBooth. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 