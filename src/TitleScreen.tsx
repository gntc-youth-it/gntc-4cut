import React from 'react';
import photoTitle from './assets/photoTitle.png';
import './TitleScreen.css';

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      background: 'white'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '40px',
        transform: 'translateY(-10%)'
      }}>
      </div>
      <div className="title-box" onClick={onStart} style={{ transform: 'translateY(-10%)' }}>
        <img className="title-image" src={photoTitle} alt="title-image" />
        <p className="floating-text">화면을 클릭하면 시작됩니다!</p>
      </div>
    </div>
  );
};

export default TitleScreen; 