'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import { Template } from '../constants/templates';

interface TemplateRendererProps {
  template: Template;
  photos: string[];
  selectedStickers: {id: string, x: number, y: number, scale: number}[];
  stickersMap: {[key: string]: string};
  borderColor?: string;
  borderStyle?: React.CSSProperties;
  onStickerMouseDown?: (e: React.MouseEvent, index: number) => void;
  onStickerDelete?: (index: number) => void;
}

const TemplateRenderer = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ template, photos, selectedStickers, stickersMap, borderColor, borderStyle, onStickerMouseDown, onStickerDelete }, ref) => {
    // For measuring drag events relative to container
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    // Default template (original photo strip)
    if (template.id === 'default') {
      return (
        <div 
          ref={ref}
          className="relative bg-white p-2 rounded-md w-full max-w-[280px]"
          style={{
            position: 'relative',
            overflow: 'hidden',
            ...(template.outerBorderWidth && template.outerBorderColor ? {
              border: `${template.outerBorderWidth}px solid ${template.outerBorderColor}`,
              borderRadius: template.outerBorderRadius ? `${template.outerBorderRadius}px` : '0.375rem'
            } : borderStyle || { border: borderColor || 'none' })
          }}
        >
          {/* 照片层 - 底层 */}
          <div className="grid grid-cols-1 gap-1" style={{ position: 'relative', zIndex: 1 }}>
            {photos.map((photo: string, index: number) => (
              <div key={index} className="relative">
                <Image 
                  src={photo} 
                  alt={`Photo ${index+1}`} 
                  className="w-full rounded-sm"
                  style={{ 
                    aspectRatio: '1/1', 
                    objectFit: 'cover',
                    ...(template.photoBorderWidth && template.photoBorderColor ? {
                      border: `${template.photoBorderWidth}px solid ${template.photoBorderColor}`
                    } : {})
                  }}
                  width={500}
                  height={500}
                  unoptimized
                />
              </div>
            ))}
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
                  borderRadius: '2px'
                }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white opacity-10"></div>
              </>
            )}
          </div>
          
          {/* 贴纸层 - 顶层 */}
          <div className="absolute inset-0" style={{ zIndex: 10 }}>
            {selectedStickers.map((sticker, index) => (
              <div 
                key={`sticker-${index}`}
                className="absolute cursor-move group"
                style={{
                  top: `${sticker.y}%`,
                  left: `${sticker.x}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: '24px'
                }}
                onMouseDown={(e) => {
                  // 如果点击的是删除按钮，阻止拖拽事件
                  if ((e.target as HTMLElement).closest('.sticker-delete-btn')) {
                    return;
                  }
                  onStickerMouseDown && onStickerMouseDown(e, index);
                }}
              >
                <span className="group-hover:ring-2 group-hover:ring-amber-400 group-hover:ring-opacity-50 rounded-full p-0.5" style={{ fontSize: `${sticker.scale * 24}px` }}>
                  {stickersMap[sticker.id] || '❤️'}
                </span>
                {onStickerDelete && (
                  <button 
                    className="sticker-delete-btn absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 active:bg-red-700 text-xs"
                    onClick={() => onStickerDelete(index)}
                    title="Delete sticker"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
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
          if (containerRef) {
            containerRef.current = el;
          }
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
            ...(Object.keys(outerBorderStyles).length === 0 ? borderStyle || { border: borderColor || 'none' } : {})
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
                    className={`w-full h-full`}
                    style={{ 
                      objectFit: 'cover',
                      borderRadius: template.photoBorderRadius 
                        ? template.photoBorderWidth 
                          ? `${template.photoBorderRadius - template.photoBorderWidth}px` 
                          : `${template.photoBorderRadius-2}px` 
                        : isGrid4Star ? '5px' : '0'
                    }}
                    width={500}
                    height={500}
                    unoptimized
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 模板层 - 完全覆盖在照片之上 */}
        <div className="absolute inset-0" style={{ zIndex: 5 }}>
          {/* 背景图片 - 在低z-index层 */}
          {template.imagePath && (
            <Image 
              src={template.imagePath}
              alt={`${template.name} background`}
              className="absolute inset-0"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                zIndex: 2
              }}
              width={500}
              height={1500}
              priority
              unoptimized
            />
          )}
          
          {/* 模板叠加图片 - 位于照片上方 */}
          {template.templateImagePath && (
            <Image 
              src={template.templateImagePath}
              alt={`${template.name} template overlay`}
              className="absolute inset-0"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                zIndex: 6,
                pointerEvents: 'none'
              }}
              width={500}
              height={1500}
              priority
              unoptimized
            />
          )}
          
          {/* 可选的额外叠加图片 */}
          {template.overlayPath && (
            <Image 
              src={template.overlayPath} 
              alt={`${template.name} overlay`}
              className="w-full h-full object-contain absolute top-0 left-0"
              style={{ zIndex: 7 }}
              width={500}
              height={1500}
              priority
              unoptimized
            />
          )}
        </div>
        
        {/* 贴纸层 - 最顶层 */}
        <div className="absolute inset-0" style={{ zIndex: 10 }}>
          {selectedStickers.map((sticker, index) => (
            <div 
              key={`sticker-${index}`}
              className="absolute cursor-move group"
              style={{
                top: `${sticker.y}%`,
                left: `${sticker.x}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: '24px'
              }}
              onMouseDown={(e) => {
                // 如果点击的是删除按钮，阻止拖拽事件
                if ((e.target as HTMLElement).closest('.sticker-delete-btn')) {
                  return;
                }
                onStickerMouseDown && onStickerMouseDown(e, index);
              }}
            >
              <span className="group-hover:ring-2 group-hover:ring-amber-400 group-hover:ring-opacity-50 rounded-full p-0.5" style={{ fontSize: `${sticker.scale * 24}px` }}>
                {stickersMap[sticker.id] || '❤️'}
              </span>
              {onStickerDelete && (
                <button 
                  className="sticker-delete-btn absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 active:bg-red-700 text-xs"
                  onClick={() => onStickerDelete(index)}
                  title="Delete sticker"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

TemplateRenderer.displayName = 'TemplateRenderer';

export default TemplateRenderer; 