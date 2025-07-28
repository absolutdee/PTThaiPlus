import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, User, Calendar, TrendingUp, 
  MessageSquare, Star, Trophy, Bell, 
  CreditCard, Settings, Menu, X, ChevronRight,
  Activity, Target, Heart, Users, Clock,
  Dumbbell, Apple, LogOut, Gift, Ticket,
  Loader
} from 'lucide-react';
import logo from '../../assets/images/logo-new2020.png';
import { Link, useNavigate } from 'react-router-dom';

// Import all client dashboard components
import ClientDashboardOverview from './ClientDashboardOverview';
import ClientWorkoutPlan from './ClientWorkoutPlan';
import ClientSchedule from './ClientSchedule';
import ClientProgress from './ClientProgress';
import ClientNutrition from './ClientNutrition';
import ClientMessages from './ClientChatPage';
import ClientReviews from './ClientReviews';
import ClientAchievements from './ClientAchievements';
import ClientNotifications from './ClientNotifications';
import ClientBilling from './ClientBilling';
import ClientSettings from './ClientSettings';
import ClientCoupons from './ClientCoupons';

// 🔧 Configuration - เปลี่ยนเป็น true เพื่อใช้ Mock API
const USE_MOCK_API = true;
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// 🧪 Mock API สำหรับทดสอบ
const mockApiService = {
  // Simulate delay
  delay: (ms = 300) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock user profile
  getUserProfile: async (userId) => {
    await mockApiService.delay();
    return {
      id: userId,
      firstName: 'สมชาย',
      lastName: 'ใจดี', 
      name: 'สมชาย ใจดี',
      email: 'somchai@example.com',
      phone: '081-234-5678',
      profileImage: null,
      dateOfBirth: '1990-05-15',
      gender: 'male',
      height: 175,
      weight: 70,
      fitnessGoal: 'muscle_gain'
    };
  },

  // Mock badge counts
  getBadgeCounts: async (userId) => {
    await mockApiService.delay();
    return {
      scheduleCount: 3,
      messagesCount: 2,
      notificationsCount: 5,
      couponsCount: 1
    };
  },

  // Mock current package
  getCurrentPackage: async (userId) => {
    await mockApiService.delay();
    return {
      id: 'pkg001',
      packageName: 'แพคเกจเพิ่มมวลกล้ามเนื้อ',
      trainerName: 'โค้ชมาร์ค',
      duration: '3 เดือน',
      sessionsTotal: 24,
      sessionsCompleted: 8,
      status: 'active'
    };
  },

  // Mock logout
  logout: async () => {
    await mockApiService.delay(200);
    return { success: true };
  }
};

// 🔥 Real API Service (ใช้เมื่อ USE_MOCK_API = false)
const realApiService = {
  getUserProfile: async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('UNAUTHORIZED');

      const response = await fetch(`${API_BASE_URL}/client/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) throw new Error('UNAUTHORIZED');
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  getBadgeCounts: async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { scheduleCount: 0, messagesCount: 0, notificationsCount: 0, couponsCount: 0 };
      }

      const response = await fetch(`${API_BASE_URL}/client/badge-counts/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) throw new Error('UNAUTHORIZED');
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || data || { scheduleCount: 0, messagesCount: 0, notificationsCount: 0, couponsCount: 0 };
    } catch (error) {
      console.error('Error fetching badge counts:', error);
      if (error.message === 'UNAUTHORIZED') throw error;
      return { scheduleCount: 0, messagesCount: 0, notificationsCount: 0, couponsCount: 0 };
    }
  },

  getCurrentPackage: async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/client/current-package/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) throw new Error('UNAUTHORIZED');
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching current package:', error);
      if (error.message === 'UNAUTHORIZED') throw error;
      return null;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
};

// 🎯 เลือก API Service ตาม configuration
const apiService = USE_MOCK_API ? mockApiService : realApiService;

const MainClientDashboard = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // 🔐 Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Database-related states
  const [userData, setUserData] = useState(null);
  const [badgeCounts, setBadgeCounts] = useState({
    scheduleCount: 0,
    messagesCount: 0,
    notificationsCount: 0,
    couponsCount: 0
  });
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🛡️ Refs เพื่อป้องกัน multiple calls
  const authCheckRef = useRef(false);
  const dataLoadRef = useRef(false);
  const navigationRef = useRef(false);

  // Responsive breakpoints
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  };

  const isMobile = windowWidth <= breakpoints.mobile;
  const isTablet = windowWidth > breakpoints.mobile && windowWidth <= breakpoints.tablet;
  const isDesktop = windowWidth > breakpoints.tablet;

  // 🚀 ฟังก์ชัน navigation ที่ปลอดภัย
  const safeNavigate = (path, options = {}) => {
    if (navigationRef.current || isNavigating) {
      console.log('Navigation already in progress, skipping...');
      return;
    }

    navigationRef.current = true;
    setIsNavigating(true);

    console.log(`🔄 Navigating to: ${path}`);

    try {
      navigate(path, { replace: true, ...options });
      
      // Reset navigation flags after a delay
      setTimeout(() => {
        navigationRef.current = false;
        setIsNavigating(false);
      }, 1000);
    } catch (error) {
      console.error('Navigation error:', error);
      navigationRef.current = false;
      setIsNavigating(false);
      
      // Fallback to window.location as last resort
      setTimeout(() => {
        window.location.href = path;
      }, 100);
    }
  };

  // 🔍 Enhanced authentication check
  useEffect(() => {
    const checkAuthentication = async () => {
      if (authCheckRef.current) return;
      authCheckRef.current = true;

      console.log('🔐 Starting authentication check...');

      try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        
        if (USE_MOCK_API) {
          console.log('🧪 Using Mock API mode');
          // Mock mode - สร้าง token ถ้าไม่มี
          if (!token) {
            localStorage.setItem('authToken', 'mock_token_123');
            localStorage.setItem('userId', 'user123');
            console.log('🧪 Created mock credentials');
          }
          setIsAuthenticated(true);
          setAuthChecked(true);
          console.log('✅ Mock authentication successful');
          return;
        }

        if (!token || !userId) {
          console.log('❌ No credentials found, redirecting to signin');
          safeNavigate('/signin');
          return;
        }

        // Token validation for real API
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (tokenData.exp && tokenData.exp < currentTime) {
            console.log('❌ Token expired, redirecting to signin');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            safeNavigate('/signin');
            return;
          }
        } catch (tokenError) {
          console.log('❌ Invalid token format, redirecting to signin');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          safeNavigate('/signin');
          return;
        }

        setIsAuthenticated(true);
        setAuthChecked(true);
        console.log('✅ Authentication successful');

      } catch (error) {
        console.error('❌ Auth check error:', error);
        safeNavigate('/signin');
      }
    };

    checkAuthentication();
  }, [navigate]);

  // 📊 Enhanced data loading
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated || !authChecked || dataLoadRef.current) return;
      dataLoadRef.current = true;

      const userId = localStorage.getItem('userId') || 'user123';
      console.log('📊 Loading user data for:', userId);

      try {
        setLoading(true);
        setError(null);

        // Load data in parallel
        const [userProfileResult, badgeDataResult, packageDataResult] = await Promise.allSettled([
          apiService.getUserProfile(userId),
          apiService.getBadgeCounts(userId),
          apiService.getCurrentPackage(userId)
        ]);

        console.log('📊 Data loading results:', {
          profile: userProfileResult.status,
          badges: badgeDataResult.status,
          package: packageDataResult.status
        });

        // Check for UNAUTHORIZED errors (only for real API)
        if (!USE_MOCK_API) {
          const unauthorizedResults = [userProfileResult, badgeDataResult, packageDataResult].filter(
            result => result.status === 'rejected' && result.reason?.message === 'UNAUTHORIZED'
          );

          if (unauthorizedResults.length > 0) {
            console.log('❌ Unauthorized error detected, redirecting to signin');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            safeNavigate('/signin');
            return;
          }
        }

        // Process results
        if (userProfileResult.status === 'fulfilled' && userProfileResult.value) {
          setUserData(userProfileResult.value);
          console.log('✅ User profile loaded');
        } else {
          console.error('❌ Failed to load user profile:', userProfileResult.reason);
          setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
        }

        if (badgeDataResult.status === 'fulfilled' && badgeDataResult.value) {
          setBadgeCounts(prevCounts => ({ ...prevCounts, ...badgeDataResult.value }));
          console.log('✅ Badge counts loaded');
        }

        if (packageDataResult.status === 'fulfilled') {
          setCurrentPackage(packageDataResult.value);
          console.log('✅ Package data loaded');
        }

      } catch (err) {
        console.error('❌ Error loading dashboard data:', err);
        if (!USE_MOCK_API && err.message === 'UNAUTHORIZED') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          safeNavigate('/signin');
          return;
        }
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && authChecked) {
      loadUserData();
    }
  }, [isAuthenticated, authChecked]);

  // Auto-refresh badge counts (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated || !authChecked) return;

    const userId = localStorage.getItem('userId') || 'user123';
    if (!userId) return;

    const interval = setInterval(async () => {
      try {
        const badgeData = await apiService.getBadgeCounts(userId);
        if (badgeData) {
          setBadgeCounts(prevCounts => ({ ...prevCounts, ...badgeData }));
        }
      } catch (err) {
        if (!USE_MOCK_API && err.message === 'UNAUTHORIZED') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          safeNavigate('/signin');
          return;
        }
        console.error('Error refreshing badge counts:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, authChecked]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > breakpoints.mobile) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints.mobile]);

  // Set CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', '#232956');
    root.style.setProperty('--accent', '#df2528');
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#fafafa');
    root.style.setProperty('--text-primary', '#1a202c');
    root.style.setProperty('--text-secondary', '#718096');
    root.style.setProperty('--text-muted', '#a0aec0');
    root.style.setProperty('--text-white', '#ffffff');
    root.style.setProperty('--border-color', '#e2e8f0');
    root.style.setProperty('--success', '#48bb78');
    root.style.setProperty('--warning', '#ed8936');
    root.style.setProperty('--info', '#4299e1');
    root.style.setProperty('--danger', '#f56565');
  }, []);

  // 🔄 Refresh data function
  const refreshData = async () => {
    if (!isAuthenticated || !authChecked) return;

    const userId = localStorage.getItem('userId') || 'user123';
    if (!userId) return;

    try {
      setLoading(true);
      const [userProfileResult, badgeDataResult, packageDataResult] = await Promise.allSettled([
        apiService.getUserProfile(userId),
        apiService.getBadgeCounts(userId),
        apiService.getCurrentPackage(userId)
      ]);

      if (!USE_MOCK_API) {
        const unauthorizedResults = [userProfileResult, badgeDataResult, packageDataResult].filter(
          result => result.status === 'rejected' && result.reason?.message === 'UNAUTHORIZED'
        );

        if (unauthorizedResults.length > 0) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          safeNavigate('/signin');
          return;
        }
      }

      if (userProfileResult.status === 'fulfilled' && userProfileResult.value) {
        setUserData(userProfileResult.value);
      }
      if (badgeDataResult.status === 'fulfilled' && badgeDataResult.value) {
        setBadgeCounts(prevCounts => ({ ...prevCounts, ...badgeDataResult.value }));
      }
      if (packageDataResult.status === 'fulfilled') {
        setCurrentPackage(packageDataResult.value);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
      if (!USE_MOCK_API && err.message === 'UNAUTHORIZED') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        safeNavigate('/signin');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  // Update badge count function
  const updateBadgeCount = (badgeType, count) => {
    setBadgeCounts(prevCounts => ({
      ...prevCounts,
      [badgeType]: count
    }));
  };

  // Navigation items
  const getNavItems = () => [
    { id: 'dashboard', label: 'ภาพรวม', icon: LayoutDashboard, badge: null },
    { id: 'workout-plan', label: 'แผนการเทรน', icon: Target, badge: null },
    { id: 'schedule', label: 'ตารางเทรน', icon: Calendar, badge: badgeCounts.scheduleCount || null },
    { id: 'progress', label: 'ความก้าวหน้า', icon: TrendingUp, badge: null },
    { id: 'nutrition', label: 'โภชนาการ', icon: Apple, badge: null },
    { id: 'coupons', label: 'คูปองส่วนลด', icon: Gift, badge: badgeCounts.couponsCount || null },
    { id: 'messages', label: 'แชทกับเทรนเนอร์', icon: MessageSquare, badge: badgeCounts.messagesCount || null },
    { id: 'reviews', label: 'รีวิวเทรนเนอร์', icon: Star, badge: null },
    { id: 'achievements', label: 'ความสำเร็จ', icon: Trophy, badge: null },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell, badge: badgeCounts.notificationsCount || null },
    { id: 'billing', label: 'ประวัติการชำระเงิน', icon: CreditCard, badge: null },
    { id: 'settings', label: 'การตั้งค่า', icon: Settings, badge: null }
  ];

  // Default user data
  const defaultUserData = {
    name: 'กำลังโหลด...',
    avatar: '...',
    email: '...',
    firstName: '',
    lastName: ''
  };

  const displayUserData = userData || defaultUserData;

  // Create avatar initials
  const getAvatarInitials = (user) => {
    if (!user || loading) return '...';
    
    if (user.firstName && user.lastName) {
      return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    } else if (user.name && user.name !== 'กำลังโหลด...') {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  // Handle navigation
  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
    setHoveredItem(null);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // 🚪 Enhanced logout handler
  const handleLogout = async () => {
    if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      try {
        await apiService.logout();
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        
        console.log('🚪 Logout successful, redirecting...');
        safeNavigate('/signin');
      } catch (error) {
        console.error('Logout error:', error);
        // Force logout
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        safeNavigate('/signin');
      }
    }
  };

  // 🔄 Show loading screen if not authenticated yet
  if (!authChecked) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <Loader className="animate-spin" size={48} color="#232956" />
        <div style={{ color: '#666', textAlign: 'center' }}>
          {USE_MOCK_API ? '🧪 กำลังเตรียมข้อมูลทดสอบ...' : 'กำลังตรวจสอบสิทธิ์...'}
        </div>
        {USE_MOCK_API && (
          <div style={{ fontSize: '0.875rem', color: '#999', textAlign: 'center' }}>
            Mock API Mode - สำหรับทดสอบ Frontend
          </div>
        )}
      </div>
    );
  }

  // Error component
  const renderError = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ color: 'var(--danger)', fontSize: '1.125rem', fontWeight: '600' }}>
        เกิดข้อผิดพลาด
      </div>
      <div style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px' }}>
        {error}
      </div>
      <button
        onClick={refreshData}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--primary)',
          color: 'var(--text-white)',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}
      >
        ลองใหม่อีกครั้ง
      </button>
    </div>
  );

  // Show error state
  if (error && !userData) {
    return renderError();
  }

  const navItems = getNavItems();

  // Function to get background color for nav item
  const getNavItemBackgroundColor = (itemId) => {
    if (activeSection === itemId) {
      return 'var(--primary)';
    }
    if (hoveredItem === itemId) {
      return 'var(--bg-secondary)';
    }
    return 'transparent';
  };

  // Function to get text color for nav item
  const getNavItemTextColor = (itemId) => {
    if (activeSection === itemId) {
      return 'var(--text-white)';
    }
    return 'var(--text-secondary)';
  };

  // Render navigation items
  const renderNavItem = (item) => (
    <button
      key={item.id}
      onClick={() => handleNavigation(item.id)}
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      style={{
        width: '100%',
        padding: '0.75rem 1rem',
        border: 'none',
        borderRadius: '0.5rem',
        backgroundColor: getNavItemBackgroundColor(item.id),
        color: getNavItemTextColor(item.id),
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        marginBottom: '0.25rem',
        position: 'relative'
      }}
    >
      <item.icon size={18} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && item.badge > 0 && (
        <span style={{
          backgroundColor: activeSection === item.id ? 'rgba(255,255,255,0.2)' : 'var(--accent)',
          color: 'var(--text-white)',
          borderRadius: '50%',
          width: '1.25rem',
          height: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.625rem',
          fontWeight: '600'
        }}>
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
    </button>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-secondary)',
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative'
    }}>
      {/* Mock API Indicator */}
      {USE_MOCK_API && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          backgroundColor: '#17a2b8',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          fontSize: '0.75rem',
          zIndex: 2000,
          fontWeight: '500',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          🧪 Mock API Mode
        </div>
      )}

      {/* Sidebar */}
      <div style={{
        width: isMobile && mobileMenuOpen ? '100%' : isMobile ? '0' : '280px',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: isMobile ? 1000 : 100,
        transform: isMobile ? (mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s ease',
        boxShadow: isDesktop ? 'none' : '2px 0 10px rgba(0,0,0,0.1)',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/">
              <img src={logo} className="App-logo" alt="logo" style={{ height: "40px" }} />
            </Link>
          </div>
          
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                color: 'var(--text-muted)'
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* User Profile */}
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              background: loading ? 'var(--bg-secondary)' : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-white)'
            }}>
              {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : getAvatarInitials(displayUserData)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {loading ? 'กำลังโหลด...' : (displayUserData.name || `${displayUserData.firstName || ''} ${displayUserData.lastName || ''}`.trim() || 'ผู้ใช้')}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {loading ? '...' : displayUserData.email || ''}
              </div>
            </div>
          </div>
          
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '0.5rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              แพคเกจปัจจุบัน
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {loading ? 'กำลังโหลด...' : (currentPackage?.packageName || 'ไม่มีแพคเกจ')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {loading ? '...' : (currentPackage?.trainerName ? `กับ ${currentPackage.trainerName}` : '')}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: '1rem',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: 'var(--text-muted)', 
              marginBottom: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              paddingLeft: '0.25rem'
            }}>
              เมนูหลัก
            </div>
            {navItems.slice(0, 6).map(renderNavItem)}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: 'var(--text-muted)', 
              marginBottom: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              paddingLeft: '0.25rem'
            }}>
              การสื่อสาร
            </div>
            {navItems.slice(6, 8).map(renderNavItem)}
          </div>

          <div>
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: 'var(--text-muted)', 
              marginBottom: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              paddingLeft: '0.25rem'
            }}>
              บัญชี
            </div>
            {navItems.slice(8).map(renderNavItem)}
          </div>
        </nav>

        {/* Footer */}
        <div style={{ 
          padding: '1rem', 
          borderTop: '1px solid var(--border-color)',
          flexShrink: 0,
          backgroundColor: 'var(--bg-primary)'
        }}>
          <button 
            onClick={handleLogout}
            disabled={loading || isNavigating}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: (loading || isNavigating) ? 'not-allowed' : 'pointer',
              opacity: (loading || isNavigating) ? 0.6 : 1
            }}
          >
            {(loading || isNavigating) ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <LogOut size={18} />}
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        marginLeft: isMobile ? '0' : '280px',
        paddingBottom: isMobile ? '80px' : '0',
        width: isMobile ? '100%' : 'calc(100% - 280px)'
      }}>
        {/* Mobile Header */}
        <div style={{
          display: isMobile ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          minHeight: '70px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                color: 'var(--text-primary)'
              }}
            >
              <Menu size={20} />
            </button>
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--primary)' }}>
                FitConnect {USE_MOCK_API && '(Mock)'}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => handleNavigation('notifications')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                color: 'var(--text-primary)',
                position: 'relative'
              }}
            >
              <Bell size={20} />
              {badgeCounts.notificationsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0.25rem',
                  right: '0.25rem',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--text-white)',
                  borderRadius: '50%',
                  width: '0.75rem',
                  height: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.625rem',
                  fontWeight: '600'
                }}>
                  {badgeCounts.notificationsCount > 9 ? '9+' : badgeCounts.notificationsCount}
                </span>
              )}
            </button>
            
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: loading ? 'var(--bg-secondary)' : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--text-white)'
            }}>
              {loading ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> : getAvatarInitials(displayUserData)}
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <main style={{
          flex: 1,
          backgroundColor: 'var(--bg-secondary)',
          padding: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: '100vh',
          width: '100%'
        }}>
          {/* Render active section content */}
          {(() => {
            const commonProps = {
              userData: displayUserData,
              currentPackage,
              badgeCounts,
              loading,
              userId: localStorage.getItem('userId') || 'user123',
              refreshData,
              updateBadgeCount,
              apiService
            };

            switch (activeSection) {
              case 'dashboard':
                return <ClientDashboardOverview {...commonProps} />;
              case 'workout-plan':
                return <ClientWorkoutPlan {...commonProps} />;
              case 'schedule':
                return <ClientSchedule {...commonProps} />;
              case 'progress':
                return <ClientProgress {...commonProps} />;
              case 'nutrition':
                return <ClientNutrition {...commonProps} />;
              case 'coupons':
                return <ClientCoupons {...commonProps} />;
              case 'messages':
                return <ClientMessages {...commonProps} />;
              case 'reviews':
                return <ClientReviews {...commonProps} />;
              case 'achievements':
                return <ClientAchievements {...commonProps} />;
              case 'notifications':
                return <ClientNotifications {...commonProps} />;
              case 'billing':
                return <ClientBilling {...commonProps} />;
              case 'settings':
                return <ClientSettings {...commonProps} />;
              default:
                return <ClientDashboardOverview {...commonProps} />;
            }
          })()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        padding: '0.75rem',
        display: isMobile ? 'block' : 'none',
        zIndex: 100,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          {navItems.slice(0, 4).map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              style={{
                padding: '0.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                backgroundColor: 'transparent',
                color: activeSection === item.id ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.625rem',
                fontWeight: '500',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0.25rem',
                  right: '0.75rem',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--text-white)',
                  borderRadius: '50%',
                  width: '1rem',
                  height: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.625rem',
                  fontWeight: '600'
                }}>
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{
              padding: '0.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.625rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <Menu size={20} />
            <span>เมนู</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainClientDashboard;