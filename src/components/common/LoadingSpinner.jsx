// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 40, 
  color = '#df2528', 
  text = 'กำลังโหลด...', 
  showText = true,
  fullScreen = false 
}) => {
  const containerStyles = fullScreen 
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .loading-spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid ${color};
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
        `}
      </style>
      <div style={containerStyles}>
        <div 
          className="loading-spinner"
          style={{
            width: `${size}px`,
            height: `${size}px`
          }}
        />
        {showText && (
          <p style={{ 
            margin: 0, 
            color: '#6c757d', 
            fontSize: '0.875rem',
            fontWeight: '500' 
          }}>
            {text}
          </p>
        )}
      </div>
    </>
  );
};

export default LoadingSpinner;
