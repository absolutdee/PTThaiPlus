// src/components/main/SignInPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
        remember: formData.remember
      });

      showSuccess('เข้าสู่ระบบสำเร็จ');
      
      // Redirect to intended page or dashboard
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (error) {
      showError(error.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center"
      style={{
        background: 'linear-gradient(135deg, #232956 0%, #df2528 100%)',
        paddingTop: '80px'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Logo and Title */}
                <div className="text-center mb-4">
                  <img 
                    src="/assets/images/logo.png" 
                    alt="FitConnect" 
                    style={{ height: '60px' }}
                    className="mb-3"
                  />
                  <h2 className="fw-bold" style={{ color: '#232956' }}>
                    เข้าสู่ระบบ
                  </h2>
                  <p className="text-muted">
                    ยินดีต้อนรับกลับสู่ FitConnect
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">อีเมล</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="กรอกอีเมลของคุณ"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">รหัสผ่าน</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="กรอกรหัสผ่าน"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="remember"
                        id="remember"
                        checked={formData.remember}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="remember">
                        จดจำฉัน
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none">
                      ลืมรหัสผ่าน?
                    </Link>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2 mb-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">กำลังเข้าสู่ระบบ...</span>
                        </div>
                        กำลังเข้าสู่ระบบ...
                      </>
                    ) : (
                      <>
                        <LogIn size={18} className="me-2" />
                        เข้าสู่ระบบ
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <span className="text-muted">ยังไม่มีบัญชี? </span>
                    <Link to="/signup" className="text-decoration-none fw-bold">
                      สมัครสมาชิก
                    </Link>
                  </div>
                </form>

                {/* Divider */}
                <div className="text-center my-4">
                  <hr />
                  <span className="text-muted bg-white px-3">หรือ</span>
                </div>

                {/* Trainer Signup Link */}
                <div className="text-center">
                  <Link 
                    to="/signup-trainer" 
                    className="btn btn-outline-secondary w-100"
                  >
                    สมัครเป็นเทรนเนอร์
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
