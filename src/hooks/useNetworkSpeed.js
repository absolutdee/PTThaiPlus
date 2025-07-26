// src/hooks/useNetworkSpeed.js
import { useState, useEffect } from 'react';

export const useNetworkSpeed = () => {
  const [networkSpeed, setNetworkSpeed] = useState('unknown');
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        const effectiveType = connection.effectiveType;
        
        setNetworkSpeed(effectiveType);
        setIsSlowConnection(['slow-2g', '2g'].includes(effectiveType));
      }
    };

    updateNetworkInfo();

    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkInfo);
      
      return () => {
        navigator.connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  return { networkSpeed, isSlowConnection };
};
