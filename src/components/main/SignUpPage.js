import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { authService } from '../../services/auth';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      showError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (formData.password.length < 6) {
      showError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (!formData.terms) {
      showError('กรุณายอมรับข้อตกลงการใช้งาน');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'client'
      });

      showSuccess('สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี');
      navigate('/signin');
    } catch (error) {
      showError(error.message || 'สมัครสมาชิกไม่สำเร็จ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center"
      style={{
        background: 'linear-gradient(135deg, #232956 0%, #df2528 100%)',
        paddingTop: '80px',
        paddingBottom: '40px'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
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
                    สมัครสมาชิก
                  </h2>
                  <p className="text-muted">
                    เริ่มต้นการเดินทางสู่สุขภาพที่ดีกับเรา
                  </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">ชื่อ</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <User size={18} />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="ชื่อ"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">นามสกุล</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="นามสกุล"
                        required
                      />
                    </div>

                    <div className="col-12">
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
                          placeholder="อีเมลของคุณ"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">เบอร์โทรศัพท์</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <Phone size={18} />
                        </span>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0xx-xxx-xxxx"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
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
                          placeholder="รหัสผ่าน"
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

                    <div className="col-md-6">
                      <label className="form-label">ยืนยันรหัสผ่าน</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <Lock size={18} />
                        </span>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-control"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="ยืนยันรหัสผ่าน"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="terms"
                          id="terms"
                          checked={formData.terms}
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-label" htmlFor="terms">
                          ฉันยอมรับ{' '}
                          <Link to="/terms" className="text-decoration-none">
                            ข้อตกลงการใช้งาน
                          </Link>{' '}
                          และ{' '}
                          <Link to="/privacy" className="text-decoration-none">
                            นโยบายความเป็นส่วนตัว
                          </Link>
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <button 
                        type="submit" 
                        className="btn btn-primary w-100 py-2 mb-3"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">กำลังสมัครสมาชิก...</span>
                            </div>
                            กำลังสมัครสมาชิก...
                          </>
                        ) : (
                          <>
                            <UserPlus size={18} className="me-2" />
                            สมัครสมาชิก
                          </>
                        )}
                      </button>

                      <div className="text-center">
                        <span className="text-muted">มีบัญชีอยู่แล้ว? </span>
                        <Link to="/signin" className="text-decoration-none fw-bold">
                          เข้าสู่ระบบ
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
