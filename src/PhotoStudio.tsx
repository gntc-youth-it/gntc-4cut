import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Frame } from './types';

interface PhotoStudioProps {
  frame: Frame;
  onComplete: (photos: string[]) => void;
}

const PhotoStudio: React.FC<PhotoStudioProps> = ({ frame, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState<boolean>(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const enumerateDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 0) {
          setDevices(videoDevices);
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Error enumerating devices: ', err);
      }
    };
    enumerateDevices();
  }, []);

  useEffect(() => {
    const startWebcam = async () => {
      if (!selectedDeviceId) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedDeviceId,
            width: { ideal: frame.positions[0].width },
            height: { ideal: frame.positions[0].height }
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam: ', err);
      }
    };
    startWebcam();
  }, [selectedDeviceId, frame.positions]);

  const takePhoto = useCallback(() => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.save();
        context.scale(1, 1);
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        context.restore();
        const newPhoto = canvasRef.current.toDataURL('image/png');
        setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
        setFlash(true);
        setTimeout(() => setFlash(false), 100);
      }
    }
  }, []);

  useEffect(() => {
    if (photos.length === frame.cutCount) {
      onComplete(photos);
    }
  }, [photos, frame.cutCount, onComplete]);

  const handleTakePhotoSequence = () => {
    setIsButtonDisabled(true);
    const takePhotoWithCountdown = (count: number) => {
      if (count > 0) {
        setCountdown(count);
        setTimeout(() => takePhotoWithCountdown(count - 1), 1000);
      } else {
        takePhoto();
        if (photos.length < frame.cutCount - 1) {
          setTimeout(() => takePhotoWithCountdown(3), 1000);
        }
      }
    };
    takePhotoWithCountdown(3);
  };

  return (
    <div style={{
      position: 'relative',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: 'white'
    }}>
      <h1 style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        margin: 0,
        zIndex: 1,
        color: 'black',
        fontSize: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px 20px',
        borderRadius: '10px',
        whiteSpace: 'nowrap'
      }}>↑ 카메라를 보세요 ↑</h1>
      
      <div style={{
        width: '100%',
        maxWidth: '1600px',
        position: 'relative',
        margin: '0 auto',
        marginTop: '60px'
      }}>
        <video 
          ref={videoRef} 
          autoPlay 
          style={{
            width: '100%',
            maxHeight: '95vh',
            objectFit: 'contain',
            transform: 'scaleX(-1)'
          }}
        />
      </div>

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'black'
        }}>
          카메라 선택:
        </label>
        <select
          value={selectedDeviceId || ''}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          style={{
            padding: '5px 10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '14px',
            backgroundColor: 'white',
            color: 'black',
            minWidth: '200px'
          }}
        >
          {devices.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
            </option>
          ))}
        </select>
      </div>

      <button 
        onClick={handleTakePhotoSequence} 
        disabled={isButtonDisabled} 
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'black',
          borderRadius: '20px',
          color: 'white',
          padding: '10px 20px',
          fontFamily: 'LeeSeoyun',
          cursor: 'pointer',
          border: 'none',
          zIndex: 1,
          fontSize: '18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <span>사진 찍기</span>
        <span style={{ fontSize: '14px' }}>3초마다 사진이 찍혀요</span>
      </button>

      <canvas 
        ref={canvasRef} 
        width={frame.positions[0].width} 
        height={frame.positions[0].height} 
        style={{display: 'none'}}
      />

      {countdown !== null && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '120px',
          color: 'rgba(255, 255, 255, 0.6)',
          pointerEvents: 'none',
          zIndex: 1,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          fontWeight: 'bold'
        }}>
          {countdown}
        </div>
      )}

      {flash && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          opacity: 0.8,
          pointerEvents: 'none',
          zIndex: 1
        }}/>
      )}
    </div>
  );
};

export default PhotoStudio; 