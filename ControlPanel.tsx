import React, { useState } from 'react';
import { AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';
import Button from './Button';
import UploadIcon from './icons/UploadIcon';
import ImageIcon from './icons/ImageIcon';
import DownloadIcon from './icons/DownloadIcon';

interface ControlPanelProps {
  onGenerate: (prompts: string[], numImages: number, aspectRatio: AspectRatio) => void;
  isLoading: boolean;
  isFinished: boolean;
  zipUrl: string | null;
  totalImages: number;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, isLoading, isFinished, zipUrl, totalImages, apiKey, setApiKey }) => {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        setPrompts(lines);
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateClick = () => {
    onGenerate(prompts, numberOfImages, aspectRatio);
  };
  
  const isGenerateDisabled = prompts.length === 0 || isLoading || !apiKey;

  return (
    <div className="w-full lg:w-96 bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col gap-6 flex-shrink-0">
      <h2 className="text-2xl font-bold text-white">Generation Settings</h2>

      <div>
        <label htmlFor="api-key" className="block text-sm font-medium text-gray-300">
          Google AI API Key
        </label>
        <input
          type="password"
          id="api-key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
          disabled={isLoading}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-3 placeholder-gray-500"
          aria-required="true"
        />
        <p className="mt-2 text-xs text-gray-500">Your key is used only for this session and not stored.</p>
      </div>


      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
          Upload Prompts (.txt)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
            <div className="flex text-sm text-gray-400">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-indigo-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".txt" onChange={handleFileChange} disabled={isLoading} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">{fileName || 'One prompt per line'}</p>
          </div>
        </div>
        {prompts.length > 0 && <p className="text-sm mt-2 text-green-400">{prompts.length} prompts loaded.</p>}
      </div>

      <div>
        <label htmlFor="num-images" className="block text-sm font-medium text-gray-300">
          Images per Prompt
        </label>
        <input
          type="number"
          id="num-images"
          min="1"
          max="10"
          value={numberOfImages}
          onChange={(e) => setNumberOfImages(parseInt(e.target.value, 10))}
          disabled={isLoading}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-3"
        />
      </div>

      <div>
        <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-300">
          Aspect Ratio
        </label>
        <select
          id="aspect-ratio"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
          disabled={isLoading}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-3"
        >
          {ASPECT_RATIOS.map(ratio => <option key={ratio} value={ratio}>{ratio}</option>)}
        </select>
      </div>

      <div className="border-t border-gray-700 pt-6">
        {isFinished && zipUrl ? (
          <a href={zipUrl} download="generated_images.zip">
             <Button className="w-full text-lg">
                <DownloadIcon className="h-6 w-6"/>
                Download ZIP ({totalImages} images)
            </Button>
          </a>
        ) : (
          <Button onClick={handleGenerateClick} disabled={isGenerateDisabled} isLoading={isLoading} className="w-full text-lg">
             <ImageIcon className="h-6 w-6"/>
            Generate Images
          </Button>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;