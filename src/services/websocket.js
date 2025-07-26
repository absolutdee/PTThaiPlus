// src/services/websocket.js
class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000;
    this.listeners = new Map();
    this.heartbeatInterval = null;
    this.messageQueue = [];
  }

  connect(url, options = {}) {
    this.url = url;
    this.options = options;

    try {
      this.ws = new WebSocket(url);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  setupEventListeners() {
    this.ws.onopen = (event) => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.processMessageQueue();
      this.emit('connected', event);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isConnected = false;
      this.stopHeartbeat();
      this.emit('disconnected', event);
      
      if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  handleMessage(data) {
    const { type, payload } = data;
    
    switch (type) {
      case 'heartbeat':
        this.sendHeartbeat();
        break;
      case 'notification':
        this.emit('notification', payload);
        break;
      case 'session_update':
        this.emit('sessionUpdate', payload);
        break;
      case 'message':
        this.emit('message', payload);
        break;
      case 'user_status':
        this.emit('userStatus', payload);
        break;
      default:
        this.emit(type, payload);
    }
  }

  send(type, payload = {}) {
    const message = JSON.stringify({ type, payload, timestamp: Date.now() });
    
    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      this.ws.send(message);
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 30000); // Send heartbeat every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  sendHeartbeat() {
    this.send('heartbeat');
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(this.url, this.options);
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.isConnected = false;
    this.listeners.clear();
    this.messageQueue = [];
  }

  getConnectionState() {
    if (!this.ws) return 'DISCONNECTED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'CONNECTED';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }

  // Convenience methods for common operations
  joinRoom(roomId) {
    this.send('joinRoom', { roomId });
  }

  leaveRoom(roomId) {
    this.send('leaveRoom', { roomId });
  }

  sendChatMessage(message, recipientId) {
    this.send('chatMessage', { message, recipientId });
  }

  updateUserStatus(status) {
    this.send('userStatus', { status });
  }

  subscribeToNotifications(userId) {
    this.send('subscribeNotifications', { userId });
  }

  unsubscribeFromNotifications(userId) {
    this.send('unsubscribeNotifications', { userId });
  }
}

export const webSocketService = new WebSocketService();
