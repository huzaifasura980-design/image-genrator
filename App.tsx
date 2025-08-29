import React, { useState, useCallback } from 'react';
import { AspectRatio, GeneratedImage } from './types';
import { generateImage } from './services/geminiService';
import ControlPanel from './components/ControlPanel';
import ImageGrid from './components/ImageGrid';
import ProgressBar from './components/ProgressBar';

// Add JSZip to the global window object for TypeScript
declare global {
    interface Window {
        JSZip: any;
    }
}


const App: React.FC = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [totalImagesToGenerate, setTotalImagesToGenerate] = useState(0);
  const [apiKey, setApiKey] = useState('');

  const createAndDownloadZip = async (images: GeneratedImage[]) => {
    const JSZip = window.JSZip;
    if (!JSZip) {
      setError("JSZip library not loaded. Cannot create ZIP file.");
      return;
    }
    const zip = new JSZip();

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const response = await fetch(image.url);
        const blob = await response.blob();
        // Sanitize prompt for filename
        const fileName = `${i + 1}_${image.prompt.substring(0, 20).replace(/[^a-z0-9]/gi, '_')}.jpeg`;
        zip.file(fileName, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    setZipUrl(url);
  };

  const handleGenerate = useCallback(async (
    prompts: string[],
    numImages: number,
    aspectRatio: AspectRatio
  ) => {
    if (!apiKey) {
      setError("Please enter your Google AI API Key.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setZipUrl(null);
    setProgress(0);
    
    const total = prompts.length * numImages;
    setTotalImagesToGenerate(total);
    let completed = 0;
    const newImages: GeneratedImage[] = [];

    try {
      for (const prompt of prompts) {
        for (let i = 0; i < numImages; i++) {
          const imageUrl = await generateImage(prompt, aspectRatio, apiKey);
          const newImage: GeneratedImage = { prompt, url: imageUrl };
          newImages.push(newImage);
          setGeneratedImages([...newImages]); // Update state with a new array
          completed++;
          setProgress((completed / total) * 100);
        }
      }
      await createAndDownloadZip(newImages);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during image generation.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const isFinished = !isLoading && generatedImages.length > 0 && generatedImages.length === totalImagesToGenerate;
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="py-6 px-8 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">
            Gemini Bulk Image Generator
        </h1>
        <p className="text-gray-400 mt-1">Generate stunning images in bulk with Imagen 4.</p>
      </header>

      <main className="flex flex-col lg:flex-row gap-8 p-8">
        <ControlPanel
          onGenerate={handleGenerate}
          isLoading={isLoading}
          isFinished={isFinished}
          zipUrl={zipUrl}
          totalImages={totalImagesToGenerate}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />
        <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Generated Images</h2>
            
            {isLoading && (
              <ProgressBar 
                progress={progress} 
                current={generatedImages.length}
                total={totalImagesToGenerate}
              />
            )}

            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto max-h-[70vh] pr-2">
                <ImageGrid images={generatedImages} placeholderCount={totalImagesToGenerate} />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;