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
  imagePath: string;  // 背景图片路径
  templateImagePath?: string;  // 模板图片路径，将显示在照片上层
  overlayPath?: string; // Optional overlay image that appears on top of photos
  description: string;
  photoPositions: PhotoPosition[];
  thumbnail?: string;
  aspectRatio?: number;
  backgroundColor?: string; // Optional background color
  photoBorderRadius?: number; // Optional border radius for photos (in pixels)
  photoBorderWidth?: number; // Optional border width for photos (in pixels)
  photoBorderColor?: string; // Optional border color for photos
  outerBorderWidth?: number; // Optional outer border width for the entire template (in pixels)
  outerBorderColor?: string; // Optional outer border color for the entire template
  outerBorderRadius?: number; // Optional border radius for the outer border (in pixels)
}

// Define templates
const templates: Template[] = [
  {
    id: 'default',
    name: 'Classic Strip',
    imagePath: '', // No background image for the default template
    // 暂时移除不存在的图片路径
    // templateImagePath: '/templates/classic-overlay.png', 
    description: 'Classic 4-photo strip with customizable border',
    photoPositions: [
      // Default template doesn't use positions as it's just a vertical stack
    ],
    aspectRatio: 0.25, // 1:4 aspect ratio
  },
  // 模板1: Summer
  {
    id: 't1',
    name: 'template 1',
    imagePath: '/templates/1.png', // 背景图片
    // 使用已有的图片作为叠加图片，这里我们使用相同的背景图片但将其作为叠加层
    // templateImagePath: '/templates/1-overlay.png', 
    overlayPath: '',
    backgroundColor: '#000033', // Deep blue background (fallback if image fails to load)
    description: 'Four-photo starry sky layout with vertical arrangement',
    photoPositions: [
      // Vertically arranged photo positions with optimized spacing
      { x: 6.52, y: 7.10, width: 86.52, height: 18.92 },     // First photo - adjusted for 16:9 ratio
      { x: 6.52, y: 26.94, width: 86.52, height: 18.92 },    // Second photo - adjusted for 16:9 ratio
      { x: 6.52, y: 46.78, width: 86.52, height: 18.92 },    // Third photo - adjusted for 16:9 ratio
      { x: 6.52, y: 66.62, width: 86.52, height: 18.92 },    // Fourth photo - adjusted for 16:9 ratio
    ],
    aspectRatio: 3, // Adjusted aspect ratio for better visual balance
    photoBorderRadius: 0, // 照片边框圆角
    photoBorderWidth: 0, // 照片边框宽度
    photoBorderColor: '#D8BFD8', //照片边框：淡紫色
    outerBorderWidth: 2, // 2px 外框宽度
    outerBorderColor: '#D8BFD8', //外框：淡紫色
    outerBorderRadius: 10, // 10px 外框圆角
  },
  // 模板2: Rounded Elegance
  {
    id: 't2',
    name: 'template 2',
    imagePath: '/templates/2.png', // 背景图片
    // templateImagePath: '/templates/2-overlay.png', 
    overlayPath: '',
    backgroundColor: '#f5f5f5', // Light gray background (fallback if image fails to load)
    description: 'Elegant template with customizable rounded corners for modern look',
    photoPositions: [
      { x: 6.52, y: 7.10, width: 86.52, height: 18.92 },     // First photo
      { x: 6.52, y: 26.94, width: 86.52, height: 18.92 },    // Second photo
      { x: 6.52, y: 46.78, width: 86.52, height: 18.92 },    // Third photo
      { x: 6.52, y: 66.62, width: 86.52, height: 18.92 },    // Fourth photo
    ],
    aspectRatio: 3,
    photoBorderRadius: 0, // 20px rounded corners for a more dramatic rounded effect
    photoBorderWidth: 0, // 3px border width
    photoBorderColor: '#FFC0CB', // 淡粉色 (Pink)
    outerBorderWidth: 2, // 2px outer border
    outerBorderColor: '#FFE4E1', // Misty Rose (雾玫瑰色) - complements the pink photo border
    outerBorderRadius: 15, // 15px rounded corners for the outer border
  },
  // // 模板3
  // {
  //   id: 't3',
  //   name: 'Template 3',
  //   imagePath: '/templates/3.png',
  //   overlayPath: '',
  //   backgroundColor: '#f5f5f5',
  //   description: 'Template with vertical photo arrangement',
  //   photoPositions: [
  //     { x: 6.52, y: 14.36, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 34.20, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 54.04, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 73.88, width: 86.52, height: 18.92 },
  //   ],
  //   aspectRatio: 3,
  //   photoBorderRadius: 0,
  //   photoBorderWidth: 0,
  //   photoBorderColor: '#D8BFD8',
  //   outerBorderWidth: 2,
  //   outerBorderColor: '#D8BFD8',
  //   outerBorderRadius: 10,
  // },
  // // 模板4
  // {
  //   id: 't4',
  //   name: 'Template 4',
  //   imagePath: '/templates/4.png',
  //   overlayPath: '',
  //   backgroundColor: '#f5f5f5',
  //   description: 'Template with vertical photo arrangement',
  //   photoPositions: [
  //     { x: 6.52, y: 7.10, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 26.94, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 46.78, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 66.62, width: 86.52, height: 18.92 },
  //   ],
  //   aspectRatio: 3,
  //   photoBorderRadius: 0,
  //   photoBorderWidth: 0,
  //   photoBorderColor: '#D8BFD8',
  //   outerBorderWidth: 2,
  //   outerBorderColor: '#D8BFD8',
  //   outerBorderRadius: 10,
  // },
  // // 模板5
  // {
  //   id: 't5',
  //   name: 'Template 5',
  //   imagePath: '/templates/5.png',
  //   overlayPath: '',
  //   backgroundColor: '#f5f5f5',
  //   description: 'Template with vertical photo arrangement',
  //   photoPositions: [
  //     { x: 6.52, y: 7.10, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 26.94, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 46.78, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 66.62, width: 86.52, height: 18.92 },
  //   ],
  //   aspectRatio: 3,
  //   photoBorderRadius: 0,
  //   photoBorderWidth: 0,
  //   photoBorderColor: '#D8BFD8',
  //   outerBorderWidth: 2,
  //   outerBorderColor: '#D8BFD8',
  //   outerBorderRadius: 10,
  // },
  // // 模板6
  // {
  //   id: 't6',
  //   name: 'Template 6',
  //   imagePath: '/templates/6.png',
  //   overlayPath: '',
  //   backgroundColor: '#f5f5f5',
  //   description: 'Template with vertical photo arrangement',
  //   photoPositions: [
  //     { x: 6.52, y: 7.10, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 26.94, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 46.78, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 66.62, width: 86.52, height: 18.92 },
  //   ],
  //   aspectRatio: 3,
  //   photoBorderRadius: 0,
  //   photoBorderWidth: 0,
  //   photoBorderColor: '#D8BFD8',
  //   outerBorderWidth: 2,
  //   outerBorderColor: '#D8BFD8',
  //   outerBorderRadius: 10,
  // },
  // // 模板7
  // {
  //   id: 't7',
  //   name: 'Template 7',
  //   imagePath: '/templates/7.png',
  //   overlayPath: '',
  //   backgroundColor: '#f5f5f5',
  //   description: 'Template with vertical photo arrangement',
  //   photoPositions: [
  //     { x: 6.52, y: 7.10, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 26.94, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 46.78, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 66.62, width: 86.52, height: 18.92 },
  //   ],
  //   aspectRatio: 3,
  //   photoBorderRadius: 0,
  //   photoBorderWidth: 0,
  //   photoBorderColor: '#D8BFD8',
  //   outerBorderWidth: 2,
  //   outerBorderColor: '#D8BFD8',
  //   outerBorderRadius: 10,
  // },
  // // 模板8
  // {
  //   id: 't8',
  //   name: 'Template 8',
  //   imagePath: '/templates/8.png',
  //   overlayPath: '',
  //   backgroundColor: '#f5f5f5',
  //   description: 'Template with vertical photo arrangement',
  //   photoPositions: [
  //     { x: 6.52, y: 7.10, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 26.94, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 46.78, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 66.62, width: 86.52, height: 18.92 },
  //   ],
  //   aspectRatio: 3,
  //   photoBorderRadius: 0,
  //   photoBorderWidth: 0,
  //   photoBorderColor: '#D8BFD8',
  //   outerBorderWidth: 2,
  //   outerBorderColor: '#D8BFD8',
  //   outerBorderRadius: 10,
  // },
  // // 模板9
  // {
  //   id: 't9',
  //   name: 'Template 9',
  //   imagePath: '/templates/9.png',
  //   overlayPath: '',
  //   backgroundColor: '#f5f5f5',
  //   description: 'Template with vertical photo arrangement',
  //   photoPositions: [
  //     { x: 6.52, y: 7.10, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 26.94, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 56.94, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 76.78, width: 86.52, height: 18.92 },
  //   ],
  //   aspectRatio: 3,
  //   photoBorderRadius: 0,
  //   photoBorderWidth: 0,
  //   photoBorderColor: '#D8BFD8',
  //   outerBorderWidth: 2,
  //   outerBorderColor: '#D8BFD8',
  //   outerBorderRadius: 10,
  // },
  // // 模板10
  // {
  //   id: 't10',
  //   name: 'Template 10',
  //   imagePath: '/templates/10.png',
  //   overlayPath: '',
  //   backgroundColor: '#f5f5f5',
  //   description: 'Template with vertical photo arrangement',
  //   photoPositions: [
  //     { x: 6.52, y: 7.10, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 26.94, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 46.78, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 66.62, width: 86.52, height: 18.92 },
  //   ],
  //   aspectRatio: 3,
  //   photoBorderRadius: 0,
  //   photoBorderWidth: 0,
  //   photoBorderColor: '#D8BFD8',
  //   outerBorderWidth: 2,
  //   outerBorderColor: '#D8BFD8',
  //   outerBorderRadius: 10,
  // },
  // // 模板11
  // {
  //   id: 't11',
  //   name: 'Template 11',
  //   imagePath: '/templates/11.png',
  //   overlayPath: '',
  //   backgroundColor: '#f5f5f5',
  //   description: 'Template with vertical photo arrangement',
  //   photoPositions: [
  //     { x: 6.52, y: 17.94, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 37.78, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 57.62, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 77.46, width: 86.52, height: 18.92 },
  //   ],
  //   aspectRatio: 3,
  //   photoBorderRadius: 0,
  //   photoBorderWidth: 0,
  //   photoBorderColor: '#D8BFD8',
  //   outerBorderWidth: 2,
  //   outerBorderColor: '#D8BFD8',
  //   outerBorderRadius: 10,
  // },
  // // 模板12
  // {
  //   id: 't12',
  //   name: 'Template 12',
  //   imagePath: '/templates/12.png',
  //   overlayPath: '',
  //   backgroundColor: '#f5f5f5',
  //   description: 'Template with vertical photo arrangement',
  //   photoPositions: [
  //     { x: 6.52, y: 14.35, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 34.19, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 54.03, width: 86.52, height: 18.92 },
  //     { x: 6.52, y: 73.87, width: 86.52, height: 18.92 },
  //   ],
  //   aspectRatio: 3,
  //   photoBorderRadius: 0,
  //   photoBorderWidth: 0,
  //   photoBorderColor: '#D8BFD8',
  //   outerBorderWidth: 2,
  //   outerBorderColor: '#D8BFD8',
  //   outerBorderRadius: 10,
  // },
];

export default templates; 