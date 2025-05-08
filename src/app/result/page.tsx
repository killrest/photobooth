'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaDownload, FaRedoAlt, FaUndo, FaRedo } from 'react-icons/fa';
import { usePhotoContext } from '../context/PhotoContext';
import { toPng } from 'html-to-image';
import Layout from '../components/Layout';
import TemplateRenderer from '../components/TemplateRenderer';
import TemplateSelector from '../components/TemplateSelector';
import templates from '../constants/templates';
import Image from 'next/image';

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

// Filter options to match those in the photo page
const filterOptions = [
  { id: 'normal', name: 'Default', style: '' },
  { id: 'bw', name: 'B&W', style: 'grayscale(100%)' },
  { id: 'vintage', name: 'Vintage', style: 'sepia(80%)' },
  { id: 'oldPhoto', name: 'Old Photo', style: 'sepia(50%) contrast(120%)' },
  { id: 'amber', name: 'Amber', style: 'sepia(80%) hue-rotate(-20deg)' },
  { id: 'nocturne', name: 'Night', style: 'brightness(0.8) contrast(120%) saturate(1.2) hue-rotate(180deg)' },
  { id: 'test', name: 'Test', style: 'brightness(0.8) url(#paperTextureFilter)' },
  { id: 'paperTexture', name: 'Paper Texture', style: 'sepia(80%) contrast(110%) brightness(115%) grayscale(30%)' },
  { id: 'vintageFilm', name: 'Vintage Film', style: 'sepia(80%) contrast(110%) brightness(115%) grayscale(30%)' },
];

// 贴纸选项
const stickerOptions = [
  { id: 'heart', src: '/stickers/heart.png', name: 'Heart' },
  { id: 'star', src: '/stickers/star.png', name: 'Star' },
  { id: 'smile', src: '/stickers/smile.png', name: 'Smile' },
  { id: 'flower', src: '/stickers/flower.png', name: 'Flower' },
  { id: 'crown', src: '/stickers/crown.png', name: 'Crown' },
  { id: 'ribbon', src: '/stickers/ribbon.png', name: 'Ribbon' },
  { id: 'cloud', src: '/stickers/cloud.png', name: 'Cloud' },
  { id: 'balloon', src: '/stickers/balloon.png', name: 'Balloon' },
];

// 贴纸映射对象
const stickersMap: {[key: string]: string} = {};
stickerOptions.forEach(sticker => {
  stickersMap[sticker.id] = sticker.src;
});

// 定义历史记录的操作类型
type HistoryAction = {
  type: 'sticker_add' | 'sticker_update' | 'sticker_delete' | 'template_change' | 'color_change';
  data: any;
  previousData?: any;
};

interface HistoryButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  title: string;
}

// 历史记录按钮组件
const HistoryButton = ({ onClick, disabled, children, title }: HistoryButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
      disabled 
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
        : 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
    }`}
  >
    {children}
  </button>
);

// 历史记录
const addHistoryAction = (
  history: HistoryAction[], 
  historyIndex: number,
  action: HistoryAction
): [HistoryAction[], number] => {
  // 如果我们在历史记录中间做了新的更改，需要删除后面的历史记录
  const newHistory = history.slice(0, historyIndex + 1);
  return [
    [...newHistory, action],
    newHistory.length // 新的历史索引
  ];
};

// 小节标题组件
const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-md font-semibold mb-2 text-gray-800 border-b border-gray-200 pb-1">
    {title}
  </h3>
);

const ResultPage = () => {
  const router = useRouter();
  const { photoData } = usePhotoContext();
  const [selectedColor, setSelectedColor] = useState('lightBlue');
  const [selectedStickers, setSelectedStickers] = useState<{id: string, x: number, y: number, scale: number}[]>([]);
  const photoGridRef = useRef<HTMLDivElement>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('default');
  
  // 历史记录状态
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // 拖拽状态相关
  const [activeSticker, setActiveSticker] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  
  // 使用useRef保存相关状态来避免循环依赖
  const stateRef = useRef({
    isDragging: false,
    activeSticker: null as number | null,
    selectedStickers: [] as {id: string, x: number, y: number, scale: number}[],
    startPosition: { x: 0, y: 0 }
  });
  
  // 在每次渲染时更新引用中的值
  useEffect(() => {
    stateRef.current = {
      isDragging,
      activeSticker,
      selectedStickers,
      startPosition
    };
  }, [isDragging, activeSticker, selectedStickers, startPosition]);

  // Check if photos exist, redirect to photo page if not
  useEffect(() => {
    if (!photoData || !photoData.photos || photoData.photos.length === 0) {
      router.push('/photo');
    }
  }, [photoData, router]);

  // Find the selected template
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Select template
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  // Select frame color
  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    // Switch to the default template when a color is selected
    setSelectedTemplateId('default');
  };
  
  // Get filter style based on the selected filter
  const getFilterStyle = () => {
    const filter = filterOptions.find(f => f.id === photoData.selectedFilter);
    return filter?.style || '';
  };

  // 纸纹理是否显示
  const showPaperTexture = photoData.selectedFilter === 'paperTexture';

  // Get the border color for the frame
  const getBorderColor = () => {
    const color = frameColors.find(c => c.id === selectedColor)?.color;
    
    if (selectedColor === 'none') {
      return { border: 'none' };
    }
    
    if (selectedColor === 'rainbow') {
      return {
        borderWidth: '10px',
        borderStyle: 'solid',
        borderImage: `${color} 1`,
        borderRadius: '0.5rem',
        // 由于彩虹边框是一个渐变，我们使用淡色作为背景色
        backgroundColor: '#f8f9fa'
      };
    }
    
    return {
      border: `10px solid ${color}`,
      borderRadius: '0.5rem',
      backgroundColor: color // 添加背景色与边框同色
    };
  };

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
      type: 'sticker_add',
      data: newStickers
    };
    
    // 如果已经撤销过操作，需要清除那些被撤销的操作历史
    const newHistory = history.slice(0, historyIndex + 1).concat(newAction);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // 删除单个贴纸
  const handleDeleteSticker = (index: number) => {
    // 保存要删除的贴纸信息，用于历史记录
    const deletedSticker = selectedStickers[index];
    
    // 创建新的贴纸数组，移除指定索引的贴纸
    const newStickers = [...selectedStickers];
    newStickers.splice(index, 1);
    setSelectedStickers(newStickers);
    
    // 记录删除操作到历史
    const newAction: HistoryAction = {
      type: 'sticker_delete',
      data: deletedSticker
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
    
    if (actionToUndo.type === 'sticker_add') {
      // 撤销添加操作：移除添加的贴纸
      const stickerCount = actionToUndo.data.length;
      setSelectedStickers(prevStickers => prevStickers.slice(0, -stickerCount));
    } else if (actionToUndo.type === 'sticker_delete') {
      // 撤销删除操作：恢复删除的贴纸
      const stickerToRestore = actionToUndo.data;
      const insertIndex = selectedStickers.length;
      
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
    
    if (actionToRedo.type === 'sticker_add') {
      // 重做添加操作：重新添加贴纸
      setSelectedStickers(prevStickers => [...prevStickers, ...actionToRedo.data]);
    } else if (actionToRedo.type === 'sticker_delete') {
      // 重做删除操作：再次删除贴纸
      const index = selectedStickers.findIndex(s => s.id === actionToRedo.data.id);
      if (index >= 0) {
        const newStickers = [...selectedStickers];
        newStickers.splice(index, 1);
        setSelectedStickers(newStickers);
      }
    }
    
    // 更新历史索引
    setHistoryIndex(historyIndex + 1);
  };

  // 快捷用于检查是否可以撤销/重做
  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  // 贴纸拖拽 - 鼠标按下
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    
    setActiveSticker(index);
    setIsDragging(true);
    
    // 记录开始位置
    setStartPosition({
      x: e.clientX,
      y: e.clientY
    });
    
    // 添加全局鼠标事件
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  };

  // Enable sticker dragging in the TemplateRenderer
  const handleTemplateMouseDown = (e: React.MouseEvent, index: number) => {
    handleMouseDown(e, index);
  };
  
  // 全局鼠标移动处理 - 用于在拖出元素范围时继续跟踪
  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    const { isDragging, activeSticker, selectedStickers, startPosition } = stateRef.current;
    
    if (!isDragging || activeSticker === null) return;
    
    e.preventDefault();
    
    const photoGridElement = photoGridRef.current;
    if (!photoGridElement) return;
    
    const rect = photoGridElement.getBoundingClientRect();
    
    // 计算移动的像素
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    
    // 将像素转换为百分比
    const percentX = (deltaX / rect.width) * 100;
    const percentY = (deltaY / rect.height) * 100;
    
    // 更新贴纸位置
    const updatedStickers = [...selectedStickers];
    const sticker = updatedStickers[activeSticker];
    
    updatedStickers[activeSticker] = {
      ...sticker,
      x: Math.max(0, Math.min(100, sticker.x + percentX)),
      y: Math.max(0, Math.min(100, sticker.y + percentY))
    };
    
    setSelectedStickers(updatedStickers);
    setStartPosition({
      x: e.clientX,
      y: e.clientY
    });
  }, [photoGridRef]);

  // 全局鼠标松开处理
  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveSticker(null);
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [handleGlobalMouseMove]);

  // 确保在组件卸载时移除全局事件监听
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  // 下载照片
  const handleDownload = async () => {
    if (!photoGridRef.current) return;
    
      try {
      const dataUrl = await toPng(photoGridRef.current, { quality: 0.95 });
        
      // 创建下载链接
        const link = document.createElement('a');
      link.download = 'kacakacabooth-photobooth.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
      console.error('Error generating image', error);
    }
  };

  // 重新拍照
  const handleRetake = () => {
    router.push('/photo');
  };

  // 选择贴纸数量范围 - 根据贴纸类型决定
  const getStickerCountRange = (stickerId: string): [number, number] => {
    // 针对不同贴纸类型，设定不同的数量范围
    switch(stickerId) {
      case 'heart':
      case 'star':
      case 'smile':
        return [3, 5]; // 这些小贴纸可以多放几个
      case 'flower':
        return [2, 4]; // 这些中等贴纸适量放置
      case 'crown':
        return [1, 2]; // 这些大贴纸或主体贴纸少放
      default:
        return [1, 3]; // 默认范围
    }
  };

  return (
    <Layout>
      {/* SVG Filter Definitions */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <defs>
          <filter id="paperTextureFilter">
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
          </filter>
          <filter id="paperTextureFilter2">
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-4">
          <Link href="/" className="flex items-center text-gray-700 hover:text-amber-700 transition text-sm">
            <FaArrowLeft className="mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8 text-amber-700">Free Online Photo Booth - Create & Customize Your Photo Strip</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side photo display */}
            <div className="md:w-2/5 flex flex-col items-center justify-start">
              <TemplateRenderer
                ref={photoGridRef}
                template={selectedTemplate}
                photos={photoData?.photos || []}
                selectedStickers={selectedStickers}
                stickersMap={stickersMap}
                borderStyle={getBorderColor() as React.CSSProperties}
                onStickerMouseDown={handleTemplateMouseDown}
                onStickerDelete={handleDeleteSticker}
                filterStyle={getFilterStyle()}
                showPaperTexture={showPaperTexture}
              />
            </div>
            
            {/* Right side tools */}
            <div className="md:w-3/5">
              <div className="bg-cream-50 bg-opacity-70 rounded-lg p-5">
                {/* Frame color - always visible */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-3 text-amber-700">Frame Color</h3>
                  <div className="grid grid-cols-8 gap-2">
                    {frameColors.filter(color => color.id !== 'none' && color.id !== 'rainbow').map((color) => (
                      <button
                        key={color.id}
                        className={`w-9 h-9 rounded-full shadow-md border border-gray-200 ${selectedColor === color.id ? 'ring-2 ring-amber-500 ring-offset-2' : 'hover:shadow-lg'} transition-all`}
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
                
                {/* Template selection */}
                <TemplateSelector
                  templates={templates.filter(t => t.id !== 'default')}
                  selectedTemplateId={selectedTemplateId}
                  onSelectTemplate={handleTemplateSelect}
                />
                
                {/* Stickers */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-semibold text-amber-700">Stickers</h3>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {stickerOptions.map((sticker) => (
                      <button
                        key={sticker.id}
                        className="aspect-square bg-white rounded-md flex items-center justify-center hover:bg-gray-100 p-1 text-xl shadow-sm hover:shadow-md transition-all"
                        onClick={() => handleAddSticker(sticker.id)}
                        title={`Add ${sticker.name} stickers`}
                      >
                        {sticker.id === 'heart' && <span className="text-2xl">❤️</span>}
                        {sticker.id === 'star' && <span className="text-2xl">⭐</span>}
                        {sticker.id === 'smile' && <span className="text-2xl">😊</span>}
                        {sticker.id === 'flower' && <span className="text-2xl">🌸</span>}
                        {sticker.id === 'crown' && <span className="text-2xl">👑</span>}
                        {sticker.id === 'ribbon' && <span className="text-2xl">🎀</span>}
                        {sticker.id === 'cloud' && <span className="text-2xl">☁️</span>}
                        {sticker.id === 'balloon' && <span className="text-2xl">🎈</span>}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Click to add sticker groups, drag to adjust position. Hover over any sticker to delete it individually. Use Undo/Redo buttons to manage all sticker changes.
                  </p>
                  
                  {/* Undo/Redo buttons - Moved below stickers */}
                  <div className="flex justify-center gap-3 mt-4 mb-2">
                    <button
                      className={`flex-1 px-3 py-2.5 rounded-full flex items-center justify-center transition-all shadow-sm ${
                        canUndo 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-md hover:from-amber-600 hover:to-amber-700' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={handleUndo}
                      disabled={!canUndo}
                      title="Undo last sticker action"
                    >
                      <FaUndo className="mr-2" size={14} />
                      Undo
                    </button>
                    <button
                      className={`flex-1 px-3 py-2.5 rounded-full flex items-center justify-center transition-all shadow-sm ${
                        canRedo 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-md hover:from-amber-600 hover:to-amber-700' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={handleRedo}
                      disabled={!canRedo}
                      title="Redo last undone sticker action"
                    >
                      <FaRedo className="mr-2" size={14} />
                      Redo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom action buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              className="px-10 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full shadow-md flex items-center justify-center hover:from-amber-600 hover:to-amber-700 transition text-sm font-bold"
              onClick={handleDownload}
            >
              <FaDownload className="mr-2" />
              Download Photo Strip
            </button>
            <button
              className="px-10 py-3 bg-white border border-amber-500 text-amber-700 rounded-full shadow-md flex items-center justify-center hover:bg-cream-100 transition text-sm font-bold"
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