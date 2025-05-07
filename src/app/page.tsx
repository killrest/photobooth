'use client';

import Image from "next/image";
import Link from "next/link";
import { FaCamera, FaArrowRight, FaQuoteRight, FaStar } from "react-icons/fa";
import Layout from "./components/Layout";

export default function Home() {
  return (
    <Layout>
      {/* Main content */}
      <div>
        {/* Hero section - Pink tone style with vertical layout */}
        <section className="bg-gradient-to-b from-cream-50 to-cream-100 py-16">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-4">
                Yoyobooth | Free Online Photo Strip Creator
              </h1>
              <p className="text-base md:text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto">
                Turn your home into a free photobooth with exclusive templates, trendy filters, and fun stickers—beautiful results every time
              </p>
              
              <div className="flex flex-col items-center justify-center">
                <div className="mb-10 w-full max-w-2xl">
                  <Image 
                    src="/Headphoto.jpg" 
                    alt="KacaKacaBooth Online Photo Booth" 
                    width={1080} 
                    height={720}
                    className="w-full h-auto rounded-3xl shadow-xl" 
                    priority
                  />
                </div>
                
                <Link 
                  href="/photo"
                  className="flex items-center justify-center gap-2 px-10 py-5 bg-amber-600 text-white font-semibold text-lg rounded-full hover:bg-amber-700 transition shadow-lg w-64"
                >
                  <FaCamera className="mr-1" />
                  Start
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature highlights in pink style */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="flex flex-col md:flex-row gap-12 mb-16 items-center">
              <div className="md:w-1/2">
                <Image 
                  src="/photo1.jpg" 
                  alt="KacaKacaBooth Online Photo Booth" 
                  width={560} 
                  height={400}
                  className="w-full h-auto rounded-2xl object-cover" 
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Free At-Home Photo Booth Experience
                </h2>
                <p className="text-gray-600 mb-8">
                  No more waiting in line or rushing through public booths—our free online Photo Booth brings exclusive templates, trendy filters, and fun stickers right to your home. Snap unlimited strips at your own pace, and every shot looks amazing.
                </p>
                <Link 
                  href="/photo"
                  className="px-10 py-3 bg-amber-600 text-white font-semibold rounded-full hover:bg-amber-700 transition"
                >
                  Try Now
                </Link>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-12 mb-16 items-center">
              <div className="md:w-1/2">
                <Image 
                  src="/photo2.jpg" 
                  alt="KacaKacaBooth Online Photo Booth" 
                  width={560} 
                  height={400}
                  className="w-full h-auto rounded-2xl object-cover" 
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Exclusive Photo Booth Templates — Ultra-Innovative
                </h2>
                <p className="text-gray-600 mb-8">
                  Stand out with our library of one-of-a-kind Photo Booth templates that capture today's hottest trends. From retro film vibes to sleek modern layouts, discover fresh designs updated weekly for endless creative possibilities.
                </p>
                <Link 
                  href="/photo"
                  className="px-10 py-3 bg-amber-600 text-white font-semibold rounded-full hover:bg-amber-700 transition"
                >
                  Try Now
                </Link>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-12 mb-16 items-center">
              <div className="md:w-1/2">
                <Image 
                  src="/photo3.jpg" 
                  alt="KacaKacaBooth Online Photo Booth" 
                  width={560} 
                  height={400}
                  className="w-full h-auto rounded-2xl object-cover" 
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Premium Style Filters — High-Quality Aesthetics
                </h2>
                <p className="text-gray-600 mb-8">
                  Transform your photos with our versatile Photo Booth filters—from grainy noir to pastel dreams, edgy cinematic to soft glow. Switch between looks in a click and craft the perfect mood every time.
                </p>
                <Link 
                  href="/photo"
                  className="px-10 py-3 bg-amber-600 text-white font-semibold rounded-full hover:bg-amber-700 transition"
                >
                  Try Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How to use section - Moved to be between features and reviews */}
        {/* 
        <section className="py-16 bg-cream-50">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              How to Get?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-5 rounded-3xl border border-cream-200">
                <Image 
                  src="/photobooth-example.jpg" 
                  alt="Take 4 Pictures" 
                  width={400} 
                  height={300}
                  className="w-full h-auto rounded-2xl mb-5 border border-cream-100" 
                />
                <h3 className="text-xl font-medium text-amber-700 mb-2">Take 4 Pictures</h3>
                <p className="text-gray-700">
                  Choose a filter, then hit Start to capture four quick shots in a row—fast, fun, and completely free.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-3xl border border-cream-200">
                <Image 
                  src="/photobooth-example.jpg" 
                  alt="Apply Stickers and Frames" 
                  width={400} 
                  height={300}
                  className="w-full h-auto rounded-2xl mb-5 border border-cream-100" 
                />
                <h3 className="text-xl font-medium text-amber-700 mb-2">Enhance with  Filters & Frames</h3>
                <p className="text-gray-700">
                  After shooting, customize your strip by applying stylish filters and playful stickers—make every frame uniquely yours.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-3xl border border-cream-200">
                <Image 
                  src="/photobooth-example.jpg" 
                  alt="Download" 
                  width={400} 
                  height={300}
                  className="w-full h-auto rounded-2xl mb-5 border border-cream-100" 
                />
                <h3 className="text-xl font-medium text-amber-700 mb-2">Download & Share</h3>
                <p className="text-gray-700">
                  When you're happy with your design, click Download to save your Photo Booth strip. Instantly share on social media or with friends!
                </p>
              </div>
            </div>
          </div>
        </section>
        */}

        {/* User reviews section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              User Reviews
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-cream-50 p-8 rounded-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Lily T.</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 mr-1 text-lg" />
                      ))}
                    </div>
                  </div>
                  <div className="text-amber-500 text-3xl">
                    <FaQuoteRight />
                  </div>
                </div>
                <p className="text-gray-600">
                  "I love how this online Photo Booth lets me create perfect strips at home—totally free! The exclusive templates are so stylish, the filters add amazing vibes, and the stickers are just adorable. It feels like my own personal studio!"
                </p>
              </div>
              
              <div className="bg-cream-50 p-8 rounded-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Jason M.</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 mr-1 text-lg" />
                      ))}
                    </div>
                  </div>
                  <div className="text-amber-500 text-3xl">
                    <FaQuoteRight />
                  </div>
                </div>
                <p className="text-gray-600">
                  "My friends and I used to skip photo kiosks because of long lines and high costs. Now we jump online, pick from endless templates, switch up our look with cool filters, and top it off with fun stickers—all in seconds. Best Photo Booth ever!"
                </p>
              </div>
              
              <div className="bg-cream-50 p-8 rounded-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Emily S.</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 mr-1 text-lg" />
                      ))}
                    </div>
                  </div>
                  <div className="text-amber-500 text-3xl">
                    <FaQuoteRight />
                  </div>
                </div>
                <p className="text-gray-600">
                  "As someone who's camera-shy, I never thought I'd enjoy Photo Booths until I tried this. I can experiment with trendy templates, dial in the perfect filters, and add cute stickers—all from the comfort of my room. My strips look magazine-worthy!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 bg-cream-50">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              F&Q
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="border-b border-cream-200 py-5">
                <div className="flex justify-between items-center cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-800">What is our Online Photo Booth?</h3>
                </div>
                <p className="mt-3 text-gray-600">
                  Our free at-home Photo Booth brings the classic multi-cut strip experience right to your screen. Simply snap four quick photos in seconds and watch them transform into a stylish photo strip with our exclusive templates.
                </p>
              </div>
              
              <div className="border-b border-cream-200 py-5">
                <div className="flex justify-between items-center cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-800">How much does it cost?</h3>
                </div>
                <p className="mt-3 text-gray-600">
                  100% free—no hidden fees or subscriptions. Enjoy unlimited shots with our online Photo Booth, all from the comfort of home.
                </p>
              </div>
              
              <div className="border-b border-cream-200 py-5">
                <div className="flex justify-between items-center cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-800">Do I need to create an account?</h3>
                </div>
                <p className="mt-3 text-gray-600">
                  No sign-up required! Just visit the webpage, allow camera access, and start capturing your moments instantly.
                </p>
              </div>
              
              <div className="border-b border-cream-200 py-5">
                <div className="flex justify-between items-center cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-800">Can I customize my photo strips?</h3>
                </div>
                <p className="mt-3 text-gray-600">
                  Yes! After snapping, choose from a library of one-of-a-kind templates, apply high-quality style filters (grainy, vintage, pastel, cinematic, and more), and add playful stickers to make each strip uniquely yours.
                </p>
              </div>
              
              <div className="border-b border-cream-200 py-5">
                <div className="flex justify-between items-center cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-800">Which devices are supported?</h3>
                </div>
                <p className="mt-3 text-gray-600">
                  Our Photo Booth works on any camera-equipped device—desktop, laptop, tablet, or smartphone. Enjoy seamless performance and beautiful results wherever you are.
                </p>
              </div>
              
              <div className="border-b border-cream-200 py-5">
                <div className="flex justify-between items-center cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-800">Is the photo quality as good as offline booths?</h3>
                </div>
                <p className="mt-3 text-gray-600">
                  Absolutely—image quality depends on your device camera and internet stability. With today's webcams and smartphone cameras, you'll get crisp, vibrant strips that rival any photo kiosk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Snap Your Photo Booth Now
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Ready to capture your life moments and share your creations? Try KacaKacaBooth's online photo booth now! Take Life4Cuts photos, add vintage filters, and create unique photo strips.
            </p>
            <div className="flex justify-center">
              <Link 
                href="/photo"
                className="px-10 py-5 bg-amber-600 text-white font-semibold text-xl rounded-full hover:bg-amber-700 transition"
              >
                Try Now
              </Link>
            </div>
            </div>
        </section>
      </div>
    </Layout>
  );
}
