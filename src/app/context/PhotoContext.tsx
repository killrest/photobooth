'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义照片数据类型
export interface PhotoData {
  photos: string[]; // Base64编码的图片
  selectedFilter: string;
  selectedFrame: string;
  stickers: {
    id: string;
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}

// 定义上下文类型
interface PhotoContextType {
  photoData: PhotoData;
  setPhotos: (photos: string[]) => void;
  setSelectedFilter: (filter: string) => void;
  setSelectedFrame: (frame: string) => void;
  addSticker: (sticker: { src: string }) => void;
  updateSticker: (id: string, updates: Partial<PhotoData['stickers'][0]>) => void;
  removeSticker: (id: string) => void;
  resetPhotoData: () => void;
}

// 创建上下文
const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

// 默认照片数据
const defaultPhotoData: PhotoData = {
  photos: [],
  selectedFilter: 'none',
  selectedFrame: 'none',
  stickers: [],
};

// 上下文提供器组件
export function PhotoProvider({ children }: { children: ReactNode }) {
  const [photoData, setPhotoData] = useState<PhotoData>(defaultPhotoData);

  // 设置照片
  const setPhotos = (photos: string[]) => {
    setPhotoData(prev => ({ ...prev, photos }));
  };

  // 设置滤镜
  const setSelectedFilter = (filter: string) => {
    setPhotoData(prev => ({ ...prev, selectedFilter: filter }));
  };

  // 设置边框
  const setSelectedFrame = (frame: string) => {
    setPhotoData(prev => ({ ...prev, selectedFrame: frame }));
  };

  // 添加贴纸
  const addSticker = (sticker: { src: string }) => {
    const newSticker = {
      id: `sticker-${Date.now()}`,
      src: sticker.src,
      x: 50, // 默认位置 - 中心X
      y: 50, // 默认位置 - 中心Y
      width: 100,
      height: 100,
    };
    
    setPhotoData(prev => ({
      ...prev,
      stickers: [...prev.stickers, newSticker],
    }));
  };

  // 更新贴纸
  const updateSticker = (id: string, updates: Partial<PhotoData['stickers'][0]>) => {
    setPhotoData(prev => ({
      ...prev,
      stickers: prev.stickers.map(sticker => 
        sticker.id === id ? { ...sticker, ...updates } : sticker
      ),
    }));
  };

  // 删除贴纸
  const removeSticker = (id: string) => {
    setPhotoData(prev => ({
      ...prev,
      stickers: prev.stickers.filter(sticker => sticker.id !== id),
    }));
  };

  // 重置照片数据
  const resetPhotoData = () => {
    setPhotoData(defaultPhotoData);
  };

  return (
    <PhotoContext.Provider
      value={{
        photoData,
        setPhotos,
        setSelectedFilter,
        setSelectedFrame,
        addSticker,
        updateSticker,
        removeSticker,
        resetPhotoData,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
}

// 使用上下文的钩子
export function usePhotoContext() {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhotoContext must be used within a PhotoProvider');
  }
  return context;
} 