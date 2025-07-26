// src/components/mobile/MobileNavigation.jsx
import React, { useState } from 'react';
import { 
  Home, Search, Calendar, User, Bell, 
  MessageCircle, TrendingUp, Settings 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MobileNavigation = ({ activeSection, onSectionChange }) => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(3);

  const getNavigationItems = () => {
    if (!user) {
      return [
        { id: 'home', icon: Home, label: 'หน้าหลัก' },
        { id: 'search', icon: Search, label: 'ค้นหา' },
        { id: 'login', icon: User, label: 'เข้าสู่ระบบ' }
      ];
    }

    const commonItems = [
      { id: 'dashboard', icon: Home, label: 'หลัก' },
      { id: 'schedule', icon: Calendar, label: 'ตาราง' },
      { id: 'messages', icon: MessageCircle, label: 'แชท' },
      { 
        id: 'notifications', 
        icon: Bell, 
        label: 'แจ้งเตือน',
        badge: notificationCount > 0 ? notificationCount : null
      },
      { id: 'profile', icon: User, label: 'โปรไฟล์' }
    ];

    if (user.role === 'trainer') {
      return [
        commonItems[0], // dashboard
        { id: 'clients', icon: User, label: 'ลูกค้า' },
        commonItems[1], // schedule
        { id: 'progress', icon: TrendingUp, label: 'ติดตาม' },
        commonItems[2] // messages
      ];
    }

    return commonItems;
  };

  return (
    <div 
      className="mobile-navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e9ecef',
        padding: '0.5rem 0',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}
    >
      {getNavigationItems().map((item) => (
        <button
          key={item.id}
          className={`mobile-nav-item ${activeSection === item.id ? 'active' : ''}`}
          onClick={() => onSectionChange(item.id)}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.5rem',
            color: activeSection === item.id ? '#232956' : '#6c757d',
            fontSize: '0.75rem',
            fontWeight: '500',
            position: 'relative',
            minWidth: '60px'
          }}
        >
          <item.icon 
            size={20} 
            style={{ marginBottom: '0.25rem' }}
          />
          <span>{item.label}</span>
          
          {item.badge && (
            <span
              style={{
                position: 'absolute',
                top: '0.25rem',
                right: '0.5rem',
                backgroundColor: '#df2528',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.625rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}
            >
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </button>
      ))}

      <style>
        {`
          .mobile-nav-item {
            transition: all 0.2s ease;
          }
          
          .mobile-nav-item:hover {
            color: #232956 !important;
          }
          
          .mobile-nav-item.active {
            color: #232956 !important;
          }

          @media (min-width: 768px) {
            .mobile-navigation {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MobileNavigation;
