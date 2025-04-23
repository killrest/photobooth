// Template definitions for the photo booth application
export interface PhotoPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Template {
  id: string;
  name: string;
  imagePath: string;
  overlayPath?: string; // Optional overlay image that appears on top of photos
  description: string;
  photoPositions: PhotoPosition[];
  thumbnail?: string;
  aspectRatio?: number;
  backgroundColor?: string; // Optional background color
}

// Define templates
const templates: Template[] = [
  {
    id: 'default',
    name: 'Classic Strip',
    imagePath: '', // No background image for the default template
    description: 'Classic 4-photo strip with customizable border',
    photoPositions: [
      // Default template doesn't use positions as it's just a vertical stack
    ],
    aspectRatio: 0.25, // 1:4 aspect ratio
  },
  {
    id: 'grid4',
    name: 'Grid Layout',
    imagePath: '/templates/grid4_bg.png', // 四宫格背景图片
    overlayPath: '', // No overlay image
    backgroundColor: '#FFF5F7', // Light pink background (fallback if image fails to load)
    description: 'Four-photo grid layout in 2x2 arrangement',
    photoPositions: [
      // Create 2x2 arrangement of four 1:1 ratio positions in the top two-thirds area
      // 5% margin, each photo takes up 42.5% width, 5% spacing between photos
      { x: 5, y: 5, width: 42.5, height: 42.5 },    // Top left
      { x: 52.5, y: 5, width: 42.5, height: 42.5 },  // Top right
      { x: 5, y: 52.5, width: 42.5, height: 42.5 },  // Bottom left
      { x: 52.5, y: 52.5, width: 42.5, height: 42.5 }, // Bottom right
    ],
    aspectRatio: 1.5, // Template height is 1.5x its width, bottom third for decoration
  },
  // You can add more templates here in the future
  {
    id: 'grid4_star',
    name: 'Starry Sky Layout',
    imagePath: '/templates/grid4_star.jpg', // Use .jpg extension to match actual file
    overlayPath: '',
    backgroundColor: '#000033', // Deep blue background (fallback if image fails to load)
    description: 'Four-photo starry sky layout with vertical arrangement',
    photoPositions: [
      // Vertically arranged photo positions with optimized spacing
      { x: 10, y: 5, width: 80, height: 15 },     // First photo
      { x: 10, y: 25, width: 80, height: 15 },    // Second photo
      { x: 10, y: 45, width: 80, height: 15 },    // Third photo
      { x: 10, y: 65, width: 80, height: 15 },    // Fourth photo
    ],
    aspectRatio: 3, // Adjusted aspect ratio for better visual balance
  }
];

export default templates; 