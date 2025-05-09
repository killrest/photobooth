// 定义通用的滤镜选项
interface FilterOption {
  id: string;
  name: string;
  style: string;
  texture: { 
    path: string; 
    opacity: number;
  } | null;
}

const filterOptions: FilterOption[] = [
  { id: 'normal', name: 'Default', style: '', texture: null },
  { id: 'bw', name: 'B&W', style: 'grayscale(100%)', texture: null },
  { id: 'vintage', name: 'Vintage', style: 'sepia(80%)', texture: null },
  { id: 'oldPhoto', name: 'Old Photo', style: 'sepia(50%) contrast(120%)', texture: null },
  { id: 'amber', name: 'Amber', style: 'sepia(80%) hue-rotate(-20deg)', texture: null },
  { id: 'nocturne', name: 'Night', style: 'brightness(0.8) contrast(120%) saturate(1.2) hue-rotate(180deg)', texture: null },
  { id: 'test', name: 'Test', style: 'brightness(0.8)', texture: null },
  { id: 'paperTexture', name: 'Paper Texture', style: 'sepia(80%) contrast(110%) brightness(125%) grayscale(25%)', texture: { path: '/textures/paper_texture.jpg', opacity: 0.7 } },
  { id: 'vintageFilm', name: 'Vintage Film', style: 'sepia(80%) contrast(110%) brightness(115%) grayscale(30%)', texture: null },
  // 可以在这里轻松添加新的纹理滤镜
  // 例如: { id: 'canvasTexture', name: 'Canvas Texture', style: 'contrast(110%) brightness(105%)', texture: { path: '/textures/canvas_texture.jpg', opacity: 0.3 } },
];

export default filterOptions; 