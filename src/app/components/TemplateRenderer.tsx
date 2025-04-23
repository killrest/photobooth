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
}

const TemplateRenderer = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ template, photos, selectedStickers, stickersMap, borderColor, borderStyle, onStickerMouseDown }, ref) => {
    // Removed unused state variables
    
    // For measuring drag events relative to container
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    // Default template (original photo strip)
    if (template.id === 'default') {
      return (
        <div 
          ref={ref}
          className="relative bg-white p-2 rounded-md w-full max-w-[280px]"
          style={borderStyle || { border: borderColor || 'none' }}
        >
          <div className="grid grid-cols-1 gap-1">
            {photos.map((photo: string, index: number) => (
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
                key={`sticker-${index}`}
                className="absolute cursor-move"
                style={{
                  top: `${sticker.y}%`,
                  left: `${sticker.x}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10 + index,
                  fontSize: '24px'
                }}
                onMouseDown={(e) => onStickerMouseDown && onStickerMouseDown(e, index)}
              >
                <span style={{ fontSize: `${sticker.scale * 24}px` }}>
                  {stickersMap[sticker.id] || '❤️'}
                </span>
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
            padding: '0'
          } : borderStyle || { border: borderColor || 'none' }),
        }}
      >
        {/* Template background image - rendered first as the bottom layer */}
        {template.imagePath && (
          <div className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${template.imagePath})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 1,
              width: '100%',
              height: '100%'
            }}
          />
        )}
        
        {/* Positioned photos - rendered above the background */}
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
            zIndex: 5, // Make sure photos are above the template background but below stickers and overlay
            position: 'absolute',
            ...(isGrid4 ? { 
              border: 'none',
              boxShadow: 'none'
            } : {}),
            ...(isGrid4Star ? {
              border: '3px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            } : {})
          };
          
          return (
            <div 
              key={`photo-${index}`}
              className={`absolute ${isGrid4 ? '' : (isGrid4Star ? 'rounded-lg' : 'rounded-sm')}`}
              style={photoContainerStyle}
            >
              <div className="w-full h-full relative">
                <Image 
                  src={photos[index]} 
                  alt={`Photo ${index+1}`}
                  className={`w-full h-full ${isGrid4Star ? 'rounded-[5px]' : ''}`}
                  style={{ objectFit: 'cover' }}  // 确保照片填充整个区域且保持比例
                  width={500}
                  height={500}
                  unoptimized
                />
              </div>
            </div>
          );
        })}
        
        {/* Optional overlay image - rendered above photos but below stickers */}
        {template.overlayPath && (
          <Image 
            src={template.overlayPath} 
            alt={`${template.name} overlay`}
            className="w-full h-full object-contain absolute top-0 left-0"
            style={{ zIndex: 8 }}
            width={500}
            height={1500}
            priority
            unoptimized
          />
        )}
        
        {/* Stickers layer - rendered at the very top */}
        {selectedStickers.map((sticker, index) => (
          <div 
            key={`sticker-${index}`}
            className="absolute cursor-move"
            style={{
              top: `${sticker.y}%`,
              left: `${sticker.x}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10 + index, // Stickers are always on top
              fontSize: '24px'
            }}
            onMouseDown={(e) => onStickerMouseDown && onStickerMouseDown(e, index)}
          >
            <span style={{ fontSize: `${sticker.scale * 24}px` }}>
              {stickersMap[sticker.id] || '❤️'}
            </span>
          </div>
        ))}
      </div>
    );
  }
);

TemplateRenderer.displayName = 'TemplateRenderer';

export default TemplateRenderer; 