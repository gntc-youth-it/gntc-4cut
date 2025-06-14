import React, { useState } from 'react';
import TitleScreen from './TitleScreen';
import FrameSelection from './FrameSelection';
import PhotoStudio from './PhotoStudio';
import PhotoDisplay from './PhotoDisplay';
import { Frame, frames } from './types';

const App: React.FC = () => {
  const [stage, setStage] = useState<'title' | 'frameSelection' | 'photo' | 'display'>('title');
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [photos, setPhotos] = useState<string[] | null>(null);

  const handleStart = () => setStage('frameSelection');

  const handleFrameSelect = (frame: Frame) => {
    setSelectedFrame(frame);
    setStage('photo');
  };

  const handlePhotoComplete = (capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setStage('display');
  };

  return (
    <div className="App" style={{ width: '100vw', maxWidth: '100%' }}>
      {stage === 'title' && <TitleScreen onStart={handleStart} />}
      {stage === 'frameSelection' && <FrameSelection frames={frames} onSelect={handleFrameSelect} />}
      {stage === 'photo' && selectedFrame && <PhotoStudio frame={selectedFrame} onComplete={handlePhotoComplete} />}
      {stage === 'display' && photos && selectedFrame && <PhotoDisplay photos={photos} frame={selectedFrame} />}
    </div>
  );
};

export default App; 