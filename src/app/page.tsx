'use client';

import Image from "next/image";
import Link from "next/link";
import { FaCamera } from "react-icons/fa";
import Layout from "./components/Layout";

export default function Home() {
  return (
    <Layout>
      {/* Main content */}
      <div>
        {/* Hero section */}
        <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Free Online Photo Booth
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              KacaKacaBooth offers a completely free online photo booth service. Take or upload photo strips, add filters, frames, and stickers, then download and share with just one click.
            </p>
            <Link 
              href="/photo"
              className="inline-flex items-center px-8 py-4 bg-pink-600 text-white font-medium text-lg rounded-lg hover:bg-pink-700 transition shadow-lg"
            >
              <FaCamera className="mr-2" />
              Start Photo Booth
            </Link>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white p-4 rounded-lg shadow-xl overflow-hidden">
              <Image 
                src="/photobooth-example.jpg" 
                alt="Photo Booth Example" 
                width={800} 
                height={600}
                className="w-full h-auto rounded-md" 
                priority
              />
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Photo Booth Web Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-pink-50 p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center text-white mb-4">
                  <FaCamera size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Photo Strip Creation</h3>
                <p className="text-gray-600">Use your webcam to take photo booth strips, or upload four photos from your device for a custom photo booth experience.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Filters & Frames</h3>
                <p className="text-gray-600">Enhance your free photo booth pictures with various filters and frames to make your photos more exciting and memorable.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">One-Click Download</h3>
                <p className="text-gray-600">Download your online photo booth creations with one click, ready to share with friends or save to your device instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Creating Your Free Photo Booth Strip Now</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">No registration required! Completely free to use! Create your personalized photo booth memories instantly.</p>
            <Link 
              href="/photo"
              className="inline-flex items-center px-8 py-4 bg-white text-pink-600 font-medium text-lg rounded-lg hover:bg-gray-100 transition shadow-lg"
            >
              <FaCamera className="mr-2" />
              Try Our Free Photo Booth
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
