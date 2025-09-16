
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Consulting the digital oracle...",
  "Waking up the AI's inner artist...",
  "Translating job titles into pure imagination...",
  "Painting pixels with lightning...",
  "Rummaging through the concept closet...",
  "Herding creative digital hamsters...",
];

const Loader: React.FC = () => {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
      <p className="text-lg text-gray-300 font-medium tracking-wide">{message}</p>
    </div>
  );
};

export default Loader;
