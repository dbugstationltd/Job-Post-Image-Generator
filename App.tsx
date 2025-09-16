
import React, { useState, useCallback } from 'react';
import { generateImagePrompt, generateImages } from './services/geminiService';
import type { GeneratedImage } from './types';
import Loader from './components/Loader';
import ImageCard from './components/ImageCard';

const App: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [creativePrompt, setCreativePrompt] = useState<string>('');

  const handleGenerate = useCallback(async () => {
    if (!jobTitle.trim()) {
      setError('Please enter a job title.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setCreativePrompt('');

    try {
      const prompt = await generateImagePrompt(jobTitle);
      setCreativePrompt(prompt);

      const imageUrls = await generateImages(prompt);
      const images: GeneratedImage[] = imageUrls.map(src => ({
        src,
        prompt: prompt,
      }));
      setGeneratedImages(images);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [jobTitle]);

  const handleDownload = useCallback((src: string) => {
    const link = document.createElement('a');
    link.href = src;
    const sanitizedTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    link.download = `job_post_${sanitizedTitle}_${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [jobTitle]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            Job Post Image Generator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Tired of boring stock photos? Turn your job titles into funny, conceptual art for social media.
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior React Engineer"
              disabled={isLoading}
              className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50"
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="bg-purple-600 text-white font-bold py-3 px-6 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 disabled:bg-purple-800 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Images'
              )}
            </button>
          </div>
          
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

          <div className="mt-8">
            {isLoading && <Loader />}
            
            {generatedImages.length > 0 && (
              <div className="space-y-6">
                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-purple-300 mb-1">Creative Prompt Used:</h3>
                    <p className="text-gray-300 italic">"{creativePrompt}"</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {generatedImages.map((image, index) => (
                    <ImageCard
                      key={index}
                      src={image.src}
                      prompt={image.prompt}
                      onDownload={handleDownload}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
