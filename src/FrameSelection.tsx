import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Frame } from './types';
import { detectTransparentAreas, DetectedArea } from './utils/frameDetector';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface FrameSelectionProps {
  frames: Frame[];
  onSelect: (frame: Frame) => void;
}

const FrameSelection: React.FC<FrameSelectionProps> = ({ frames, onSelect }) => {
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [processedFrames, setProcessedFrames] = useState<Frame[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processFrames = async () => {
      try {
        const processed = await Promise.all(
          frames.map(async (frame) => {
            const areas = await detectTransparentAreas(frame.frameImage);
            return {
              ...frame,
              positions: areas.map((area, index) => ({
                x: area.x,
                y: area.y,
                width: area.width,
                height: area.height,
                angle: 0
              }))
            };
          })
        );
        setProcessedFrames(processed);
        if (processed.length > 0) setSelectedFrame(processed[0]);
      } catch (error) {
        console.error('Error processing frames:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    processFrames();
  }, [frames]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index: number) => setSelectedFrame(processedFrames[index])
  };

  const handleSelectClick = () => {
    if (selectedFrame) onSelect(selectedFrame);
  };

  const handleFrameSelect = (frame: Frame) => {
    setSelectedFrame(frame);
  };

  if (isProcessing) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '20px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{ color: 'black' }}>프레임을 분석중입니다...</h1>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      padding: '0',
    }}>
      <h1 style={{ color: 'black', margin: '40px 0 100px 0', fontSize: '2rem' }}>프레임을 선택해주세요</h1>
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '32px',
      }}>
        <div style={{
          width: '400px',
        }}>
          <Slider {...settings}>
            {frames.map((frame, index) => (
              <div key={index} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src={frame.frameImage}
                  alt={`Frame ${index + 1}`}
                  style={{
                    maxHeight: '60vh',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    border: selectedFrame === frame ? '3px solid black' : '1px solid #ccc',
                    borderRadius: '10px',
                    background: 'white',
                    cursor: 'pointer',
                    boxShadow: selectedFrame === frame ? '0 0 8px #3333' : 'none',
                    transition: 'box-shadow 0.2s, border 0.2s',
                    margin: '0 auto',
                    display: 'block',
                    backgroundColor: 'black'
                  }}
                  onClick={() => handleFrameSelect(frame)}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <button
        onClick={handleSelectClick}
        style={{
          marginTop: 'auto',
          marginBottom: '40px',
          padding: '14px 32px',
          fontSize: '1.2rem',
          backgroundColor: 'black',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontFamily: 'LeeSeoyun',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        선택한 프레임으로 시작하기
      </button>
    </div>
  );
};

export default FrameSelection; 