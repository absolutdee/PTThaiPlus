import React, { Suspense, lazy, Component, useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// ===========================
// Error Boundary Component
// ===========================
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // ส่งข้อมูล error ไปยัง analytics (ถ้ามี)
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" 
             style={{background: 'linear-gradient(135deg, #232956 0%, #df2528 100%)'}}>
          <div className="text-center text-white p-5" style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            maxWidth: '500px'
          }}>
            <div className="display-1 mb-4">⚠️</div>
            <h2 className="mb-3">เกิดข้อผิดพลาด</h2>
            <p className="mb-4">ขออภัย เกิดข้อผิดพลาดในการโหลดแอปพลิเคชัน</p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-4 text-start" 
                      style={{ 
                        whiteSpace: 'pre-wrap', 
                        fontSize: '0.8rem',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '1rem',
                        borderRadius: '8px'
                      }}>
                <summary className="cursor-pointer mb-2">รายละเอียดข้อผิดพลาด</summary>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </details>
            )}
            
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button 
                className="btn btn-light btn-lg px-4" 
                onClick={this.handleRetry}
                disabled={this.state.retryCount >= 3}
              >
                🔄 ลองอีกครั้ง {this.state.retryCount > 0 && `(${this.state.retryCount}/3)`}
              </button>
              <button 
                className="btn btn-outline-light btn-lg px-4" 
                onClick={() => window.location.reload()}
              >
                🏠 โหลดหน้าใหม่
              </button>
            </div>
            
            <p className="mt-3 opacity-75 small">
              หากปัญหายังไม่หายไป กรุณาติดต่อทีมสนับสนุน
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ===========================
// Loading Component
// ===========================
const LoadingSpinner = ({ message = "กำลังโหลด..." }) => (
  <div className="d-flex justify-content-center align-items-center vh-100" 
       style={{background: 'linear-gradient(135deg, #232956 0%, #df2528 100%)'}}>
    <div className="text-center text-white">
      <div className="mb-4" style={{fontSize: '4rem'}}>🏋️‍♂️</div>
      <div className="spinner-border text-light mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <h4 className="mb-2">FitConnect</h4>
      <p className="opacity-75">{message}</p>
    </div>
  </div>
);

// ===========================
// Fallback Home Component
// ===========================
const FallbackHome = () => (
  <div className="container-fluid">
    {/* Hero Section */}
    <div className="row min-vh-100 d-flex align-items-center" 
         style={{background: 'linear-gradient(135deg, #232956 0%, #df2528 100%)'}}>
      <div className="col-12 text-center text-white">
        <div className="display-1 mb-4">🏋️‍♂️</div>
        <h1 className="display-4 fw-bold mb-4">FitConnect</h1>
        <p className="lead mb-4 mx-auto" style={{maxWidth: '600px'}}>
          แพลตฟอร์มค้นหาเทรนเนอร์ออกกำลังกายที่ดีที่สุดในประเทศไทย<br/>
          เชื่อมต่อคุณกับเทรนเนอร์มืออาชีพ
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button className="btn btn-light btn-lg px-4 py-3" 
                  onClick={() => window.location.href = '/search'}>
            🔍 ค้นหาเทรนเนอร์
          </button>
          <button className="btn btn-outline-light btn-lg px-4 py-3"
                  onClick={() => window.location.href = '/signup-trainer'}>
            📝 สมัครเป็นเทรนเนอร์
          </button>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div className="row py-5 bg-light">
      <div className="col-12">
        <h2 className="text-center mb-5">✨ ฟีเจอร์เด่น</h2>
        <div className="row g-4">
          {[
            { icon: '👨‍💼', title: 'เทรนเนอร์คุณภาพ', desc: 'เทรนเนอร์มืออาชีพที่ผ่านการคัดเลือกอย่างเข้มงวด' },
            { icon: '💬', title: 'แชทสด', desc: 'สื่อสารกับเทรนเนอร์ได้ตลอด 24 ชั่วโมง' },
            { icon: '📊', title: 'ติดตามผล', desc: 'ระบบติดตามความก้าวหน้าอย่างละเอียด' },
            { icon: '🏋️', title: 'ยิมใกล้เคียง', desc: 'ค้นหายิมและฟิตเนสในพื้นที่ของคุณ' },
            { icon: '📱', title: 'ใช้งานง่าย', desc: 'ออกแบบให้ใช้งานง่ายทั้งมือถือและคอมพิวเตอร์' },
            { icon: '⭐', title: 'รีวิวจริง', desc: 'รีวิวจากลูกค้าจริงที่ใช้บริการ' }
          ].map((feature, index) => (
            <div key={index} className="col-md-4 text-center mb-4">
              <div className="p-4 h-100 border rounded shadow-sm bg-white">
                <div className="fs-1 mb-3">{feature.icon}</div>
                <h4 className="mb-3">{feature.title}</h4>
                <p className="text-muted">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Stats Section */}
    <div className="row py-5" style={{background: '#f8f9fa'}}>
      <div className="col-12">
        <h2 className="text-center mb-5">📈 สถิติของเรา</h2>
        <div className="row text-center">
          {[
            { number: '1,000+', label: 'เทรนเนอร์', icon: '👥' },
            { number: '10,000+', label: 'ลูกค้า', icon: '😊' },
            { number: '50,000+', label: 'เซสชั่น', icon: '💪' },
            { number: '4.8⭐', label: 'คะแนนเฉลี่ย', icon: '🏆' }
          ].map((stat, index) => (
            <div key={index} className="col-6 col-md-3 mb-4">
              <div className="p-3">
                <div className="fs-2 mb-2">{stat.icon}</div>
                <h3 className="fw-bold mb-1" style={{color: '#232956'}}>{stat.number}</h3>
                <p className="text-muted mb-0">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Call to Action */}
    <div className="row py-5" style={{background: 'linear-gradient(135deg, #232956 0%, #df2528 100%)'}}>
      <div className="col-12 text-center text-white">
        <h2 className="mb-4">🚀 พร้อมเริ่มต้นหรือยัง?</h2>
        <p className="lead mb-4">เข้าร่วมกับเราวันนี้และเริ่มต้นการเปลี่ยนแปลงชีวิตของคุณ</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button 
            className="btn btn-light btn-lg px-4 py-3"
            onClick={() => window.location.href = '/signup'}
          >
            📝 สมัครสมาชิก
          </button>
          <button 
            className="btn btn-outline-light btn-lg px-4 py-3"
            onClick={() => window.location.href = '/contact'}
          >
            📞 ติดต่อเรา
          </button>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="row py-4 bg-dark text-white">
      <div className="col-12 text-center">
        <div className="mb-3">
          <h5>🏋️‍♂️ FitConnect</h5>
          <p className="mb-2">แพลตฟอร์มเทรนเนอร์ออกกำลังกายที่ดีที่สุดในประเทศไทย</p>
        </div>
        <div className="row">
          <div className="col-md-6">
            <p>&copy; 2024 FitConnect. All rights reserved.</p>
          </div>
          <div className="col-md-6">
            <p>
              🚀 Status: Development Mode | 
              <span className="ms-2">
                Version: 1.0.0
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

// ===========================
// Simple Auth Context
// ===========================
const AuthContext = createContext();

const SimpleAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบ authentication จาก localStorage
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('authUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('authUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  };

  if (loading) {
    return <LoadingSpinner message="กำลังตรวจสอบการเข้าสู่ระบบ..." />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// ===========================
// Lazy Load Components with Error Handling
// ===========================
const createLazyComponent = (importFunc, fallbackComponent = FallbackHome) => {
  return lazy(() => 
    importFunc().catch((error) => {
      console.warn('Component import failed:', error);
      return { default: fallbackComponent };
    })
  );
};

// Main Website Components
const MainWebsite = createLazyComponent(() => import('./components/main/MainWebsite'));
const HomePage = createLazyComponent(() => import('./components/main/HomePage'));
const TrainerSearchPage = createLazyComponent(() => import('./components/main/TrainerSearchPage'));
const TrainerDetailPage = createLazyComponent(() => import('./components/main/TrainerDetailPage'));
const EventsPage = createLazyComponent(() => import('./components/main/EventsPage'));
const EventDetailPage = createLazyComponent(() => import('./components/main/EventDetailPage'));
const GymsPage = createLazyComponent(() => import('./components/main/GymsPage'));
const ArticlesPage = createLazyComponent(() => import('./components/main/ArticlesPage'));
const ArticleDetailPage = createLazyComponent(() => import('./components/main/ArticleDetailPage'));
const ContactPage = createLazyComponent(() => import('./components/main/ContactPage'));
const SignInPage = createLazyComponent(() => import('./components/main/SignInPage'));
const SignUpPage = createLazyComponent(() => import('./components/main/SignUpPage'));
const ForgotPasswordPage = createLazyComponent(() => import('./components/main/ForgotPasswordPage'));
const SignUpTrainer = createLazyComponent(() => import('./components/main/TrainerSignUpPage'));

// Dashboard Components
const AdminMainPage = createLazyComponent(() => import('./components/admin/AdminLayout'));
const MainClientDashboard = createLazyComponent(() => import('./components/client/MainClientDashboard'));
const TrainerMainDashboard = createLazyComponent(() => import('./components/trainer/TrainerMainDashboard'));

// ===========================
// Main App Component
// ===========================
function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // ✅ useEffect ที่อยู่ในตำแหน่งที่ถูกต้อง (ใน component)
  useEffect(() => {
    // เพิ่ม CSS ที่จำเป็น inline เพื่อป้องกันไฟล์หาย
    const inlineStyles = `
      .btn-gradient {
        background: linear-gradient(135deg, #232956 0%, #df2528 100%);
        border: none;
        color: white;
      }
      .btn-gradient:hover {
        background: linear-gradient(135deg, #1e2344 0%, #c41f22 100%);
        color: white;
      }
      .text-primary-custom {
        color: #232956 !important;
      }
      .bg-primary-custom {
        background-color: #232956 !important;
      }
      .bg-secondary-custom {
        background-color: #df2528 !important;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = inlineStyles;
    document.head.appendChild(styleSheet);
    
    return () => {
      // Cleanup
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ปิด loading screen เมื่อ React โหลดเสร็จ
  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 1000);
    }
  }, []);

  return (
    <ErrorBoundary>
      <SimpleAuthProvider>
        <Router basename={process.env.NODE_ENV === 'production' ? '/PTThaiPlus' : ''}>
          <div className="App">
            {/* Offline Indicator */}
            {!isOnline && (
              <div className="alert alert-warning text-center mb-0 rounded-0" role="alert">
                📡 ไม่มีการเชื่อมต่ออินเทอร์เน็ต - บางฟีเจอร์อาจไม่ทำงาน
              </div>
            )}
            
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Main Website Routes */}
                <Route path="/" element={<MainWebsite />}>
                  <Route index element={<HomePage />} />
                  <Route path="search" element={<TrainerSearchPage />} />
                  <Route path="trainer/:id" element={<TrainerDetailPage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="event/:id" element={<EventDetailPage />} />
                  <Route path="gyms" element={<GymsPage />} />
                  <Route path="articles" element={<ArticlesPage />} />
                  <Route path="article/:id" element={<ArticleDetailPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="signin" element={<SignInPage />} />
                  <Route path="signup" element={<SignUpPage />} />
                  <Route path="forgotpassword" element={<ForgotPasswordPage />} />
                  <Route path="signup-trainer" element={<SignUpTrainer />} />
                </Route>

                {/* Dashboard Routes */}
                <Route path="/admin/*" element={<AdminMainPage />} />
                <Route path="/client/*" element={<MainClientDashboard />} />
                <Route path="/trainer/*" element={<TrainerMainDashboard />} />

                {/* Fallback Routes */}
                <Route path="/fallback" element={<FallbackHome />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </SimpleAuthProvider>
    </ErrorBoundary>
  );
}

export default App;