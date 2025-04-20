'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { FaCamera, FaUpload, FaArrowLeft, FaRedo } from 'react-icons/fa';
import { usePhotoContext } from '../context/PhotoContext';
import Link from 'next/link';
import Layout from '../components/Layout';

// Define filter options
const filterOptions = [
  { id: 'normal', name: 'Default', style: '' },
  { id: 'bw', name: 'BW', style: 'grayscale(100%)' },
  { id: 'vintage', name: 'Vintage', style: 'sepia(80%)' },
  { id: 'oldPhoto', name: 'Old Photo', style: 'sepia(50%) contrast(120%)' },
  { id: 'amber', name: 'Amber', style: 'sepia(80%) hue-rotate(-20deg)' },
  { id: 'nocturne', name: 'Night', style: 'brightness(0.8) contrast(120%) saturate(1.2) hue-rotate(180deg)' },
];

// Capture state enum
const CaptureState = {
  SELECTING_FILTER: 'selecting_filter',
  CAPTURING: 'capturing',
  REVIEWING: 'reviewing',
}

const PhotoPage = () => {
  const router = useRouter();
  const { setPhotos } = usePhotoContext();
  const webcamRef = useRef<Webcam>(null);
  
  // State management
  const [captureState, setCaptureState] = useState(CaptureState.SELECTING_FILTER);
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [capturedPhotos, setCapturedPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'capture' | 'upload'>('capture');
  const [cameraError, setCameraError] = useState(false);

  // Select filter
  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  // Start capture process
  const startCapture = () => {
    setCaptureState(CaptureState.CAPTURING);
    setCountdown(3); // Fixed 3-second countdown
  };

  // Retake specific photo
  const retakePhoto = (index: number) => {
    setCurrentPhotoIndex(index);
    setCaptureState(CaptureState.CAPTURING);
    setCountdown(3); // Fixed 3-second countdown
  };

  // Countdown and photo capture effect
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (captureState === CaptureState.CAPTURING && countdown !== null) {
      if (countdown > 0) {
        timerId = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
      } else {
        // Take photo
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          const newPhotos = [...capturedPhotos];
          newPhotos[currentPhotoIndex] = imageSrc;
          setCapturedPhotos(newPhotos);
          
          // Find next empty photo slot (always capture in order from top to bottom)
          let nextEmptyIndex = -1;
          for (let i = 0; i < newPhotos.length; i++) {
            if (newPhotos[i] === null) {
              nextEmptyIndex = i;
              break;
            }
          }
          
          if (nextEmptyIndex !== -1) {
            // If there are empty slots, continue with the next photo
            setCurrentPhotoIndex(nextEmptyIndex);
            setCountdown(2); // Brief delay before capturing the next photo
          } else {
            // All photos captured
            setCaptureState(CaptureState.REVIEWING);
          }
        }
      }
    }
    
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [captureState, countdown, currentPhotoIndex, capturedPhotos]);

  // Handle photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newPhotos: string[] = [...uploadedPhotos];
    
    // Process each file
    Array.from(files).forEach(file => {
      if (newPhotos.length >= 4) return; // Maximum 4 photos
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          newPhotos.push(event.target.result);
          setUploadedPhotos([...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove uploaded photo
  const removeUploadedPhoto = (index: number) => {
    const newPhotos = [...uploadedPhotos];
    newPhotos.splice(index, 1);
    setUploadedPhotos(newPhotos);
  };

  // Proceed to results page
  const proceedToResults = () => {
    // Ensure all photos are captured
    if (!capturedPhotos.includes(null)) {
      // Remove potential null values, although there shouldn't be any based on the logic
      const validPhotos = capturedPhotos.filter(photo => photo !== null) as string[];
      setPhotos(validPhotos);
      router.push('/result');
    } else if (uploadedPhotos.length === 4) {
      setPhotos(uploadedPhotos);
      router.push('/result');
    }
  };

  // Detect camera errors
  const handleCameraError = (error: string | DOMException) => {
    console.error('Camera access error:', error);
    setCameraError(true);
  };

  // Get current filter style
  const getCurrentFilterStyle = () => {
    const filter = filterOptions.find(f => f.id === selectedFilter);
    return filter?.style || '';
  };

  // Calculate number of captured photos
  const capturedCount = capturedPhotos.filter(photo => photo !== null).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-gray-700 hover:text-pink-600 transition">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Create Your Free Online Photobooth Strip</h2>
          
          {/* Tab switching */}
          <div className="flex border-b mb-6">
            <button
              className={`flex-1 py-3 font-medium ${activeTab === 'capture' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
              onClick={() => {
                setActiveTab('capture');
                setCaptureState(CaptureState.SELECTING_FILTER);
                setCapturedPhotos([null, null, null, null]);
                setCurrentPhotoIndex(0);
              }}
            >
              <FaCamera className="inline mr-2" />
              Use Camera
            </button>
            <button
              className={`flex-1 py-3 font-medium ${activeTab === 'upload' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('upload')}
            >
              <FaUpload className="inline mr-2" />
              Upload Photos
            </button>
          </div>
          
          {/* Camera capture */}
          {activeTab === 'capture' && (
            <div className="flex flex-col items-center">
              {cameraError ? (
                <div className="text-center p-8 bg-red-50 rounded-lg">
                  <p className="text-red-600 mb-4">Cannot access camera. Please ensure you have granted camera permissions, or use the photo upload feature.</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-4 py-2 bg-pink-600 text-white rounded-md"
                  >
                    Switch to Upload
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col md:flex-row gap-6">
                  {/* Camera area - always keep open */}
                  <div className="md:w-3/4 flex flex-col">
                    {/* Camera and countdown */}
                    <div className="relative overflow-hidden rounded-lg" style={{ marginBottom: '1.5rem' }}>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        onUserMediaError={handleCameraError}
                        className="w-full rounded-lg"
                        style={{ filter: getCurrentFilterStyle() }}
                      />
                      
                      {/* Countdown overlay - use very transparent layer */}
                      {captureState === CaptureState.CAPTURING && countdown !== null && countdown >= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                          <div className="text-9xl font-bold text-white drop-shadow-lg" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                            {countdown > 0 ? countdown : 'GO!'}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Filter selection */}
                    {captureState === CaptureState.SELECTING_FILTER && (
                      <>
                        <h3 className="text-lg font-semibold mb-3 text-center">Select Filter for Your Free Photobooth</h3>
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                          {filterOptions.map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => handleFilterSelect(filter.id)}
                              className={`px-4 py-2 rounded-full ${
                                selectedFilter === filter.id 
                                  ? 'bg-pink-600 text-white' 
                                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              }`}
                            >
                              {filter.name}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={startCapture}
                          className="w-full px-8 py-3 bg-pink-600 text-white rounded-lg shadow-md flex items-center justify-center hover:bg-pink-700 transition"
                        >
                          <FaCamera className="mr-2" />
                          Start Photobooth Capture
                        </button>
                      </>
                    )}
                    
                    {/* Status indicators and buttons */}
                    {captureState === CaptureState.CAPTURING && (
                      <div className="text-center mb-4">
                        <p className="text-gray-600">Capturing photo {currentPhotoIndex + 1}/4...</p>
                      </div>
                    )}
                    
                    {captureState === CaptureState.REVIEWING && (
                      <div className="flex justify-between gap-4">
                        <button
                          onClick={() => {
                            setCapturedPhotos([null, null, null, null]);
                            setCurrentPhotoIndex(0);
                            setCaptureState(CaptureState.SELECTING_FILTER);
                          }}
                          className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg shadow-md flex items-center justify-center hover:bg-gray-300 transition"
                        >
                          <FaRedo className="mr-2" />
                          Retake All
                        </button>
                        
                        <button
                          onClick={proceedToResults}
                          disabled={capturedPhotos.includes(null)}
                          className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-lg shadow-md flex items-center justify-center hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next Step
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Photo preview area */}
                  <div className="md:w-1/4 md:flex md:flex-col">
                    {(captureState !== CaptureState.SELECTING_FILTER || capturedCount > 0) && (
                      <div className="flex flex-col h-full justify-center">
                        <div className="grid grid-cols-1 gap-2 flex-grow">
                          {[0, 1, 2, 3].map((i) => (
                            <div 
                              key={i} 
                              className={`aspect-video bg-gray-200 rounded-md overflow-hidden flex items-center justify-center relative group ${capturedPhotos[i] && captureState === CaptureState.REVIEWING ? 'cursor-pointer' : ''}`}
                              onClick={() => capturedPhotos[i] && captureState === CaptureState.REVIEWING && retakePhoto(i)}
                            >
                              {capturedPhotos[i] ? (
                                <>
                                  <Image 
                                    src={capturedPhotos[i] as string} 
                                    alt={`Photo ${i+1}`} 
                                    className="w-full h-full object-cover" 
                                    style={{ filter: getCurrentFilterStyle() }}
                                    width={300}
                                    height={225}
                                    unoptimized
                                  />
                                  {captureState === CaptureState.REVIEWING && (
                                    <div className="absolute inset-0 bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="px-3 py-1 bg-pink-600 bg-opacity-80 text-white rounded-md font-medium shadow-lg">
                                        Click to Retake
                                      </button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center">
                                  <span className="text-gray-500 text-sm">Photo {i+1}</span>
                                  {i === currentPhotoIndex && captureState === CaptureState.CAPTURING && (
                                    <span className="text-pink-600 text-xs mt-1">Capturing...</span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {captureState === CaptureState.REVIEWING && capturedCount > 0 && (
                          <p className="text-sm text-gray-600 text-center mt-3">Click on any photo to retake it</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Upload photos */}
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="aspect-square bg-gray-200 rounded-md overflow-hidden relative flex items-center justify-center"
                  >
                    {uploadedPhotos[i] ? (
                      <>
                        <Image 
                          src={uploadedPhotos[i]} 
                          alt={`Photo ${i+1}`} 
                          className="w-full h-full object-cover"
                          width={300}
                          height={300}
                          unoptimized
                        />
                        <button
                          onClick={() => removeUploadedPhoto(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500">Photo {i+1}</span>
                    )}
                  </div>
                ))}
              </div>
              
              <label className="px-8 py-3 bg-purple-600 text-white rounded-lg shadow-md flex items-center justify-center mb-4 hover:bg-purple-700 transition cursor-pointer">
                <FaUpload className="mr-2" />
                Select Photos for Your Photobooth
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadedPhotos.length >= 4}
                />
              </label>
              
              <p className="text-sm text-gray-500 mb-4">
                Upload up to 4 photos for your free online photobooth strip.
                {uploadedPhotos.length > 0 && uploadedPhotos.length < 4 && 
                  ` You need ${4 - uploadedPhotos.length} more photos.`}
              </p>
              
              {/* Next button */}
              <div className="text-center mt-6">
                <button
                  onClick={proceedToResults}
                  disabled={uploadedPhotos.length !== 4}
                  className="px-8 py-3 bg-pink-600 text-white rounded-lg shadow-md inline-flex items-center justify-center hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create My Photobooth Strip
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PhotoPage; 