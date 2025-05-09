'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { FaCamera, FaUpload, FaArrowLeft, FaRedo } from 'react-icons/fa';
import { usePhotoContext } from '../context/PhotoContext';
import Link from 'next/link';
import Layout from '../components/Layout';
import html2canvas from 'html2canvas';
import filterOptions from '../constants/filters';

// Helper function to detect Safari browser
const isSafari = () => {
  if (typeof window === 'undefined') return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

// Get filter style with prefixes for Safari compatibility
const getCompatibleFilterStyle = (originalStyle: string): React.CSSProperties => {
  if (!originalStyle) return {};
  
  return {
    WebkitFilter: originalStyle,
    filter: originalStyle,
  };
};

// Define filter options
// const filterOptions = [
//   { id: 'normal', name: 'Default', style: '' },
//   { id: 'bw', name: 'B&W', style: 'grayscale(100%)' },
//   { id: 'vintage', name: 'Vintage', style: 'sepia(80%)' },
//   { id: 'oldPhoto', name: 'Old Photo', style: 'sepia(50%) contrast(120%)' },
//   { id: 'amber', name: 'Amber', style: 'sepia(80%) hue-rotate(-20deg)' },
//   { id: 'nocturne', name: 'Night', style: 'brightness(0.8) contrast(120%) saturate(1.2) hue-rotate(180deg)' },
//   { id: 'test', name: 'Test', style: '' },
//   { id: 'paperTexture', name: 'Paper Texture', style: 'sepia(80%) contrast(110%) brightness(115%) grayscale(30%)' },
//   { id: 'vintageFilm', name: 'Vintage Film', style: 'sepia(80%) contrast(110%) brightness(115%) grayscale(30%)' },
// ];

// Capture state enum
const CaptureState = {
  SELECTING_FILTER: 'selecting_filter',
  CAPTURING: 'capturing',
  REVIEWING: 'reviewing',
}

const PhotoPage = () => {
  const router = useRouter();
  const { setPhotos, setSelectedFilter } = usePhotoContext();
  const webcamRef = useRef<Webcam>(null);
  
  // State management
  const [captureState, setCaptureState] = useState(CaptureState.SELECTING_FILTER);
  const [selectedFilter, setSelectedFilterState] = useState('normal');
  const [capturedPhotos, setCapturedPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'capture' | 'upload'>('capture');
  const [cameraError, setCameraError] = useState(false);

  // 获取当前滤镜的纹理路径
  const getCurrentTextureUrl = () => {
    const filter = filterOptions.find(f => f.id === selectedFilter);
    return filter?.texture?.path || null;
  };

  // 获取当前滤镜的纹理透明度
  const getCurrentTextureOpacity = () => {
    const filter = filterOptions.find(f => f.id === selectedFilter);
    return filter?.texture?.opacity || 0.5; // 默认透明度为0.5
  };

  // 检查当前滤镜是否有纹理
  const hasTexture = () => {
    return !!getCurrentTextureUrl();
  };

  // Get current filter style
  const getCurrentFilterStyle = () => {
    const filter = filterOptions.find(f => f.id === selectedFilter);
    return filter?.style || '';
  };

  // Get compatible filter style object
  const getCurrentFilterStyleObject = () => {
    const filterStyle = getCurrentFilterStyle();
    return getCompatibleFilterStyle(filterStyle);
  };

  // 将纸质纹理函数改为通用的纹理应用函数
  const applyTextureToImage = async (imageDataUrl: string, texturePath: string | null): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // 创建图像元素加载原始图像
        const img = document.createElement('img');
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          // 创建画布
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("无法获取 canvas 上下文"));
            return;
          }
          
          // 设置画布大小
          canvas.width = img.width;
          canvas.height = img.height;
          
          // 绘制原始图像
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // 应用滤镜效果
          const filterStyle = getCurrentFilterStyle();
          if (filterStyle) {
            ctx.filter = filterStyle;
            ctx.globalCompositeOperation = 'source-atop';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.filter = 'none';
          }
          
          // 如果有纹理，添加纹理
          if (texturePath) {
            const textureImg = document.createElement('img');
            textureImg.crossOrigin = "Anonymous";
            textureImg.onload = () => {
              // 使用 overlay 混合模式添加纹理
              ctx.globalCompositeOperation = 'overlay';
              ctx.globalAlpha = getCurrentTextureOpacity();
              ctx.drawImage(textureImg, 0, 0, canvas.width, canvas.height);
              
              // 返回最终图像
              resolve(canvas.toDataURL('image/jpeg', 0.95));
            };
            textureImg.onerror = () => {
              console.error("纹理图像加载失败");
              // 如果纹理加载失败，返回应用了滤镜的图像
              resolve(canvas.toDataURL('image/jpeg', 0.95));
            };
            textureImg.src = texturePath;
          } else {
            // 如果没有纹理，只返回应用了滤镜的图像
            resolve(canvas.toDataURL('image/jpeg', 0.95));
          }
        };
        img.onerror = () => {
          console.error("原始图像加载失败");
          reject(new Error("原始图像加载失败"));
        };
        img.src = imageDataUrl;
      } catch (error) {
        console.error("应用纹理时出错:", error);
        reject(error);
      }
    });
  };

  // Select filter
  const handleFilterSelect = (filterId: string) => {
    setSelectedFilterState(filterId);
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
        // 创建一个短暂的延迟，让GO!动画完成并消失
        timerId = setTimeout(() => {
          // 暂时隐藏倒计时覆盖层以便拍照
          const countdownOverlay = document.getElementById('countdown-overlay');
          if (countdownOverlay) {
            countdownOverlay.style.display = 'none';
          }
          
          // 直接使用 webcam 截图
          const imageSrc = webcamRef.current?.getScreenshot();
          if (imageSrc) {
            // 使用同样的工具处理所有滤镜，无论是否有纹理
            processAndCapturePhoto(imageSrc, currentPhotoIndex);
          }
        }, 200);
      }
    }
    
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [captureState, countdown, currentPhotoIndex, capturedPhotos]);
  
  // 将照片处理逻辑提取为单独的函数
  const processAndCapturePhoto = async (imageDataUrl: string, index: number) => {
    try {
      // 检测是否为Safari浏览器
      const isSafariBrowser = typeof window !== 'undefined' ? isSafari() : false;
      
      // 对于有纹理的滤镜，应用特殊处理
      let finalImageSrc = imageDataUrl;
      const textureUrl = getCurrentTextureUrl();
      const filterStyle = getCurrentFilterStyle();
      
      // 如果有滤镜或纹理，或者是Safari浏览器（Safari可能需要特殊处理），使用Canvas处理
      if (filterStyle || textureUrl) {
        // 在非Safari浏览器中使用Canvas处理
        finalImageSrc = await applyTextureToImage(imageDataUrl, textureUrl || '');
      }
      
      // 保存图像
      const newPhotos = [...capturedPhotos];
      newPhotos[index] = finalImageSrc;
      setCapturedPhotos(newPhotos);
      
      // 处理完成后恢复倒计时覆盖层
      const countdownOverlay = document.getElementById('countdown-overlay');
      if (countdownOverlay) {
        countdownOverlay.style.display = '';
      }
      
      // 查找下一个空槽位
      let nextEmptyIndex = -1;
      for (let i = 0; i < newPhotos.length; i++) {
        if (newPhotos[i] === null) {
          nextEmptyIndex = i;
          break;
        }
      }
      
      if (nextEmptyIndex !== -1) {
        // 如果还有空槽位，继续拍摄下一张
        setCurrentPhotoIndex(nextEmptyIndex);
        setCountdown(2); // 简短延迟，然后拍摄下一张
      } else {
        // 所有照片都已拍摄
        setCaptureState(CaptureState.REVIEWING);
      }
    } catch (error) {
      console.error("处理照片时出错:", error);
      
      // 出错时使用原始图像
      const newPhotos = [...capturedPhotos];
      newPhotos[index] = imageDataUrl;
      setCapturedPhotos(newPhotos);
      
      // 处理完成后恢复倒计时覆盖层
      const countdownOverlay = document.getElementById('countdown-overlay');
      if (countdownOverlay) {
        countdownOverlay.style.display = '';
      }
      
      // 继续处理下一张照片
      let nextEmptyIndex = -1;
      for (let i = 0; i < newPhotos.length; i++) {
        if (newPhotos[i] === null) {
          nextEmptyIndex = i;
          break;
        }
      }
      
      if (nextEmptyIndex !== -1) {
        setCurrentPhotoIndex(nextEmptyIndex);
        setCountdown(2);
      } else {
        setCaptureState(CaptureState.REVIEWING);
      }
    }
  };

  // 修改缩略图显示方式，确保在Safari中也显示滤镜效果
  const renderThumbnail = (photoSrc: string, index: number) => {
    // 检测是否为Safari浏览器
    const safari = typeof window !== 'undefined' ? isSafari() : false;
    
    return (
      <>
        <Image 
          src={photoSrc} 
          alt={`Photo ${index+1}`} 
          className={`w-full h-full object-cover ${safari ? 'safari-filter-fix' : ''}`}
          style={{ 
            transform: 'scaleX(-1)', // 镜像翻转
            ...(safari ? getCurrentFilterStyleObject() : {}) // 在Safari中重新应用滤镜
          }}
          width={120}
          height={80}
          unoptimized
        />
        {captureState === CaptureState.REVIEWING && (
          <div className="absolute inset-0 bg-transparent bg-opacity-0 hover:bg-opacity-40 flex items-center justify-center transition-all">
            <div className="p-1 text-center opacity-0 hover:opacity-100">
              <FaRedo className="inline-block text-white text-sm" />
            </div>
          </div>
        )}
        <div className="absolute top-0 left-0 bg-cream-500 text-white text-xs py-0.5 px-1 rounded-br-md">
          {index + 1}
        </div>
      </>
    );
  };

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
      // Save the selected filter when proceeding to results
      setSelectedFilter(selectedFilter);
      router.push('/result');
    } else if (uploadedPhotos.length === 4) {
      setPhotos(uploadedPhotos);
      // Save the selected filter when proceeding to results
      setSelectedFilter(selectedFilter);
      router.push('/result');
    }
  };

  // Detect camera errors
  const handleCameraError = (error: string | DOMException) => {
    console.error('Camera access error:', error);
    setCameraError(true);
  };

  // Calculate number of captured photos
  const capturedCount = capturedPhotos.filter(photo => photo !== null).length;

  return (
    <Layout>
      {/* Main container with reduced padding */}
      <div className="container mx-auto px-3 pt-0 pb-2">
        {/* Back Button with reduced spacing */}
        <div className="flex items-center mb-1">
          <Link href="/" className="flex items-center text-gray-700 hover:text-amber-700 transition text-sm">
            <FaArrowLeft className="mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Main content area */}
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 max-w-4xl mx-auto mt-1">
          <h1 className="text-xl font-bold text-center mb-2">Free Online Photo Booth</h1>
          
          {/* Tab switching */}
          <div className="flex border-b mb-3">
            <button
              className={`flex-1 py-2 font-medium text-base ${activeTab === 'capture' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-gray-500'}`}
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
              className={`flex-1 py-2 font-medium text-base ${activeTab === 'upload' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-gray-500'}`}
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
                <div className="text-center p-3 bg-red-50 rounded-lg mb-4 max-w-xl mx-auto">
                  <p className="text-red-600 mb-2 text-sm">Unable to access camera. Please ensure you have granted camera permissions, or use the photo upload feature.</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-sm"
                  >
                    Switch to Upload Mode
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-row items-start max-w-3xl mx-auto">
                  {/* Main camera column */}
                  <div className="flex-1">
                    {/* Camera view */}
                    <div 
                      id="camera-view-container"
                      className="relative overflow-hidden rounded-xl shadow-md border border-gray-200 bg-transparent mx-auto" 
                      style={{ width: '100%', maxWidth: '600px', height: '400px' }}
                    >
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ 
                          facingMode: "user",
                          aspectRatio: 3/2
                        }}
                        onUserMediaError={handleCameraError}
                        className="w-full h-full object-cover"
                        style={{ ...getCurrentFilterStyleObject(), transform: 'scaleX(-1)' }}
                      />
                      
                      {/* 纹理覆盖层 */}
                      {hasTexture() && (
                        <div 
                          id="texture-overlay"
                          className="absolute inset-0" 
                          style={{
                            backgroundImage: `url('${getCurrentTextureUrl()}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: "100%",
                            height: "100%",
                            opacity: getCurrentTextureOpacity(),
                            mixBlendMode: "overlay"
                          }}
                        />
                      )}
                      
                      {/* Countdown overlay */}
                      {captureState === CaptureState.CAPTURING && countdown !== null && countdown >= 0 && (
                        <div id="countdown-overlay" className="absolute inset-0 flex items-center justify-center bg-transparent bg-opacity-20">
                          <div className="text-7xl font-bold text-white drop-shadow-lg animate-pulse" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                            {countdown > 0 ? countdown : 'GO!'}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Filter selection & controls - more compact */}
                    {captureState === CaptureState.SELECTING_FILTER && (
                      <div className="w-full max-w-[600px] mx-auto mt-3">
                        <h3 className="text-base font-medium mb-2 text-center">Choose a Filter</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                          {filterOptions.map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => handleFilterSelect(filter.id)}
                              className={`px-2 py-1.5 rounded-md font-medium text-sm transition-all duration-200 ${
                                selectedFilter === filter.id 
                                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                              }`}
                            >
                              {filter.name}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={startCapture}
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md flex items-center justify-center hover:opacity-90 transition mt-2 shadow-md font-medium text-base"
                        >
                          <FaCamera className="mr-2" />
                          Start Taking Photos
                        </button>
                      </div>
                    )}
                    
                    {/* Status indicators and buttons */}
                    {captureState === CaptureState.CAPTURING && (
                      <div className="text-center w-full max-w-[600px] mx-auto mt-3">
                        <p className="text-gray-600 font-medium text-base">Taking photo {currentPhotoIndex + 1} of 4...</p>
                      </div>
                    )}
                    
                    {captureState === CaptureState.REVIEWING && (
                      <div className="flex justify-between gap-3 w-full max-w-[600px] mx-auto mt-3">
                        <button
                          onClick={() => {
                            setCapturedPhotos([null, null, null, null]);
                            setCurrentPhotoIndex(0);
                            setCaptureState(CaptureState.SELECTING_FILTER);
                          }}
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center hover:bg-gray-200 transition border border-gray-300 shadow font-medium text-sm"
                        >
                          <FaRedo className="mr-1" />
                          Retake All Photos
                        </button>
                        
                        <button
                          onClick={proceedToResults}
                          disabled={capturedPhotos.includes(null)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md flex items-center justify-center hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-medium text-sm"
                        >
                          Next Step
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Right: Thumbnail preview column */}
                  <div className="ml-4 mt-0 flex flex-col w-32 h-[400px] justify-between">
                    {[0, 1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className={`relative rounded-md overflow-hidden flex items-center justify-center bg-transparent ${
                          capturedPhotos[i] 
                            ? 'border-2 border-pink-400 shadow-sm cursor-pointer hover:opacity-90 transition-opacity'
                            : ''
                        }`}
                        style={{ width: '100%', height: '75px' }}
                        onClick={() => capturedPhotos[i] && captureState === CaptureState.REVIEWING && retakePhoto(i)}
                      >
                        {capturedPhotos[i] ? (
                          renderThumbnail(capturedPhotos[i] as string, i)
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Upload photos */}
          {activeTab === 'upload' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                <h3 className="text-center text-lg font-semibold mb-3">Upload Your Photos</h3>
                <p className="text-center text-gray-600 mb-4 text-sm">
                  Upload 4 photos to create your custom photo strip.
                  {uploadedPhotos.length > 0 && uploadedPhotos.length < 4 && 
                    <span className="font-medium text-amber-700"> {4 - uploadedPhotos.length} more photos needed.</span>}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="aspect-[3/2] bg-white rounded-lg overflow-hidden relative flex items-center justify-center shadow-sm border border-gray-200"
                    >
                      {uploadedPhotos[i] ? (
                        <>
                          <Image 
                            src={uploadedPhotos[i]} 
                            alt={`Photo ${i+1}`} 
                            className="w-full h-full object-cover"
                            width={300}
                            height={200}
                            unoptimized
                          />
                          <button
                            onClick={() => removeUploadedPhoto(i)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                          <div className="absolute top-0 left-0 bg-cream-500 text-white text-xs py-0.5 px-1.5 rounded-br-md">
                            {i + 1}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full border border-dashed border-gray-300 rounded-lg">
                          <FaUpload className="text-gray-400 text-xl mb-1" />
                          <span className="text-gray-400 font-medium text-xs">Photo {i + 1}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col items-center">
                  <label className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg flex items-center justify-center mb-3 hover:opacity-90 transition cursor-pointer shadow-md font-medium">
                    <FaUpload className="mr-2" />
                    <span>Choose Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadedPhotos.length >= 4}
                    />
                  </label>
                  
                  {/* Next button */}
                  <button
                    onClick={proceedToResults}
                    disabled={uploadedPhotos.length !== 4}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg inline-flex items-center justify-center hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-medium w-full max-w-xs"
                  >
                    Create Photo Strip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PhotoPage; 