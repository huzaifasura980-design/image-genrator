
import React from 'react';
import { GeneratedImage } from '../types';
import ImageIcon from './icons/ImageIcon';

interface ImageGridProps {
  images: GeneratedImage[];
  placeholderCount: number;
}

const ImageCard: React.FC<{ image: GeneratedImage }> = ({ image }) => (
  <div className="group relative aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
    <img src={image.url} alt={image.prompt} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
      <p className="text-white text-sm">{image.prompt}</p>
    </div>
  </div>
);

const PlaceholderCard: React.FC = () => (
    <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center animate-pulse">
        <ImageIcon className="w-16 h-16 text-gray-600" />
    </div>
);


const ImageGrid: React.FC<ImageGridProps> = ({ images, placeholderCount }) => {
  const placeholders = Array.from({ length: Math.max(0, placeholderCount - images.length) });

  if (images.length === 0 && placeholderCount === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 h-full p-8">
            <ImageIcon className="w-24 h-24 mb-4" />
            <h3 className="text-xl font-semibold">Ready to create?</h3>
            <p>Your generated images will appear here.</p>
        </div>
      );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img, index) => <ImageCard key={index} image={img} />)}
      {placeholders.map((_, index) => <PlaceholderCard key={`placeholder-${index}`} />)}
    </div>
  );
};

export default ImageGrid;
