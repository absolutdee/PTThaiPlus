// src/components/common/ErrorPages.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw, Search } from 'lucide-react';

// 404 Not Found Page
export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="mb-4">
              <div 
                className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#232956',
                  color: 'white',
                  fontSize: '3rem',
                  fontWeight: '700'
                }}
              >
                404
              </div>
            </div>
            
            <h1 className="display-4 fw-bold mb-3" style={{ color: '#232956' }}>
              ไม่พบหน้าที่ต้องการ
            </h1>
            
            <p className="lead text-muted mb-4">
              ขออภัย หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบ หรือไม่มีอยู่จริง
            </p>
            
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/" className="btn btn-primary">
                <Home size={18} className="me-2" />
                กลับหน้าหลัก
              </Link>
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate(-1)}
              >
                <RotateCcw size={18} className="me-2" />
                ย้อนกลับ
              </button>
              <Link to="/search" className="btn btn-outline-secondary">
                <Search size={18} className="me-2" />
                ค้นหาเทรนเนอร์
              </Link>
            </div>
            
            <div className="mt-5">
              <small className="text-muted">
                หากคุณคิดว่านี่เป็นข้อผิดพลาด กรุณา{' '}
                <Link to="/contact" className="text-decoration-none">
                  แจ้งให้เราทราบ
                </Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 500 Server Error Page
export const ServerErrorPage = ({ error, resetError }) => (
  <div 
    className="min-vh-100 d-flex align-items-center justify-content-center"
    style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)' }}
  >
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6 text-center">
          <div className="mb-4">
            <AlertTriangle size={80} className="text-danger mb-3" />
          </div>
          
          <h1 className="display-4 fw-bold mb-3 text-danger">
            เกิดข้อผิดพลาด
          </h1>
          
          <p className="lead text-muted mb-4">
            ขออภัยในความไม่สะดวก เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
          </p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <div className="alert alert-danger text-start mb-4">
              <h6>Error Details:</h6>
              <pre style={{ fontSize: '0.8rem' }}>{error.toString()}</pre>
            </div>
          )}
          
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button 
              className="btn btn-primary"
              onClick={resetError || (() => window.location.reload())}
            >
              <RotateCcw size={18} className="me-2" />
              ลองใหม่
            </button>
            <Link to="/" className="btn btn-outline-primary">
              <Home size={18} className="me-2" />
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Maintenance Mode Page
export const MaintenancePage = ({ estimatedTime }) => (
  <div 
    className="min-vh-100 d-flex align-items-center justify-content-center"
    style={{ background: 'linear-gradient(135deg, #232956 0%, #df2528 100%)' }}
  >
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6 text-center text-white">
          <div className="mb-4">
            <div 
              className="mx-auto mb-4 d-flex align-items-center justify-content-center"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <RotateCcw size={48} className="animate-spin" />
            </div>
          </div>
          
          <h1 className="display-4 fw-bold mb-3">
            กำลังปรับปรุงระบบ
          </h1>
          
          <p className="lead mb-4">
            ขณะนี้เรากำลังปรับปรุงระบบเพื่อให้บริการที่ดีขึ้น
            <br />กรุณากลับมาใหม่ภายหลัง
          </p>
          
          {estimatedTime && (
            <div className="alert alert-info d-inline-block">
              <strong>เวลาที่คาดว่าจะเสร็จ:</strong> {estimatedTime}
            </div>
          )}
          
          <div className="mt-4">
            <p className="mb-2">ติดตามข่าวสารล่าสุดได้ที่:</p>
            <div className="d-flex justify-content-center gap-3">
              <a href="#" className="text-white">
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-instagram"></i> Instagram
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-line"></i> LINE
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Offline Page
export const OfflinePage = () => (
  <div 
    className="min-vh-100 d-flex align-items-center justify-content-center"
    style={{ background: 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)' }}
  >
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6 text-center">
          <div className="mb-4">
            <div 
              className="mx-auto mb-4 d-flex align-items-center justify-content-center"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#6c757d',
                color: 'white'
              }}
            >
              <i className="fas fa-wifi-slash" style={{ fontSize: '3rem' }}></i>
            </div>
          </div>
          
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#6c757d' }}>
            ไม่มีการเชื่อมต่ออินเทอร์เน็ต
          </h1>
          
          <p className="lead text-muted mb-4">
            กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ
            <br />และลองใหม่อีกครั้ง
          </p>
          
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            <RotateCcw size={18} className="me-2" />
            ลองใหม่
          </button>
        </div>
      </div>
    </div>
  </div>
);
