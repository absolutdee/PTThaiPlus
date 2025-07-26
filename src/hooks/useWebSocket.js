// src/hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from 'react';
import { webSocketService } from '../services/websocket';

export const useWebSocket = (url, options = {}) => {
  const {
    onConnect,
    onDisconnect,
    onMessage,
    onError,
    autoConnect = true,
    userId
  } = options;

  const isInitialized = useRef(false);

  const connect = useCallback(() => {
    if (!isInitialized.current) {
      webSocketService.connect(url);
      isInitialized.current = true;
    }
  }, [url]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    isInitialized.current = false;
  }, []);

  const sendMessage = useCallback((type, payload) => {
    webSocketService.send(type, payload);
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Set up event listeners
    if (onConnect) {
      webSocketService.on('connected', onConnect);
    }
    if (onDisconnect) {
      webSocketService.on('disconnected', onDisconnect);
    }
    if (onMessage) {
      webSocketService.on('message', onMessage);
    }
    if (onError) {
      webSocketService.on('error', onError);
    }

    // Subscribe to notifications if userId provided
    if (userId) {
      webSocketService.on('connected', () => {
        webSocketService.subscribeToNotifications(userId);
      });
    }

    return () => {
      // Clean up event listeners
      if (onConnect) {
        webSocketService.off('connected', onConnect);
      }
      if (onDisconnect) {
        webSocketService.off('disconnected', onDisconnect);
      }
      if (onMessage) {
        webSocketService.off('message', onMessage);
      }
      if (onError) {
        webSocketService.off('error', onError);
      }
    };
  }, [autoConnect, connect, onConnect, onDisconnect, onMessage, onError, userId]);

  return {
    connect,
    disconnect,
    sendMessage,
    isConnected: webSocketService.isConnected,
    connectionState: webSocketService.getConnectionState()
  };
};
