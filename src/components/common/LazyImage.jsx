// src/components/common/LazyImage.jsx
import React, { useState, useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const LazyImage = ({ 
  src, 
  alt, 
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='100%25' height='100%25' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236c757d'%3ELoading...%3C/text%3E%3C/svg%3E",
  className = "",
  style = {},
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  return (
    <div ref={targetRef} className={className} style={style}>
      {isIntersecting && (
        <img
          ref={imgRef}
          src={hasError ? placeholder : (isLoaded ? src : placeholder)}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0.7,
            transition: 'opacity 0.3s ease',
            ...style
          }}
          {...props}
        />
      )}
      {!isIntersecting && (
        <div 
          className="d-flex align-items-center justify-content-center bg-light"
          style={{ 
            width: '100%', 
            height: '200px',
            ...style 
          }}
        >
          <span className="text-muted">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
