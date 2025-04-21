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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-gray-700 hover:text-pink-600 transition">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Free Online Photobooth - Create Your Photo Strip</h2>
          
          {/* Tab switching */}
          <div className="flex border-b mb-8">
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
                  <p className="text-red-600 mb-4">Unable to access camera. Please ensure you have granted camera permissions, or use the photo upload feature.</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-4 py-2 bg-pink-600 text-white rounded-md"
                  >
                    Switch to Upload Mode
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col md:flex-row gap-8">
                  {/* Left: Camera area - always keep open */}
                  <div className="md:w-3/5 flex flex-col md:ml-auto md:mr-0 md:w-2/3">
                    {/* Camera and countdown */}
                    <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200" style={{ aspectRatio: '1/1' }}>
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
                          <div className="text-9xl font-bold text-white drop-shadow-lg animate-pulse" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                            {countdown > 0 ? countdown : 'GO!'}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Filter selection with better spacing and style */}
                    {captureState === CaptureState.SELECTING_FILTER && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4 text-center">Select Photobooth Filter</h3>
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                          {filterOptions.map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => handleFilterSelect(filter.id)}
                              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                                selectedFilter === filter.id 
                                  ? 'bg-pink-500 text-white shadow-md transform scale-105' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 hover:shadow'
                              }`}
                            >
                              {filter.name}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={startCapture}
                          className="w-full px-6 py-4 bg-pink-500 text-white rounded-md flex items-center justify-center hover:bg-pink-600 transition mt-4 shadow-md font-medium text-lg"
                        >
                          <FaCamera className="mr-2" />
                          Start Photobooth Capture
                        </button>
                      </div>
                    )}
                    
                    {/* Status indicators and buttons */}
                    {captureState === CaptureState.CAPTURING && (
                      <div className="text-center mt-4">
                        <p className="text-gray-600 font-medium">Taking photobooth image {currentPhotoIndex + 1}/4...</p>
                      </div>
                    )}
                    
                    {captureState === CaptureState.REVIEWING && (
                      <div className="flex justify-between gap-4 mt-6">
                        <button
                          onClick={() => {
                            setCapturedPhotos([null, null, null, null]);
                            setCurrentPhotoIndex(0);
                            setCaptureState(CaptureState.SELECTING_FILTER);
                          }}
                          className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center hover:bg-gray-200 transition border border-gray-300 shadow font-medium"
                        >
                          <FaRedo className="mr-2" />
                          Retake Photobooth
                        </button>
                        
                        <button
                          onClick={proceedToResults}
                          disabled={capturedPhotos.includes(null)}
                          className="flex-1 px-6 py-3.5 bg-pink-500 text-white rounded-md flex items-center justify-center hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-medium"
                        >
                          Next Photobooth Step
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Right: Photo preview area with improved layout */}
                  <div className="md:w-1/3 flex flex-col justify-center mt-6 md:mt-0">
                    <div className="w-full max-w-[200px] mx-auto">
                      <div className="bg-gray-100 p-4 rounded-xl shadow-inner border border-gray-200">
                        <h4 className="text-center font-medium text-gray-700 mb-4">Photo Preview</h4>
                        <div className="flex flex-col gap-3 mx-auto">
                          {[0, 1, 2, 3].map((i) => (
                            <div 
                              key={i} 
                              className={`aspect-square bg-white rounded-md overflow-hidden flex items-center justify-center relative group ${
                                capturedPhotos[i] && captureState === CaptureState.REVIEWING ? 'cursor-pointer shadow-md hover:shadow-lg transition-shadow' : 'shadow-sm'
                              }`}
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
                                      <div className="p-2 text-center">
                                        <FaRedo className="inline-block mb-1 text-white" />
                                        <span className="block text-white text-xs">Retake</span>
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full w-full border border-dashed border-gray-300">
                                  <span className="text-gray-400 text-sm mb-1">{i + 1}</span>
                                  {i === currentPhotoIndex && captureState === CaptureState.CAPTURING && (
                                    <span className="text-pink-500 text-xs animate-pulse">Capturing...</span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">
                            {capturedCount}/4 Photos
                          </span>
                        </div>
                      </div>
                      {captureState === CaptureState.REVIEWING && capturedCount > 0 && (
                        <p className="text-sm text-gray-500 text-center mt-2">Click photos to retake</p>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full max-w-3xl mx-auto p-5 bg-gray-50 rounded-xl border border-gray-200">
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
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full w-full border border-dashed border-gray-300">
                        <span className="text-gray-400 font-medium">{i + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <label className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg flex items-center justify-center mb-4 hover:from-purple-700 hover:to-pink-600 transition cursor-pointer shadow-md">
                <FaUpload className="mr-3 text-lg" />
                <span className="font-medium">选择照片</span>
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
                <p className="text-sm text-gray-600 mb-4">
                  请上传4张照片来制作您的免费拍立得照片条。
                  {uploadedPhotos.length > 0 && uploadedPhotos.length < 4 && 
                    <span className="font-medium text-pink-600"> 还需要 {4 - uploadedPhotos.length} 张照片。</span>}
                </p>
                
                {/* Next button */}
                <button
                  onClick={proceedToResults}
                  disabled={uploadedPhotos.length !== 4}
                  className="px-8 py-4 bg-pink-500 text-white rounded-lg inline-flex items-center justify-center hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-medium text-lg mt-4"
                >
                  创建照片条
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