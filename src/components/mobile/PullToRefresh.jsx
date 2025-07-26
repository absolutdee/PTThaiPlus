// src/components/mobile/PullToRefresh.jsx
import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const PullToRefresh = ({ 
  children, 
  onRefresh, 
  threshold = 80,
  disabled = false 
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  const handleTouchStart = (e) => {
    if (disabled || isRefreshing) return;
    
    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop > 0) return;

    startYRef.current = e.touches[0].clientY;
    setIsPulling(true);
  };

  const handleTouchMove = (e) => {
    if (disabled || isRefreshing || !isPulling) return;

    currentYRef.current = e.touches[0].clientY;
    const diff = currentYRef.current - startYRef.current;

    if (diff > 0) {
      // Apply resistance
      const resistance = Math.min(diff / 2, threshold);
      setPullDistance(resistance);
      
      if (resistance > threshold * 0.8) {
        // Prevent default to avoid overscroll
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (disabled || isRefreshing) return;

    if (pullDistance > threshold) {
      handleRefresh();
    } else {
      resetPull();
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
      resetPull();
    }
  };

  const resetPull = () => {
    setPullDistance(0);
    setIsPulling(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, isRefreshing, disabled]);

  const getRefreshIndicatorStyle = () => {
    const opacity = Math.min(pullDistance / threshold, 1);
    const scale = Math.min(pullDistance / threshold, 1);
    const rotation = (pullDistance / threshold) * 360;

    return {
      opacity,
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      transition: isRefreshing ? 'transform 0.2s ease' : 'none'
    };
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        height: '100%',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Refresh Indicator */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'top 0.2s ease'
        }}
      >
        <RefreshCw
          size={24}
          color="#232956"
          style={{
            ...getRefreshIndicatorStyle(),
            animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
          transition: isPulling ? 'none' : 'transform 0.2s ease'
        }}
      >
        {children}
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default PullToRefresh;
