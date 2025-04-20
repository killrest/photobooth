'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaDownload, FaRedoAlt } from 'react-icons/fa';
import { usePhotoContext } from '../context/PhotoContext';
import { toPng } from 'html-to-image';
import Layout from '../components/Layout';

// Frame color options
const frameColors = [
  { id: 'rainbow', color: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)', name: 'Rainbow' },
  { id: 'white', color: '#FFFFFF', name: 'White' },
  { id: 'black', color: '#000000', name: 'Black' },
  { id: 'lightPink', color: '#FFC0CB', name: 'Light Pink' },
  { id: 'pink', color: '#FF69B4', name: 'Pink' },
  { id: 'lightBlue', color: '#ADD8E6', name: 'Light Blue' },
  { id: 'purple', color: '#800080', name: 'Purple' },
  { id: 'violet', color: '#EE82EE', name: 'Violet' },
  { id: 'yellow', color: '#FFFF00', name: 'Yellow' },
  { id: 'lightYellow', color: '#FFFACD', name: 'Light Yellow' },
  { id: 'green', color: '#008000', name: 'Green' },
  { id: 'gray', color: '#808080', name: 'Gray' },
  { id: 'brown', color: '#654321', name: 'Brown' },
  { id: 'navy', color: '#000080', name: 'Navy Blue' },
  { id: 'maroon', color: '#800000', name: 'Maroon' },
  { id: 'none', color: 'transparent', name: 'No Frame' },
];

// Built-in sticker SVG data
const stickers = [
  { id: 'none', name: 'No Stickers', icon: '∅' },
  { id: 'heart', name: 'Heart', icon: '❤️' },
  { id: 'star', name: 'Star', icon: '⭐' },
  { id: 'rainbow', name: 'Rainbow', icon: '🌈' },
  { id: 'sparkle', name: 'Sparkle', icon: '✨' },
  { id: 'butterfly', name: 'Butterfly', icon: '🦋' },
  { id: 'cat', name: 'Cat', icon: '🐱' },
  { id: 'dog', name: 'Dog', icon: '🐶' },
  { id: 'flower', name: 'Flower', icon: '🌸' },
  { id: 'heart_eyes', name: 'Heart Eyes', icon: '😍' },
  { id: 'sunglasses', name: 'Sunglasses', icon: '😎' },
  { id: 'crown', name: 'Crown', icon: '👑' },
  { id: 'fire', name: 'Fire', icon: '🔥' },
  { id: 'balloon', name: 'Balloon', icon: '🎈' },
  { id: 'camera', name: 'Camera', icon: '📷' },
  { id: 'lips', name: 'Lips', icon: '💋' },
  { id: 'unicorn', name: 'Unicorn', icon: '🦄' },
  { id: 'cloud', name: 'Cloud', icon: '☁️' },
];

const ResultPage = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { photoData } = usePhotoContext();
  const [selectedColor, setSelectedColor] = useState('lightBlue');
  const [selectedStickers, setSelectedStickers] = useState<{id: string, x: number, y: number}[]>([]);
  const photoGridRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [draggedSticker, setDraggedSticker] = useState<{id: string, x: number, y: number} | null>(null);

  // Check if photos exist, redirect to photo page if not
  useEffect(() => {
    if (!photoData || !photoData.photos || photoData.photos.length !== 4) {
      router.push('/photo');
    }
  }, [photoData, router]);

  // Select frame color
  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
  };

  // Add sticker
  const handleAddSticker = (stickerId: string) => {
    if (stickerId === 'none') return;
    
    // Add sticker to the center of canvas
    const newSticker = {
      id: stickerId,
      x: 50, // Center position, percentage
      y: 50,
    };
    
    setSelectedStickers([...selectedStickers, newSticker]);
  };

  // Download photo
  const handleDownload = async () => {
    if (photoGridRef.current) {
      try {
        const dataUrl = await toPng(photoGridRef.current, { 
          cacheBust: true,
          quality: 0.95,
          backgroundColor: '#ffffff'
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = `free-photobooth-strip-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Failed to export photo:', error);
        alert('Failed to export photo. Please try again!');
      }
    }
  };

  // Retake photos
  const handleRetake = () => {
    router.push('/photo');
  };

  // Get current frame color
  const getBorderColor = () => {
    const colorOption = frameColors.find(c => c.id === selectedColor);
    if (!colorOption) return 'none';
    return colorOption.color === 'transparent' ? 'none' : colorOption.id === 'rainbow' 
      ? `5px solid transparent; background-image: ${colorOption.color}; background-origin: border-box; background-clip: padding-box, border-box;` 
      : `5px solid ${colorOption.color}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-4">
          <Link href="/" className="flex items-center text-gray-700 hover:text-pink-600 transition text-sm">
            <FaArrowLeft className="mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">Free Online Photo Booth - Create & Customize Your Photo Strip</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side photo display */}
            <div className="md:w-2/5 flex flex-col items-center justify-start">
              <div 
                ref={photoGridRef}
                className="relative bg-white p-2 rounded-md w-full max-w-[280px]"
                style={{ border: getBorderColor() }}
              >
                <div className="grid grid-cols-1 gap-1">
                  {photoData && photoData.photos && photoData.photos.map((photo: string, index: number) => (
                    <div key={index} className="relative">
                      <Image 
                        src={photo} 
                        alt={`Photo ${index+1}`} 
                        className="w-full rounded-sm"
                        style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                        width={500}
                        height={375}
                        unoptimized
                      />
                    </div>
                  ))}
                  
                  {/* Stickers layer */}
                  {selectedStickers.map((sticker, index) => (
                    <div 
                      key={index}
                      className="absolute cursor-move"
                      style={{
                        top: `${sticker.y}%`,
                        left: `${sticker.x}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10 + index,
                        fontSize: '24px'
                      }}
                      draggable
                      onDragStart={() => setDraggedSticker(sticker)}
                    >
                      {stickers.find(s => s.id === sticker.id)?.icon || '❤️'}
                    </div>
                  ))}
                </div>
                <div className="text-center text-xs text-gray-500 mt-2">
                  KacaKacaBooth Free Photo Booth
                </div>
              </div>
            </div>
            
            {/* Right side tools */}
            <div className="md:w-3/5">
              <div className="bg-pink-50 bg-opacity-70 rounded-lg p-5">
                {/* Frame color */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-3">Frame Color for Your Photo Booth Strip</h3>
                  <div className="grid grid-cols-8 gap-2">
                    {frameColors.slice(0, 16).map((color) => (
                      <button
                        key={color.id}
                        className={`w-9 h-9 rounded-full ${selectedColor === color.id ? 'ring-2 ring-pink-500 ring-offset-2' : ''} transition-all`}
                        style={{ 
                          background: color.color === 'transparent' 
                            ? '#f3f4f6' 
                            : color.id === 'rainbow'
                              ? color.color
                              : color.color 
                        }}
                        onClick={() => handleColorSelect(color.id)}
                        title={color.name}
                      >
                        {color.id === 'none' && (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            ∅
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Stickers */}
                <div>
                  <h3 className="text-md font-semibold mb-3">Stickers for Your Online Photo Booth</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {stickers.filter(s => s.id !== 'none').map((sticker) => (
                      <button
                        key={sticker.id}
                        className="aspect-square bg-white rounded-md flex items-center justify-center hover:bg-gray-100 p-1 text-xl shadow-sm"
                        onClick={() => handleAddSticker(sticker.id)}
                        title={sticker.name}
                      >
                        <span>{sticker.icon}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Click to add stickers, drag to adjust position
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom action buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              className="px-10 py-3 bg-pink-500 text-white rounded-full shadow-md flex items-center justify-center hover:bg-pink-600 transition text-sm font-medium"
              onClick={handleDownload}
            >
              <FaDownload className="mr-2" />
              Download Photo Strip
            </button>
            <button
              className="px-10 py-3 bg-white text-gray-800 border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition text-sm font-medium"
              onClick={handleRetake}
            >
              <FaRedoAlt className="mr-2" />
              Retake Photos
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultPage; 