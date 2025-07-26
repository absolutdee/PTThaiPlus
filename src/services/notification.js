// src/services/notification.js
import ApiService from './api';

class NotificationService {
  constructor() {
    this.API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.webSocket = null;
    this.eventListeners = {};
  }

  // Initialize WebSocket connection
  initWebSocket(userId) {
    const wsUrl = `${this.API_BASE.replace('http', 'ws')}/notifications/${userId}`;
    
    this.webSocket = new WebSocket(wsUrl);
    
    this.webSocket.onopen = () => {
      console.log('WebSocket connected for notifications');
    };

    this.webSocket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.handleRealtimeNotification(notification);
    };

    this.webSocket.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 5 seconds
      setTimeout(() => this.initWebSocket(userId), 5000);
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  // Handle realtime notifications
  handleRealtimeNotification(notification) {
    // Emit to all registered listeners
    Object.values(this.eventListeners).forEach(listener => {
      if (typeof listener === 'function') {
        listener(notification);
      }
    });

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title || 'แจ้งเตือน', {
        body: notification.message,
        icon: '/assets/images/logo.png',
        badge: '/assets/images/badge.png'
      });
    }
  }

  // Add event listener
  addEventListener(eventId, callback) {
    this.eventListeners[eventId] = callback;
  }

  // Remove event listener
  removeEventListener(eventId) {
    delete this.eventListeners[eventId];
  }

  // Request browser notification permission
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Get user notifications
  async getNotifications(userId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await ApiService.get(
        `/notifications/${userId}?${queryString}`
      );
      return response;
    } catch (error) {
      throw new Error(error.message || 'การดึงการแจ้งเตือนล้มเหลว');
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await ApiService.patch(`/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การอ่านการแจ้งเตือนล้มเหลว');
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    try {
      const response = await ApiService.patch(`/notifications/${userId}/read-all`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การอ่านการแจ้งเตือนทั้งหมดล้มเหลว');
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await ApiService.delete(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การลบการแจ้งเตือนล้มเหลว');
    }
  }

  // Send notification (admin/trainer)
  async sendNotification(notificationData) {
    try {
      const response = await ApiService.post('/notifications/send', notificationData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การส่งการแจ้งเตือนล้มเหลว');
    }
  }

  // Get notification settings
  async getNotificationSettings(userId) {
    try {
      const response = await ApiService.get(`/notifications/settings/${userId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การดึงการตั้งค่าการแจ้งเตือนล้มเหลว');
    }
  }

  // Update notification settings
  async updateNotificationSettings(userId, settings) {
    try {
      const response = await ApiService.put(`/notifications/settings/${userId}`, settings);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การอัปเดตการตั้งค่าการแจ้งเตือนล้มเหลว');
    }
  }

  // Close WebSocket connection
  disconnect() {
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
  }
}

export const notificationService = new NotificationService();
