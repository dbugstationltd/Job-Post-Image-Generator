
import React from 'react';

interface ImageCardProps {
  src: string;
  prompt: string;
  onDownload: (src: string) => void;
  index: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, prompt, onDownload, index }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl group transition-all duration-300 hover:scale-105">
      <div className="aspect-square w-full">
        <img src={src} alt={prompt} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <button
          onClick={() => onDownload(src)}
          className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span>Download Version {index + 1}</span>
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
