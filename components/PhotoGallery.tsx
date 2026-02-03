import React from 'react';
import { PhotoPlaceholder } from '../types';

// IMPORTANT: Ensure your image files in the project root match these filenames:
const PHOTOS: PhotoPlaceholder[] = [
  { 
    id: 1, 
    url: './us-selfie.jpg', 
    alt: 'Us ❤️' 
  },
  { 
    id: 2, 
    url: './baby-shower.jpg', 
    alt: 'Mommy and Daddy' 
  },
  { 
    id: 4, 
    url: './river-funny.jpg', 
    alt: 'My beautiful Valentine' 
  },
];

export const PhotoGallery: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4 w-full max-w-5xl my-8">
      {PHOTOS.map((photo, index) => (
        <div 
          key={photo.id} 
          className={`
            relative group rounded-xl shadow-xl bg-white p-3 pb-12
            transform transition-all duration-500 hover:scale-110 hover:z-20 hover:rotate-0 hover:shadow-2xl
            cursor-pointer
            ${index % 3 === 0 ? '-rotate-3' : index % 3 === 1 ? 'rotate-2' : '-rotate-1'}
            ${index === 0 ? 'md:col-span-2 md:rotate-1' : ''} 
          `}
        >
          <div className="overflow-hidden rounded-lg w-full h-full bg-gray-100">
            <img 
              src={photo.url} 
              alt={photo.alt} 
              className="w-full h-64 md:h-80 object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="font-handwriting text-2xl text-gray-700 -rotate-1 group-hover:text-pink-600 transition-colors">
              {photo.alt}
            </p>
          </div>
          
          {/* Cute tape effect */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-white/30 backdrop-blur-sm border-l border-r border-white/40 rotate-1 shadow-sm opacity-80"></div>
        </div>
      ))}
    </div>
  );
};