import React, { Suspense, lazy, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Bootstrap CSS (แก้ไขปัญหา CSS)
import 'bootstrap/dist/css/bootstrap.min.css';

// Custom CSS (ป้องกัน crash ถ้าไฟล์ไม่มี)
try {
  require('./styles/main.css');
} catch (e) {
  console.warn('Main CSS file not found, using fallback styles');
}

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
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
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h2>⚠️ เกิดข้อผิดพลาด</h2>
            <p>ขออภัย เกิดข้อผิดพลาดในการโหลดแอปพลิเคชัน</p>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
            <button 
              className="btn btn-primary mt-3" 
              onClick={() => window.location.reload()}
            >
              🔄 โหลดหน้าใหม่
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">กำลังโหลด...</p>
    </div>
  </div>
);

// Fallback Home Component (ใช้เมื่อ HomePage หลักไม่ทำงาน)
const FallbackHome = () => (
  <div className="container-fluid">
    {/* Hero Section */}
    <div className="row min-vh-100 d-flex align-items-center" style={{background: 'linear-gradient(135deg, #232956 0%, #df2528 100%)'}}>
      <div className="col-12 text-center text-white">
        <h1 className="display-4 fw-bold mb-4">🏋️‍♂️ FitConnect</h1>
        <p className="lead mb-4">แพลตฟอร์มค้นหาเทรนเนอร์ออกกำลังกายที่ดีที่สุดในประเทศไทย</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button className="btn btn-light btn-lg px-4 py-2">
            🔍 ค้นหาเทรนเนอร์
          </button>
          <button className="btn btn-outline-light btn-lg px-4 py-2">
            📝 สมัครเป็นเทรนเนอร์
          </button>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div className="row py-5">
      <div className="col-12">
        <h2 className="text-center mb-5">✨ ฟีเจอร์เด่น</h2>
        <div className="row">
          <div className="col-md-4 text-center mb-4">
            <div className="p-4">
              <div className="fs-1 mb-3">👨‍💼</div>
              <h4>เทรนเนอร์คุณภาพ</h4>
              <p>เทรนเนอร์มืออาชีพที่ผ่านการคัดเลือกอย่างเข้มงวด</p>
            </div>
          </div>
          <div className="col-md-4 text-center mb-4">
            <div className="p-4">
              <div className="fs-1 mb-3">💬</div>
              <h4>แชทสด</h4>
              <p>สื่อสารกับเทรนเนอร์ได้ตลอด 24 ชั่วโมง</p>
            </div>
          </div>
          <div className="col-md-4 text-center mb-4">
            <div className="p-4">
              <div className="fs-1 mb-3">📊</div>
              <h4>ติดตามผล</h4>
              <p>ระบบติดตามความก้าวหน้าอย่างละเอียด</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Stats Section */}
    <div className="row py-5 bg-light">
      <div className="col-12">
        <div className="row text-center">
          <div className="col-6 col-md-3 mb-4">
            <h3 className="text-primary fw-bold">1,000+</h3>
            <p>เทรนเนอร์</p>
          </div>
          <div className="col-6 col-md-3 mb-4">
            <h3 className="text-primary fw-bold">10,000+</h3>
            <p>ลูกค้า</p>
          </div>
          <div className="col-6 col-md-3 mb-4">
            <h3 className="text-primary fw-bold">50,000+</h3>
            <p>เซสชั่น</p>
          </div>
          <div className="col-6 col-md-3 mb-4">
            <h3 className="text-primary fw-bold">4.8⭐</h3>
            <p>คะแนนเฉลี่ย</p>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="row py-4 bg-dark text-white">
      <div className="col-12 text-center">
        <p>&copy; 2024 FitConnect. All rights reserved.</p>
        <p>🚀 Status: Development Mode</p>
      </div>
    </footer>
  </div>
);

// Lazy load components with fallbacks
const MainWebsite = lazy(() => 
  import('./components/main/MainWebsite').catch(() => ({
    default: FallbackHome
  }))
);

// Individual page components for routing
const HomePage = lazy(() => 
  import('./components/main/HomePage').catch(() => ({
    default: FallbackHome
  }))
);

const TrainerSearchPage = lazy(() => 
  import('./components/main/TrainerSearchPage').catch(() => ({
    default: () => <div className="container mt-5"><h2>🔍 Trainer Search (Coming Soon)</h2></div>
  }))
);

const TrainerDetailPage = lazy(() => 
  import('./components/main/TrainerDetailPage').catch(() => ({
    default: () => <div className="container mt-5"><h2>👨‍💼 Trainer Detail (Coming Soon)</h2></div>
  }))
);

const EventsPage = lazy(() => 
  import('./components/main/EventsPage').catch(() => ({
    default: () => <div className="container mt-5"><h2>📅 Events (Coming Soon)</h2></div>
  }))
);

const GymsPage = lazy(() => 
  import('./components/main/GymsPage').catch(() => ({
    default: () => <div className="container mt-5"><h2>🏋️ Gyms (Coming Soon)</h2></div>
  }))
);

const ArticlesPage = lazy(() => 
  import('./components/main/ArticlesPage').catch(() => ({
    default: () => <div className="container mt-5"><h2>📝 Articles (Coming Soon)</h2></div>
  }))
);

const ContactPage = lazy(() => 
  import('./components/main/ContactPage').catch(() => ({
    default: () => <div className="container mt-5"><h2>📞 Contact (Coming Soon)</h2></div>
  }))
);

const SignInPage = lazy(() => 
  import('./components/main/SignInPage').catch(() => ({
    default: () => <div className="container mt-5"><h2>🔐 Sign In (Coming Soon)</h2></div>
  }))
);

const SignUpPage = lazy(() => 
  import('./components/main/SignUpPage').catch(() => ({
    default: () => <div className="container mt-5"><h2>📝 Sign Up (Coming Soon)</h2></div>
  }))
);

const ForgotPasswordPage = lazy(() => 
  import('./components/main/ForgotPasswordPage').catch(() => ({
    default: () => <div className="container mt-5"><h2>📝 Sign Up (Coming Soon)</h2></div>
  }))
);

function App() {
  return (
    <ErrorBoundary>
      <Router basename={process.env.NODE_ENV === 'production' ? '/PTThaiPlus' : ''}>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Main Website with nested routes */}
              <Route path="/" element={<MainWebsite />}>
                <Route index element={<HomePage />} />
                <Route path="search" element={<TrainerSearchPage />} />
                <Route path="trainer/:id" element={<TrainerDetailPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="gyms" element={<GymsPage />} />
                <Route path="articles" element={<ArticlesPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="signin" element={<SignInPage />} />
                <Route path="signup" element={<SignUpPage />} />
                <Route path="forgotpassword" element={<ForgotPasswordPage />} />
              </Route>
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;