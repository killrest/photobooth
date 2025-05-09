'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import { Template } from '../constants/templates';

interface TemplateRendererProps {
  template: Template;
  photos: string[];
  selectedStickers: {id: string, x: number, y: number, scale: number}[];
  stickersMap: {[key: string]: string};
  borderStyle?: React.CSSProperties;
  onStickerMouseDown?: (e: React.MouseEvent, index: number) => void;
  onStickerDelete?: (index: number) => void;
  filterStyle?: string;
  hasTexture?: boolean;
  textureUrl?: string | null;
  textureOpacity?: number;
}

const TemplateRenderer = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ template, photos, selectedStickers, stickersMap, borderStyle, onStickerMouseDown, onStickerDelete, filterStyle = '', hasTexture = false, textureUrl = null, textureOpacity = 0.5 }, ref) => {
    // For measuring drag events relative to container
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    
    // This function determines if an image URL was captured using html2canvas
    // html2canvas images start with data:image/jpeg and have characteristic attributes
    const isHtml2CanvasImage = (imageUrl: string): boolean => {
      // First check if it's a data URL
      if (!Boolean(imageUrl && imageUrl.startsWith('data:image/'))) {
        return false;
      }

      // For paperTexture filter, we're now manually applying the filter and texture
      // Since it's processed by our custom applyPaperTextureToImage function,
      // all these images should be considered as already processed
      return true;
    };

    // Format current date as YYYY-MM-DD
    const formatDate = () => {
      const now = new Date();
      return now.toISOString().split('T')[0];
    };

    // Format current time as HH:MM AM/PM
    const formatTime = () => {
      const now = new Date();
      return now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
    
    // Default template (original photo strip)
    if (template.id === 'default') {
      // 提取borderStyle中的backgroundColor属性，如果存在则用于背景色
      const backgroundColor = borderStyle && 'backgroundColor' in borderStyle 
        ? borderStyle.backgroundColor as string
        : 'white';
        
      // 判断是否使用白色文本（当背景色是深色时）
      const isDarkBackground = 
        backgroundColor === '#000000' || // black
        backgroundColor === 'rgb(0, 0, 0)' || 
        backgroundColor === '#800080' || // purple
        backgroundColor === 'rgb(128, 0, 128)' ||
        backgroundColor === '#008000' || // green
        backgroundColor === 'rgb(0, 128, 0)' ||
        backgroundColor === '#808080' || // gray
        backgroundColor === 'rgb(128, 128, 128)' ||
        backgroundColor === '#654321' || // brown
        backgroundColor === 'rgb(101, 67, 33)' ||
        backgroundColor === '#000080' || // navy
        backgroundColor === 'rgb(0, 0, 128)' ||
        backgroundColor === '#800000' || // maroon
        backgroundColor === 'rgb(128, 0, 0)';
      
      // 文本颜色类名
      const textColorClass = isDarkBackground ? "text-white" : "text-gray-500";
        
      return (
        <div 
          ref={ref}
          className="relative p-4 rounded-md w-full max-w-[280px]"
          style={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: backgroundColor, // 使用提取的背景色
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)', // 增加阴影效果
            ...(template.outerBorderWidth && template.outerBorderColor ? {
              border: `${template.outerBorderWidth}px solid ${template.outerBorderColor}`,
              borderRadius: template.outerBorderRadius ? `${template.outerBorderRadius}px` : '0.375rem'
            } : borderStyle || { border: 'none' })
          }}
        >
          {/* 照片层 - 底层 */}
          <div className="grid grid-cols-1 gap-3" style={{ position: 'relative', zIndex: 1 }}>
            {photos.map((photo: string, index: number) => (
              <div key={index} className="relative shadow-md">
                <Image 
                  src={photo} 
                  alt={`Photo ${index+1}`} 
                  className="w-full rounded-sm"
                  style={{ 
                    aspectRatio: '3/2', 
                    objectFit: 'cover',
                    border: 'none', // 移除照片白色边框
                    transform: 'scaleX(-1)', // 镜像翻转修复
                    filter: !isHtml2CanvasImage(photo) ? filterStyle : '', // Only apply filter if not already processed
                    ...(template.photoBorderWidth && template.photoBorderColor ? {
                      border: `${template.photoBorderWidth}px solid ${template.photoBorderColor}`
                    } : {})
                  }}
                  width={500}
                  height={500}
                  unoptimized
                />
                
                {/* 相纸纹理覆盖层 */}
                {hasTexture && photo && !isHtml2CanvasImage(photo) && (
                  <div 
                    className="absolute inset-0" 
                    style={{
                      backgroundImage: `url(${textureUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%",
                      height: "100%",
                      opacity: textureOpacity,
                      mixBlendMode: "overlay",
                      pointerEvents: "none"
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* 底部品牌和时间标记 */}
          <div className={`text-center mt-2 text-xs ${textColorClass}`}>
            <p className="font-medium">Yoyobooth</p>
            <p className="text-[10px]">{formatDate()} • {formatTime()}</p>
          </div>
          
          {/* 贴纸层 - 顶层 */}
          <div className="absolute inset-0 pointer-events-none">
            {selectedStickers.map((sticker, index) => {
              // Calculate actual sticker position
              const style = {
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                transform: `translate(-50%, -50%) scale(${sticker.scale})`,
                position: 'absolute' as 'absolute',
                width: '60px',
                height: '60px',
                pointerEvents: 'auto' as 'auto',
                zIndex: 100 + index,
                cursor: 'grab'
              };
              
              // 根据贴纸ID渲染对应的emoji
              const renderSticker = () => {
                switch (sticker.id) {
                  case 'heart': return '❤️';
                  case 'star': return '⭐';
                  case 'smile': return '😊';
                  case 'flower': return '🌸';
                  case 'crown': return '👑';
                  case 'ribbon': return '🎀';
                  case 'cloud': return '☁️';
                  case 'balloon': return '🎈';
                  default: return '❤️';
                }
              };
              
              return (
                <div
                  key={sticker.id}
                  style={style}
                  onMouseDown={(e) => onStickerMouseDown && onStickerMouseDown(e, index)}
                  className="sticker group"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="text-4xl">{renderSticker()}</span>
                    {onStickerDelete && (
                      <button
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStickerDelete(index);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    // Custom template with background image and positioned photos
    const isGrid4 = template.id === 'grid4';
    const isGrid4Star = template.id === 'grid4_star';
    const isGridTemplate = isGrid4 || isGrid4Star;
    
    // Prepare outer border styles
    const outerBorderStyles: React.CSSProperties = template.outerBorderWidth && template.outerBorderColor ? {
      border: `${template.outerBorderWidth}px solid ${template.outerBorderColor}`,
      borderRadius: template.outerBorderRadius ? `${template.outerBorderRadius}px` : '0.375rem'
    } : {};
    
    return (
      <div 
        ref={(el) => {
          // Handle both refs
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
          // Store in containerRef for internal use
          containerRef.current = el;
        }}
        className="relative bg-white rounded-md w-full max-w-[280px]"
        style={{ 
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: template.aspectRatio ? `1/${template.aspectRatio}` : 'auto',
          backgroundColor: template.backgroundColor || 'white',
          ...(isGridTemplate ? { 
            border: 'none',
            borderRadius: '0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            padding: '0',
            ...outerBorderStyles  // Apply outer border styles for grid templates
          } : {
            ...outerBorderStyles, // Apply outer border styles for non-grid templates
            ...(Object.keys(outerBorderStyles).length === 0 ? borderStyle || { border: 'none' } : {})
          }),
        }}
      >
        {/* 底层背景 - 作为整体容器背景 */}
        <div className="absolute inset-0" style={{ zIndex: 0, backgroundColor: template.backgroundColor || 'white' }}></div>
        
        {/* 照片层 - 位于底层但在背景之上 */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          {template.photoPositions.map((position, index) => {
            // Skip if we don't have a photo for this position
            if (!photos[index]) return null;
            
            // Calculate container style, ensure photo containers have proper proportions
            const photoContainerStyle: React.CSSProperties = {
              left: `${position.x}%`,
              top: `${position.y}%`,
              width: `${position.width}%`,
              height: isGrid4 
                ? `${position.width}%` // For grid layout template, ensure square containers (1:1 ratio)
                : `${position.height}%`, // Other templates use defined height
              overflow: 'hidden',
              position: 'absolute',
              ...(isGrid4 ? { 
                border: 'none',
                boxShadow: 'none'
              } : {}),
              ...(isGrid4Star ? {
                border: '3px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
              } : {}),
              ...(template.photoBorderRadius ? {
                borderRadius: `${template.photoBorderRadius}px`
              } : {}),
              ...(template.photoBorderWidth && template.photoBorderColor ? {
                border: `${template.photoBorderWidth}px solid ${template.photoBorderColor}`
              } : {})
            };
            
            return (
              <div 
                key={`photo-${index}`}
                className={`absolute ${isGrid4 ? '' : (isGrid4Star ? 'rounded-lg' : '')}`}
                style={photoContainerStyle}
              >
                <div className="w-full h-full relative">
                  <Image 
                    src={photos[index]} 
                    alt={`Photo ${index+1}`}
                    className="w-full h-full"
                    style={{
                      objectFit: 'cover',
                      transform: 'scaleX(-1)', // 镜像翻转修复
                      filter: !isHtml2CanvasImage(photos[index]) ? filterStyle : '', // Only apply filter if not already processed
                      ...(template.photoBorderWidth && template.photoBorderColor ? {
                        border: `${template.photoBorderWidth}px solid ${template.photoBorderColor}`
                      } : {})
                    }}
                    width={500}
                    height={500}
                    unoptimized
                  />
                  
                  {/* 相纸纹理覆盖层 */}
                  {hasTexture && photos[index] && !isHtml2CanvasImage(photos[index]) && (
                    <div 
                      className="absolute inset-0" 
                      style={{
                        backgroundImage: `url(${textureUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "100%",
                        opacity: textureOpacity,
                        mixBlendMode: "overlay",
                        pointerEvents: "none"
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 模板层 - 中间层，位于照片之上但贴纸之下 */}
        <div className="absolute inset-0" style={{ zIndex: 5 }}>
          {/* 默认模板使用一个简单的装饰性边框作为模板 */}
          {template.templateImagePath ? (
            <Image 
              src={template.templateImagePath}
              alt={`${template.name} template overlay`}
              className="absolute inset-0"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
              width={500}
              height={500}
              priority
              unoptimized
            />
          ) : (
            <>
              <div className="absolute inset-0" style={{ 
                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
                borderRadius: '6px' // 增加边框圆角
              }}></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white opacity-10"></div>
            </>
          )}
        </div>
        
        {/* 贴纸层 - 顶层 */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          {selectedStickers.map((sticker, index) => {
            // Calculate actual sticker position
            const style = {
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              transform: `translate(-50%, -50%) scale(${sticker.scale})`,
              position: 'absolute' as 'absolute',
              width: '60px',
              height: '60px',
              pointerEvents: 'auto' as 'auto',
              zIndex: 100 + index,
              cursor: 'grab'
            };
            
            // 根据贴纸ID渲染对应的emoji
            const renderSticker = () => {
              switch (sticker.id) {
                case 'heart': return '❤️';
                case 'star': return '⭐';
                case 'smile': return '😊';
                case 'flower': return '🌸';
                case 'crown': return '👑';
                case 'ribbon': return '🎀';
                case 'cloud': return '☁️';
                case 'balloon': return '🎈';
                default: return '❤️';
              }
            };
            
            return (
              <div
                key={sticker.id}
                style={style}
                onMouseDown={(e) => onStickerMouseDown && onStickerMouseDown(e, index)}
                className="sticker group"
              >
                <div className="relative flex items-center justify-center">
                  <span className="text-4xl">{renderSticker()}</span>
                  {onStickerDelete && (
                    <button
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStickerDelete(index);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 底部品牌和时间标记 */}
        <div className="absolute bottom-1 right-2 text-right">
          <p className="text-[8px] font-medium text-white opacity-80 drop-shadow-md">Free PhotoBooth</p>
          <p className="text-[7px] text-white opacity-80 drop-shadow-md">{formatDate()}</p>
        </div>
      </div>
    );
  }
);

TemplateRenderer.displayName = 'TemplateRenderer';

export default TemplateRenderer;