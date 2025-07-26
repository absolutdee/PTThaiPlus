// src/components/common/NotificationToast.jsx
import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotification();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color="#28a745" />;
      case 'error':
        return <AlertCircle size={20} color="#dc3545" />;
      case 'warning':
        return <AlertTriangle size={20} color="#ffc107" />;
      case 'info':
      default:
        return <Info size={20} color="#17a2b8" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return '#d4edda';
      case 'error':
        return '#f8d7da';
      case 'warning':
        return '#fff3cd';
      case 'info':
      default:
        return '#d1ecf1';
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      case 'info':
      default:
        return '#17a2b8';
    }
  };

  return (
    <>
      <style>
        {`
          .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
          }
          
          .toast-item {
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease-out;
          }
          
          .toast-item.removing {
            animation: slideOut 0.3s ease-in;
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
          
          @media (max-width: 768px) {
            .toast-container {
              top: 10px;
              right: 10px;
              left: 10px;
              max-width: none;
            }
          }
        `}
      </style>
      
      <div className="toast-container">
        {visibleNotifications.map((notification) => (
          <div
            key={notification.id}
            className="toast-item"
            style={{
              backgroundColor: getBackgroundColor(notification.type),
              borderLeftColor: getBorderColor(notification.type),
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            {getIcon(notification.type)}
            
            <div style={{ flex: 1, minWidth: 0 }}>
              {notification.title && (
                <div style={{
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  marginBottom: '4px',
                  color: '#212529'
                }}>
                  {notification.title}
                </div>
              )}
              <div style={{
                fontSize: '0.875rem',
                color: '#495057',
                wordWrap: 'break-word'
              }}>
                {notification.message}
              </div>
            </div>
            
            <button
              onClick={() => removeNotification(notification.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                color: '#6c757d',
                flexShrink: 0
              }}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationToast;
