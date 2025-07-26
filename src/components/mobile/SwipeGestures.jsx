// src/components/mobile/SwipeGestures.jsx
import React, { useEffect, useRef } from 'react';

const SwipeGestures = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown,
  threshold = 50,
  preventScrollOnSwipe = false 
}) => {
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const handleTouchMove = (e) => {
    if (preventScrollOnSwipe && touchStartRef.current) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
      
      // Prevent scroll if horizontal swipe is more significant than vertical
      if (deltaX > deltaY) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e) => {
    touchEndRef.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now()
    };

    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const deltaTime = touchEndRef.current.time - touchStartRef.current.time;

    // Check if swipe was fast enough
    if (deltaTime > 500) return;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine swipe direction
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > threshold) {
        if (deltaX > 0) {
          onSwipeRight && onSwipeRight();
        } else {
          onSwipeLeft && onSwipeLeft();
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > threshold) {
        if (deltaY > 0) {
          onSwipeDown && onSwipeDown();
        } else {
          onSwipeUp && onSwipeUp();
        }
      }
    }

    // Reset
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ touchAction: 'pan-y' }}>
      {children}
    </div>
  );
};

export default SwipeGestures;
