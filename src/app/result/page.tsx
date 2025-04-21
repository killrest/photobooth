'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaDownload, FaRedoAlt, FaTrash, FaUndo, FaRedo } from 'react-icons/fa';
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

// 生成随机位置函数 - 增强版
const getRandomPosition = () => {
  // 给边缘留出一些空间，所以范围是20-80%而不是0-100%
  return {
    x: Math.floor(Math.random() * 60) + 20, 
    y: Math.floor(Math.random() * 60) + 20
  };
};

// 生成美观均衡的多贴纸位置
const generateBalancedPositions = (numStickers: number): {x: number, y: number}[] => {
  const positions: {x: number, y: number}[] = [];
  
  // 如果只有1-2个贴纸，就随机分布
  if (numStickers <= 2) {
    for (let i = 0; i < numStickers; i++) {
      positions.push(getRandomPosition());
    }
    return positions;
  }
  
  // 对于多个贴纸，我们创建更均衡的分布
  // 将照片区域分为最多9个区域，确保每个区域至多有一个贴纸
  
  // 创建区域划分
  const areas = [
    { xRange: [10, 30], yRange: [10, 30] },  // 左上
    { xRange: [40, 60], yRange: [10, 30] },  // 中上
    { xRange: [70, 90], yRange: [10, 30] },  // 右上
    { xRange: [10, 30], yRange: [40, 60] },  // 左中
    { xRange: [40, 60], yRange: [40, 60] },  // 中心
    { xRange: [70, 90], yRange: [40, 60] },  // 右中
    { xRange: [10, 30], yRange: [70, 90] },  // 左下
    { xRange: [40, 60], yRange: [70, 90] },  // 中下
    { xRange: [70, 90], yRange: [70, 90] },  // 右下
  ];
  
  // 随机选择区域，不重复
  const selectedAreaIndices = new Set<number>();
  while (selectedAreaIndices.size < Math.min(numStickers, areas.length)) {
    const randomIndex = Math.floor(Math.random() * areas.length);
    selectedAreaIndices.add(randomIndex);
  }
  
  // 在每个选中的区域内随机生成一个位置
  Array.from(selectedAreaIndices).forEach(index => {
    const area = areas[index];
    const x = Math.floor(Math.random() * (area.xRange[1] - area.xRange[0])) + area.xRange[0];
    const y = Math.floor(Math.random() * (area.yRange[1] - area.yRange[0])) + area.yRange[0];
    positions.push({ x, y });
  });
  
  return positions;
};

// 生成随机大小 (缩放比例)
const getRandomScale = (): number => {
  // 0.8 到 1.2 之间的随机比例
  return 0.8 + Math.random() * 0.4;
};

// 定义操作历史类型
type HistoryAction = {
  type: 'add' | 'remove';  // 操作类型：添加或删除
  stickers: {id: string, x: number, y: number, scale: number}[];  // 相关贴纸
  index?: number;  // 删除操作的索引
};

const ResultPage = () => {
  const router = useRouter();
  const { photoData } = usePhotoContext();
  const [selectedColor, setSelectedColor] = useState('lightBlue');
  const [selectedStickers, setSelectedStickers] = useState<{id: string, x: number, y: number, scale: number}[]>([]);
  const photoGridRef = useRef<HTMLDivElement>(null);
  
  // 历史记录状态
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // 拖拽状态相关
  const [activeSticker, setActiveSticker] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

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

  // 选择贴纸数量范围 - 根据贴纸类型决定
  const getStickerCountRange = (stickerId: string): [number, number] => {
    // 针对不同贴纸类型，设定不同的数量范围
    switch(stickerId) {
      case 'heart':
      case 'star':
      case 'sparkle':
        return [3, 5]; // 这些小贴纸可以多放几个
      case 'butterfly':
      case 'flower':
        return [2, 4]; // 这些中等贴纸适量放置
      case 'rainbow':
      case 'cat':
      case 'dog':
      case 'crown':
      case 'unicorn':
        return [1, 2]; // 这些大贴纸或主体贴纸少放
      default:
        return [1, 3]; // 默认范围
    }
  };

  // 增强版贴纸添加功能 - 添加多个贴纸
  const handleAddSticker = (stickerId: string) => {
    if (stickerId === 'none') return;
    
    // 确定该类型贴纸的数量范围
    const [minCount, maxCount] = getStickerCountRange(stickerId);
    
    // 随机决定要添加的贴纸数量
    const stickerCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    
    // 生成均衡分布的贴纸位置
    const positions = generateBalancedPositions(stickerCount);
    
    // 创建新贴纸
    const newStickers = positions.map(position => ({
      id: stickerId,
      x: position.x,
      y: position.y,
      scale: getRandomScale()
    }));
    
    // 添加到现有贴纸中
    const updatedStickers = [...selectedStickers, ...newStickers];
    setSelectedStickers(updatedStickers);
    
    // 记录添加操作到历史
    const newAction: HistoryAction = {
      type: 'add',
      stickers: newStickers
    };
    
    // 如果已经撤销过操作，需要清除那些被撤销的操作历史
    const newHistory = history.slice(0, historyIndex + 1).concat(newAction);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // 删除贴纸
  const handleRemoveSticker = (index: number) => {
    // 保存即将删除的贴纸，用于历史记录
    const removedSticker = selectedStickers[index];
    
    // 更新贴纸数组
    const newStickers = [...selectedStickers];
    newStickers.splice(index, 1);
    setSelectedStickers(newStickers);
    
    // 记录删除操作到历史
    const newAction: HistoryAction = {
      type: 'remove',
      stickers: [removedSticker],
      index: index
    };
    
    // 如果已经撤销过操作，需要清除那些被撤销的操作历史
    const newHistory = history.slice(0, historyIndex + 1).concat(newAction);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  // 撤销操作
  const handleUndo = () => {
    if (historyIndex < 0) return; // 没有可撤销的操作
    
    const actionToUndo = history[historyIndex];
    
    if (actionToUndo.type === 'add') {
      // 撤销添加操作：移除添加的贴纸
      const stickerCount = actionToUndo.stickers.length;
      setSelectedStickers(prevStickers => prevStickers.slice(0, -stickerCount));
    } else if (actionToUndo.type === 'remove') {
      // 撤销删除操作：恢复删除的贴纸
      const stickerToRestore = actionToUndo.stickers[0];
      const insertIndex = actionToUndo.index !== undefined ? actionToUndo.index : selectedStickers.length;
      
      const newStickers = [...selectedStickers];
      newStickers.splice(insertIndex, 0, stickerToRestore);
      setSelectedStickers(newStickers);
    }
    
    // 更新历史索引
    setHistoryIndex(historyIndex - 1);
  };
  
  // 重做操作
  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return; // 没有可重做的操作
    
    const actionToRedo = history[historyIndex + 1];
    
    if (actionToRedo.type === 'add') {
      // 重做添加操作：重新添加贴纸
      setSelectedStickers(prevStickers => [...prevStickers, ...actionToRedo.stickers]);
    } else if (actionToRedo.type === 'remove') {
      // 重做删除操作：重新删除贴纸
      if (actionToRedo.index !== undefined) {
        const newStickers = [...selectedStickers];
        newStickers.splice(actionToRedo.index, 1);
        setSelectedStickers(newStickers);
      }
    }
    
    // 更新历史索引
    setHistoryIndex(historyIndex + 1);
  };

  // 判断是否可以撤销/重做
  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  // 鼠标按下事件
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    if (!photoGridRef.current) return;
    
    // 阻止拖放默认行为
    e.preventDefault();
    
    // 激活当前贴纸
    setActiveSticker(index);
    setIsDragging(true);
    
    // 记录开始位置
    setStartPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  // 鼠标移动事件 - 处理拖拽
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeSticker === null || !photoGridRef.current) return;
    
    // 计算位移
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    
    // 获取容器尺寸，用于计算百分比移动
    const containerRect = photoGridRef.current.getBoundingClientRect();
    
    // 计算位移的百分比变化
    const deltaXPercent = (deltaX / containerRect.width) * 100;
    const deltaYPercent = (deltaY / containerRect.height) * 100;
    
    // 更新贴纸位置
    const updatedStickers = [...selectedStickers];
    const sticker = updatedStickers[activeSticker];
    
    // 更新位置，同时确保不超出边界（5% - 95%）
    updatedStickers[activeSticker] = {
      ...sticker,
      x: Math.max(5, Math.min(95, sticker.x + deltaXPercent)),
      y: Math.max(5, Math.min(95, sticker.y + deltaYPercent))
    };
    
    // 更新状态
    setSelectedStickers(updatedStickers);
    setStartPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  // 鼠标释放事件
  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveSticker(null);
  };

  // 在组件销毁时移除全局事件监听器
  useEffect(() => {
    // 注册全局鼠标事件，保证拖拽时鼠标移出元素仍能正常工作
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && activeSticker !== null && photoGridRef.current) {
        const containerRect = photoGridRef.current.getBoundingClientRect();
        const deltaX = e.clientX - startPosition.x;
        const deltaY = e.clientY - startPosition.y;
        
        // 计算位移的百分比变化
        const deltaXPercent = (deltaX / containerRect.width) * 100;
        const deltaYPercent = (deltaY / containerRect.height) * 100;
        
        // 更新贴纸位置
        const updatedStickers = [...selectedStickers];
        const sticker = updatedStickers[activeSticker];
        
        updatedStickers[activeSticker] = {
          ...sticker,
          x: Math.max(5, Math.min(95, sticker.x + deltaXPercent)),
          y: Math.max(5, Math.min(95, sticker.y + deltaYPercent))
        };
        
        setSelectedStickers(updatedStickers);
        setStartPosition({
          x: e.clientX,
          y: e.clientY
        });
      }
    };
    
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setActiveSticker(null);
    };
    
    // 添加全局事件监听
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    // 清理函数
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, activeSticker, selectedStickers, startPosition, photoGridRef]);

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
    
    // 返回适合React style对象的格式
    if (colorOption.color === 'transparent') {
      return 'none';
    } else if (colorOption.id === 'rainbow') {
      // 不返回字符串，而是返回对象
      return {
        border: '5px solid transparent',
        backgroundImage: colorOption.color,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      };
    } else {
      return `5px solid ${colorOption.color}`;
    }
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
                style={typeof getBorderColor() === 'object' 
                  ? getBorderColor() as React.CSSProperties 
                  : { border: getBorderColor() as string }
                }
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <div className="grid grid-cols-1 gap-1">
                  {photoData && photoData.photos && photoData.photos.map((photo: string, index: number) => (
                    <div key={index} className="relative">
                      <Image 
                        src={photo} 
                        alt={`Photo ${index+1}`} 
                        className="w-full rounded-sm"
                        style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                        width={500}
                        height={500}
                        unoptimized
                      />
                    </div>
                  ))}
                  
                  {/* Stickers layer */}
                  {selectedStickers.map((sticker, index) => (
                    <div 
                      key={index}
                      className={`absolute cursor-move ${activeSticker === index ? 'ring-2 ring-pink-500' : ''}`}
                      style={{
                        top: `${sticker.y}%`,
                        left: `${sticker.x}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10 + index,
                        fontSize: '24px',
                        transition: isDragging && activeSticker === index ? 'none' : 'all 0.1s ease'
                      }}
                      onMouseDown={(e) => handleMouseDown(e, index)}
                    >
                      <div className="relative group">
                        <span style={{ fontSize: `${sticker.scale * 24}px` }}>
                          {stickers.find(s => s.id === sticker.id)?.icon || '❤️'}
                        </span>
                        
                        {/* 删除按钮 - 悬停时显示 */}
                        <button 
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center 
                                     opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSticker(index);
                          }}
                        >
                          <FaTrash size={8} />
                        </button>
                      </div>
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
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-semibold">Stickers for Your Online Photo Booth</h3>
                  </div>
                  
                  {/* 添加撤销/重做按钮在贴纸区域的顶部 */}
                  <div className="flex justify-center gap-3 mb-4">
                    <button
                      className={`flex-1 px-3 py-2 rounded-md flex items-center justify-center ${canUndo ? 'bg-white text-pink-600 border border-pink-200 hover:bg-pink-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      onClick={handleUndo}
                      disabled={!canUndo}
                      title="Undo last sticker action"
                    >
                      <FaUndo className="mr-2" size={14} />
                      Undo Stickers
                    </button>
                    <button
                      className={`flex-1 px-3 py-2 rounded-md flex items-center justify-center ${canRedo ? 'bg-white text-pink-600 border border-pink-200 hover:bg-pink-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      onClick={handleRedo}
                      disabled={!canRedo}
                      title="Redo last undone sticker action"
                    >
                      <FaRedo className="mr-2" size={14} />
                      Redo Stickers
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {stickers.filter(s => s.id !== 'none').map((sticker) => (
                      <button
                        key={sticker.id}
                        className="aspect-square bg-white rounded-md flex items-center justify-center hover:bg-gray-100 p-1 text-xl shadow-sm hover:shadow-md transition-all"
                        onClick={() => handleAddSticker(sticker.id)}
                        title={`Add ${sticker.name} stickers`}
                      >
                        <span>{sticker.icon}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Click to add sticker groups, drag to adjust position. Use Undo/Redo buttons to manage sticker changes.
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