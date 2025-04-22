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
  { id: 'bw', name: 'B&W', style: 'grayscale(100%)' },
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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center mb-3">
          <Link href="/" className="flex items-center text-gray-700 hover:text-pink-600 transition text-sm">
            <FaArrowLeft className="mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-4 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-3">Free Online Photobooth</h2>
          
          {/* Tab switching */}
          <div className="flex border-b mb-4">
            <button
              className={`flex-1 py-2 font-medium text-sm ${activeTab === 'capture' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
              onClick={() => {
                setActiveTab('capture');
                setCaptureState(CaptureState.SELECTING_FILTER);
                setCapturedPhotos([null, null, null, null]);
                setCurrentPhotoIndex(0);
              }}
            >
              <FaCamera className="inline mr-1" />
              Use Camera
            </button>
            <button
              className={`flex-1 py-2 font-medium text-sm ${activeTab === 'upload' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('upload')}
            >
              <FaUpload className="inline mr-1" />
              Upload Photos
            </button>
          </div>
          
          {/* Camera capture */}
          {activeTab === 'capture' && (
            <div className="flex flex-col items-center">
              {cameraError ? (
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-red-600 mb-3 text-sm">Unable to access camera. Please ensure you have granted camera permissions, or use the photo upload feature.</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-3 py-1.5 bg-pink-600 text-white rounded-md text-sm"
                  >
                    Switch to Upload Mode
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col md:flex-row gap-4">
                  {/* Left: Camera area - always keep open */}
                  <div className="md:w-3/5 flex flex-col md:ml-auto md:mr-0 md:w-2/3">
                    {/* Camera and countdown */}
                    <div className="relative overflow-hidden rounded-xl shadow-md border border-gray-200" style={{ aspectRatio: '1/1', maxHeight: '350px' }}>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ 
                          facingMode: "user",
                          aspectRatio: 1
                        }}
                        onUserMediaError={handleCameraError}
                        className="w-full h-full object-cover"
                        style={{ filter: getCurrentFilterStyle() }}
                      />
                      
                      {/* Countdown overlay with better styling */}
                      {captureState === CaptureState.CAPTURING && countdown !== null && countdown >= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                          <div className="text-7xl font-bold text-white drop-shadow-lg animate-pulse" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                            {countdown > 0 ? countdown : 'GO!'}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Filter selection with better spacing and style */}
                    {captureState === CaptureState.SELECTING_FILTER && (
                      <div className="mt-3">
                        <h3 className="text-base font-semibold mb-2 text-center">Select Filter</h3>
                        <div className="flex flex-wrap justify-center gap-2 mb-3">
                          {filterOptions.map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => handleFilterSelect(filter.id)}
                              className={`px-3 py-1.5 rounded-full font-medium text-sm transition-all duration-200 ${
                                selectedFilter === filter.id 
                                  ? 'bg-pink-500 text-white shadow-sm transform scale-105' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 hover:shadow'
                              }`}
                            >
                              {filter.name}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={startCapture}
                          className="w-full px-4 py-2.5 bg-pink-500 text-white rounded-md flex items-center justify-center hover:bg-pink-600 transition mt-3 shadow-md font-medium"
                        >
                          <FaCamera className="mr-2" />
                          Start Capture
                        </button>
                      </div>
                    )}
                    
                    {/* Status indicators and buttons */}
                    {captureState === CaptureState.CAPTURING && (
                      <div className="text-center mt-2">
                        <p className="text-gray-600 font-medium text-sm">Taking photo {currentPhotoIndex + 1}/4...</p>
                      </div>
                    )}
                    
                    {captureState === CaptureState.REVIEWING && (
                      <div className="flex justify-between gap-3 mt-3">
                        <button
                          onClick={() => {
                            setCapturedPhotos([null, null, null, null]);
                            setCurrentPhotoIndex(0);
                            setCaptureState(CaptureState.SELECTING_FILTER);
                          }}
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center hover:bg-gray-200 transition border border-gray-300 shadow font-medium text-sm"
                        >
                          <FaRedo className="mr-1" />
                          Retake All
                        </button>
                        
                        <button
                          onClick={proceedToResults}
                          disabled={capturedPhotos.includes(null)}
                          className="flex-1 px-3 py-2 bg-pink-500 text-white rounded-md flex items-center justify-center hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-medium text-sm"
                        >
                          Next Step
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Right: Photo preview area with improved layout */}
                  <div className="md:w-1/3 flex flex-col justify-start mt-3 md:mt-0">
                    <div className="w-full max-w-[120px] mx-auto">
                      <div className="bg-gray-100 p-2 rounded-xl shadow-inner border border-gray-200">
                        <h4 className="text-center font-medium text-gray-700 mb-1.5 text-xs">Photo Preview</h4>
                        <div className="flex flex-col gap-1.5 mx-auto">
                          {[0, 1, 2, 3].map((i) => (
                            <div 
                              key={i} 
                              className={`aspect-square bg-white rounded-md overflow-hidden flex items-center justify-center relative group ${
                                capturedPhotos[i] && captureState === CaptureState.REVIEWING ? 'cursor-pointer shadow-md hover:shadow-lg transition-shadow' : 'shadow-sm'
                              }`}
                              style={{ width: '100%' }}
                              onClick={() => capturedPhotos[i] && captureState === CaptureState.REVIEWING && retakePhoto(i)}
                            >
                              {capturedPhotos[i] ? (
                                <>
                                  <Image 
                                    src={capturedPhotos[i] as string} 
                                    alt={`Photo ${i+1}`} 
                                    className="w-full h-full object-cover" 
                                    style={{ filter: getCurrentFilterStyle() }}
                                    width={150}
                                    height={150}
                                    unoptimized
                                  />
                                  {captureState === CaptureState.REVIEWING && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="p-1 text-center">
                                        <FaRedo className="inline-block mb-0.5 text-white text-[8px]" />
                                        <span className="block text-white text-[8px]">Retake</span>
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full w-full border border-dashed border-gray-300">
                                  <span className="text-gray-400 text-[10px]">{i + 1}</span>
                                  {i === currentPhotoIndex && captureState === CaptureState.CAPTURING && (
                                    <span className="text-pink-500 text-[8px] animate-pulse">Capturing...</span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-1.5 text-center">
                          <span className="inline-block px-1.5 py-0.5 bg-pink-100 text-pink-600 rounded-full text-[8px] font-medium">
                            {capturedCount}/4 Photos
                          </span>
                        </div>
                      </div>
                      {captureState === CaptureState.REVIEWING && capturedCount > 0 && (
                        <p className="text-[10px] text-gray-500 text-center mt-1">Click to retake</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Upload photos */}
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 w-full max-w-2xl mx-auto p-3 bg-gray-50 rounded-xl border border-gray-200">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="aspect-square bg-white rounded-lg overflow-hidden relative flex items-center justify-center shadow-sm border border-gray-200"
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
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full w-full border border-dashed border-gray-300">
                        <span className="text-gray-400 font-medium text-xs">{i + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <label className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg flex items-center justify-center mb-3 hover:from-purple-700 hover:to-pink-600 transition cursor-pointer shadow-md text-sm">
                <FaUpload className="mr-2" />
                <span className="font-medium">Choose Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadedPhotos.length >= 4}
                />
              </label>
              
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-3">
                  Please upload 4 photos to create your free photo strip.
                  {uploadedPhotos.length > 0 && uploadedPhotos.length < 4 && 
                    <span className="font-medium text-pink-600"> {4 - uploadedPhotos.length} more photos needed.</span>}
                </p>
                
                {/* Next button */}
                <button
                  onClick={proceedToResults}
                  disabled={uploadedPhotos.length !== 4}
                  className="px-6 py-2.5 bg-pink-500 text-white rounded-lg inline-flex items-center justify-center hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-medium text-sm"
                >
                  Create Photo Strip
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