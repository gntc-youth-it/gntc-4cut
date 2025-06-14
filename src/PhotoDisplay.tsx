import React, { useEffect, useRef, useState } from 'react';
import { Frame } from './types';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';

interface PhotoDisplayProps {
  photos: string[];
  frame: Frame;
}

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ photos, frame }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (photos.length === frame.cutCount) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      photos.forEach((photo, index) => {
        const img = new Image();
        img.src = photo;
        img.onload = () => {
          context.save();
          const position = frame.positions[index];
          context.translate(position.x + position.width / 2, position.y + position.height / 2);
          context.rotate(position.angle);
          context.scale(-1, 1);
          context.drawImage(img, -position.width / 2, -position.height / 2, position.width, position.height);
          context.restore();
        };
      });
      const frameImage = new Image();
      frameImage.src = frame.frameImage;
      frameImage.onload = () => {
        context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [photos, frame]);

  const handleSave = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const blob = dataURLToBlob(dataUrl);
    const uniqueFileName = `${fileName}_${uuidv4()}.png`;
    saveAs(blob, uniqueFileName);
  };

  const handleRetake = () => {
    window.location.reload();
  };

  const dataURLToBlob = (dataURL: string) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div style={{
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      overflow: 'auto'
    }}>
      <h1 style={{ color: 'black', marginBottom: '20px', marginTop: '40px' }}>사진 촬영 완료</h1>
      
      <div style={{
        width: '100%',
        maxWidth: '400px',
        maxHeight: '70vh',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0',
        marginBottom: '180px',
        overflow: 'auto',
        background: 'white',
      }}>
        <canvas
          ref={canvasRef}
          width={frame.width} 
          height={frame.height} 
          style={{
            maxHeight: '70vh',
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block',
            margin: '0 auto',
            background: 'white',
          }}
        />
      </div>

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        padding: '20px',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 10
      }}>
        <input
          type="text"
          placeholder="사진을 전달받을 이메일이나 번호를 남겨주세요"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '30px',
            fontFamily: 'LeeSeoyun',
            marginTop: '20px',
            marginBottom: '30px',
            border: 'none',
            borderBottom: '2px solid black',
            backgroundColor: 'transparent',
            outline: 'none',
            width: '100%',
            maxWidth: '600px',
            boxSizing: 'border-box',
            color: 'black'
          }}
        />
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: 'black',
              borderRadius: '20px',
              color: 'white',
              fontFamily: 'LeeSeoyun',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            저장하기
          </button>
          <button 
            onClick={handleRetake} 
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: 'black',
              borderRadius: '20px',
              color: 'white',
              fontFamily: 'LeeSeoyun',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            처음부터 다시 찍기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoDisplay; 