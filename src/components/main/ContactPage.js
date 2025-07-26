// src/components/main/ContactPage.js
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import ApiService from '../../services/api';

const ContactPage = () => {
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await ApiService.post('/contact', formData);
      showSuccess('ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับในเร็วๆ นี้');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      showError('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#232956' }}>
            ติดต่อเรา
          </h1>
          <p className="lead text-muted">
            มีคำถามหรือต้องการความช่วยเหลือ? เราพร้อมช่วยเหลือคุณ
          </p>
        </div>

        <div className="row g-5">
          {/* Contact Information */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-body p-4">
                <h4 className="card-title mb-4" style={{ color: '#232956' }}>
                  ข้อมูลติดต่อ
                </h4>

                <div className="mb-4">
                  <div className="d-flex align-items-start mb-3">
                    <div className="flex-shrink-0 me-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', backgroundColor: '#232956' }}
                      >
                        <MapPin size={20} color="white" />
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-1">ที่อยู่</h6>
                      <p className="text-muted mb-0">
                        123 ถนนฟิตเนส แขวงสุขภาพดี เขตแข็งแรง<br />
                        กรุงเทพมหานคร 10100
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-3">
                    <div className="flex-shrink-0 me-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', backgroundColor: '#df2528' }}
                      >
                        <Phone size={20} color="white" />
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-1">โทรศัพท์</h6>
                      <p className="text-muted mb-0">02-123-4567</p>
                      <p className="text-muted mb-0">095-123-4567</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-3">
                    <div className="flex-shrink-0 me-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', backgroundColor: '#28a745' }}
                      >
                        <Mail size={20} color="white" />
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-1">อีเมล</h6>
                      <p className="text-muted mb-0">info@fitconnect.com</p>
                      <p className="text-muted mb-0">support@fitconnect.com</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', backgroundColor: '#17a2b8' }}
                      >
                        <Clock size={20} color="white" />
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-1">เวลาทำการ</h6>
                      <p className="text-muted mb-0">จันทร์ - ศุกร์: 9:00 - 18:00</p>
                      <p className="text-muted mb-0">เสาร์ - อาทิตย์: 10:00 - 16:00</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-4">
                  <h6 className="mb-3">ติดตามเรา</h6>
                  <div className="d-flex gap-3">
                    <a href="#" className="text-decoration-none">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '35px', height: '35px', backgroundColor: '#3b5998' }}
                      >
                        <i className="fab fa-facebook-f text-white"></i>
                      </div>
                    </a>
                    <a href="#" className="text-decoration-none">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '35px', height: '35px', backgroundColor: '#1da1f2' }}
                      >
                        <i className="fab fa-twitter text-white"></i>
                      </div>
                    </a>
                    <a href="#" className="text-decoration-none">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '35px', height: '35px', backgroundColor: '#e4405f' }}
                      >
                        <i className="fab fa-instagram text-white"></i>
                      </div>
                    </a>
                    <a href="#" className="text-decoration-none">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '35px', height: '35px', backgroundColor: '#25d366' }}
                      >
                        <i className="fab fa-line text-white"></i>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-8">
            <div className="card h-100">
              <div className="card-body p-4">
                <h4 className="card-title mb-4" style={{ color: '#232956' }}>
                  ส่งข้อความถึงเรา
                </h4>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">ชื่อ-นามสกุล *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">อีเมล *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">เบอร์โทรศัพท์</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">หัวข้อ *</label>
                      <select
                        className="form-select"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">เลือกหัวข้อ</option>
                        <option value="general">สอบถามทั่วไป</option>
                        <option value="support">ปัญหาการใช้งาน</option>
                        <option value="trainer">สมัครเป็นเทรนเนอร์</option>
                        <option value="partnership">ความร่วมมือ</option>
                        <option value="complaint">ร้องเรียน</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">ข้อความ *</label>
                      <textarea
                        className="form-control"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="กรุณาเขียนข้อความที่ต้องการสอบถาม..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">กำลังส่ง...</span>
                            </div>
                            กำลังส่ง...
                          </>
                        ) : (
                          <>
                            <Send size={18} className="me-2" />
                            ส่งข้อความ
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card">
              <div className="card-body p-0">
                <div 
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: '400px' }}
                >
                  <div className="text-center">
                    <MapPin size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">แผนที่จะแสดงที่นี่</h5>
                    <p className="text-muted">เชื่อมต่อ Google Maps API เพื่อแสดงตำแหน่ง</p>
                  </div>
                  {/* Google Maps Integration would go here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
