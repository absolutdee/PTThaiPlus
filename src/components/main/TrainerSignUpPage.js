// src/components/main/TrainerSignUpPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// ✅ ลบ lucide-react และใช้ Font Awesome แทน

const TrainerSignUpPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    profilePicture: null,
    
    // Professional Information
    experience: '',
    certifications: [],
    specialties: [],
    bio: '',
    
    // Location & Availability
    serviceAreas: [],
    availableSchedule: {
      monday: { available: false, start: '', end: '' },
      tuesday: { available: false, start: '', end: '' },
      wednesday: { available: false, start: '', end: '' },
      thursday: { available: false, start: '', end: '' },
      friday: { available: false, start: '', end: '' },
      saturday: { available: false, start: '', end: '' },
      sunday: { available: false, start: '', end: '' }
    },
    
    // Pricing
    hourlyRate: '',
    packageDeals: [],
    
    // Documents
    documents: {
      certificate: null,
      idCard: null,
      resume: null
    },
    
    // Agreement
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form validation
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'กรุณากรอกชื่อ';
        if (!formData.lastName.trim()) newErrors.lastName = 'กรุณากรอกนามสกุล';
        if (!formData.email.trim()) newErrors.email = 'กรุณากรอกอีเมล';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
        if (!formData.password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
        if (formData.password.length < 8) newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
        if (!formData.phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
        break;
        
      case 2:
        if (!formData.experience) newErrors.experience = 'กรุณาเลือกประสบการณ์';
        if (formData.specialties.length === 0) newErrors.specialties = 'กรุณาเลือกความเชี่ยวชาญอย่างน้อย 1 รายการ';
        if (!formData.bio.trim()) newErrors.bio = 'กรุณากรอกประวัติส่วนตัว';
        break;
        
      case 3:
        if (formData.serviceAreas.length === 0) newErrors.serviceAreas = 'กรุณาเลือกพื้นที่บริการอย่างน้อย 1 แห่ง';
        if (!formData.hourlyRate) newErrors.hourlyRate = 'กรุณากรอกราคาต่อชั่วโมง';
        break;
        
      case 4:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'กรุณายอมรับข้อกำหนดการใช้งาน';
        if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'กรุณายอมรับนโยบายความเป็นส่วนตัว';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Add all form data
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          Object.keys(formData.documents).forEach(docKey => {
            if (formData.documents[docKey]) {
              submitData.append(`documents.${docKey}`, formData.documents[docKey]);
            }
          });
        } else if (key === 'profilePicture' && formData.profilePicture) {
          submitData.append('profilePicture', formData.profilePicture);
        } else if (typeof formData[key] === 'object') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/trainer/signup', {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        const result = await response.json();
        alert('สมัครสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี');
        navigate('/signin');
      } else {
        throw new Error('การสมัครไม่สำเร็จ');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle array fields
  const handleArrayChange = (field, value, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  // Step 1: Personal Information
  const renderStep1 = () => (
    <div className="step-content">
      <h3 className="step-title">
        <i className="fas fa-user me-2"></i>
        ข้อมูลส่วนตัว
      </h3>
      
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">ชื่อ *</label>
          <input
            type="text"
            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="กรอกชื่อของคุณ"
          />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
        </div>
        
        <div className="col-md-6">
          <label className="form-label">นามสกุล *</label>
          <input
            type="text"
            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="กรอกนามสกุลของคุณ"
          />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
        </div>
        
        <div className="col-12">
          <label className="form-label">อีเมล *</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="example@email.com"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        
        <div className="col-md-6">
          <label className="form-label">รหัสผ่าน *</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="รหัสผ่านอย่างน้อย 8 ตัวอักษร"
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        
        <div className="col-md-6">
          <label className="form-label">ยืนยันรหัสผ่าน *</label>
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="ยืนยันรหัสผ่าน"
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>
        
        <div className="col-md-6">
          <label className="form-label">เบอร์โทรศัพท์ *</label>
          <input
            type="tel"
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="0xx-xxx-xxxx"
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>
        
        <div className="col-md-6">
          <label className="form-label">วันเกิด</label>
          <input
            type="date"
            className="form-control"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          />
        </div>
        
        <div className="col-md-6">
          <label className="form-label">เพศ</label>
          <select
            className="form-select"
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
          >
            <option value="">เลือกเพศ</option>
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
            <option value="other">อื่นๆ</option>
          </select>
        </div>
        
        <div className="col-12">
          <label className="form-label">รูปโปรไฟล์</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => handleInputChange('profilePicture', e.target.files[0])}
          />
          <small className="form-text text-muted">ไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 5MB</small>
        </div>
      </div>
    </div>
  );

  // Step 2: Professional Information  
  const renderStep2 = () => (
    <div className="step-content">
      <h3 className="step-title">
        <i className="fas fa-dumbbell me-2"></i>
        ข้อมูลวิชาชีพ
      </h3>
      
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">ประสบการณ์การสอน *</label>
          <select
            className={`form-select ${errors.experience ? 'is-invalid' : ''}`}
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
          >
            <option value="">เลือกประสบการณ์</option>
            <option value="0-1">0-1 ปี</option>
            <option value="2-3">2-3 ปี</option>
            <option value="4-5">4-5 ปี</option>
            <option value="5+">มากกว่า 5 ปี</option>
          </select>
          {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
        </div>
        
        <div className="col-12">
          <label className="form-label">ความเชี่ยวชาญ * (เลือกได้หลายรายการ)</label>
          {errors.specialties && <div className="text-danger small mb-2">{errors.specialties}</div>}
          <div className="row g-2">
            {[
              'ลดน้ำหนัก', 'เพิ่มกล้ามเนื้อ', 'คาร์ดิโอ', 'ความแข็งแรง', 'ความยืดหยุ่น',
              'โยคะ', 'พิลาทิส', 'มวยไทย', 'ครอสฟิต', 'ว่ายน้ำ', 'เต้นรำ', 'วิ่ง'
            ].map(specialty => (
              <div key={specialty} className="col-md-4 col-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`specialty-${specialty}`}
                    checked={formData.specialties.includes(specialty)}
                    onChange={(e) => handleArrayChange('specialties', specialty, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={`specialty-${specialty}`}>
                    {specialty}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-12">
          <label className="form-label">ประวัติส่วนตัวและประสบการณ์ *</label>
          <textarea
            className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
            rows="4"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="เล่าเกี่ยวกับตัวคุณ ประสบการณ์ และแนวทางการสอน..."
          />
          {errors.bio && <div className="invalid-feedback">{errors.bio}</div>}
        </div>
        
        <div className="col-12">
          <label className="form-label">ใบรับรอง/ประกาศนียบัตร</label>
          <input
            type="file"
            className="form-control"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={(e) => handleInputChange('certifications', Array.from(e.target.files))}
          />
          <small className="form-text text-muted">อัปโหลดไฟล์ใบรับรอง PDF หรือรูปภาพ</small>
        </div>
      </div>
    </div>
  );

  // Step 3: Service & Pricing
  const renderStep3 = () => (
    <div className="step-content">
      <h3 className="step-title">
        <i className="fas fa-map-marker-alt me-2"></i>
        พื้นที่บริการและราคา
      </h3>
      
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">พื้นที่ให้บริการ *</label>
          {errors.serviceAreas && <div className="text-danger small mb-2">{errors.serviceAreas}</div>}
          <div className="row g-2">
            {[
              'กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร',
              'นครปฐม', 'เชียงใหม่', 'ภูเก็ต', 'ชลบุรี', 'ระยอง', 'ขอนแก่น', 'อุดรธานี'
            ].map(area => (
              <div key={area} className="col-md-4 col-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`area-${area}`}
                    checked={formData.serviceAreas.includes(area)}
                    onChange={(e) => handleArrayChange('serviceAreas', area, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={`area-${area}`}>
                    {area}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-md-6">
          <label className="form-label">ราคาต่อชั่วโมง (บาท) *</label>
          <input
            type="number"
            className={`form-control ${errors.hourlyRate ? 'is-invalid' : ''}`}
            value={formData.hourlyRate}
            onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
            placeholder="500"
            min="100"
            max="5000"
          />
          {errors.hourlyRate && <div className="invalid-feedback">{errors.hourlyRate}</div>}
        </div>
        
        <div className="col-12">
          <h5>ตารางเวลาที่ว่าง</h5>
          <div className="schedule-grid">
            {Object.keys(formData.availableSchedule).map(day => {
              const dayNames = {
                monday: 'จันทร์', tuesday: 'อังคาร', wednesday: 'พุธ',
                thursday: 'พฤหัสบดี', friday: 'ศุกร์', saturday: 'เสาร์', sunday: 'อาทิตย์'
              };
              
              return (
                <div key={day} className="row align-items-center mb-2">
                  <div className="col-md-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`day-${day}`}
                        checked={formData.availableSchedule[day].available}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            availableSchedule: {
                              ...prev.availableSchedule,
                              [day]: {
                                ...prev.availableSchedule[day],
                                available: e.target.checked
                              }
                            }
                          }));
                        }}
                      />
                      <label className="form-check-label" htmlFor={`day-${day}`}>
                        {dayNames[day]}
                      </label>
                    </div>
                  </div>
                  
                  {formData.availableSchedule[day].available && (
                    <>
                      <div className="col-md-3">
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          value={formData.availableSchedule[day].start}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              availableSchedule: {
                                ...prev.availableSchedule,
                                [day]: {
                                  ...prev.availableSchedule[day],
                                  start: e.target.value
                                }
                              }
                            }));
                          }}
                        />
                      </div>
                      <div className="col-md-1 text-center">-</div>
                      <div className="col-md-3">
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          value={formData.availableSchedule[day].end}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              availableSchedule: {
                                ...prev.availableSchedule,
                                [day]: {
                                  ...prev.availableSchedule[day],
                                  end: e.target.value
                                }
                              }
                            }));
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Documents & Agreement
  const renderStep4 = () => (
    <div className="step-content">
      <h3 className="step-title">
        <i className="fas fa-file-alt me-2"></i>
        เอกสารและข้อตกลง
      </h3>
      
      <div className="row g-3">
        <div className="col-12">
          <h5>อัปโหลดเอกสาร</h5>
          <p className="text-muted">เอกสารเหล่านี้จะช่วยเพิ่มความน่าเชื่อถือให้กับโปรไฟล์ของคุณ</p>
        </div>
        
        <div className="col-md-6">
          <label className="form-label">บัตรประชาชน</label>
          <input
            type="file"
            className="form-control"
            accept="image/*,.pdf"
            onChange={(e) => setFormData(prev => ({
              ...prev,
              documents: { ...prev.documents, idCard: e.target.files[0] }
            }))}
          />
        </div>
        
        <div className="col-md-6">
          <label className="form-label">ใบรับรองหลักสูตร</label>
          <input
            type="file"
            className="form-control"
            accept="image/*,.pdf"
            onChange={(e) => setFormData(prev => ({
              ...prev,
              documents: { ...prev.documents, certificate: e.target.files[0] }
            }))}
          />
        </div>
        
        <div className="col-12">
          <label className="form-label">เรซูเม่/ประวัติการทำงาน</label>
          <input
            type="file"
            className="form-control"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFormData(prev => ({
              ...prev,
              documents: { ...prev.documents, resume: e.target.files[0] }
            }))}
          />
        </div>
        
        <div className="col-12">
          <hr />
          <h5>ข้อตกลงและเงื่อนไข</h5>
        </div>
        
        <div className="col-12">
          <div className="form-check">
            <input
              className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="agreeToTerms">
              ฉันยอมรับ <Link to="/terms" target="_blank">ข้อกำหนดการใช้งาน</Link> *
            </label>
            {errors.agreeToTerms && <div className="invalid-feedback d-block">{errors.agreeToTerms}</div>}
          </div>
        </div>
        
        <div className="col-12">
          <div className="form-check">
            <input
              className={`form-check-input ${errors.agreeToPrivacy ? 'is-invalid' : ''}`}
              type="checkbox"
              id="agreeToPrivacy"
              checked={formData.agreeToPrivacy}
              onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="agreeToPrivacy">
              ฉันยอมรับ <Link to="/privacy" target="_blank">นโยบายความเป็นส่วนตัว</Link> *
            </label>
            {errors.agreeToPrivacy && <div className="invalid-feedback d-block">{errors.agreeToPrivacy}</div>}
          </div>
        </div>
      </div>
    </div>
  );

  const totalSteps = 4;

  return (
    <>
      {/* Add required styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap');
        
        :root {
          --primary-color: #232956;
          --secondary-color: #df2528;
          --light-bg: #f8f9fa;
        }
        
        body {
          font-family: 'Kanit', sans-serif;
          background: var(--light-bg);
        }
        
        .trainer-signup-page {
          min-height: 100vh;
          padding: 2rem 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .signup-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .signup-header {
          background: var(--primary-color);
          color: white;
          padding: 2rem;
          text-align: center;
        }
        
        .progress-bar {
          display: flex;
          justify-content: space-between;
          margin: 1rem 0;
        }
        
        .progress-step {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.3);
          margin: 0 2px;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        
        .progress-step.active {
          background: var(--secondary-color);
        }
        
        .signup-body {
          padding: 2rem;
        }
        
        .step-title {
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--secondary-color);
        }
        
        .form-label {
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }
        
        .form-control, .form-select {
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 0.75rem;
          transition: all 0.3s ease;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: var(--secondary-color);
          box-shadow: 0 0 0 3px rgba(223, 37, 40, 0.1);
        }
        
        .btn-primary-custom {
          background: var(--secondary-color);
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary-custom:hover {
          background: #c41f22;
          transform: translateY(-2px);
        }
        
        .btn-outline-primary-custom {
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
          background: transparent;
          padding: 0.75rem 2rem;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-outline-primary-custom:hover {
          background: var(--primary-color);
          color: white;
        }
        
        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }
        
        .schedule-grid {
          background: var(--light-bg);
          padding: 1rem;
          border-radius: 8px;
        }
        
        @media (max-width: 768px) {
          .signup-container {
            margin: 1rem;
            border-radius: 15px;
          }
          
          .signup-header, .signup-body {
            padding: 1.5rem;
          }
          
          .navigation-buttons {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>

      <div className="trainer-signup-page">
        <div className="container">
          <div className="signup-container">
            {/* Header */}
            <div className="signup-header">
              <h1 className="mb-3">
                <i className="fas fa-dumbbell me-2"></i>
                สมัครเป็นเทรนเนอร์
              </h1>
              <p className="mb-3">เข้าร่วมกับเทรนเนอร์มืออาชีพและเริ่มสร้างรายได้จากความชำนาญของคุณ</p>
              
              {/* Progress Bar */}
              <div className="progress-bar">
                {[...Array(totalSteps)].map((_, index) => (
                  <div 
                    key={index}
                    className={`progress-step ${index + 1 <= currentStep ? 'active' : ''}`}
                  />
                ))}
              </div>
              
              <div className="mt-3">
                <small>ขั้นตอนที่ {currentStep} จาก {totalSteps}</small>
              </div>
            </div>

            {/* Body */}
            <div className="signup-body">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              {/* Navigation Buttons */}
              <div className="navigation-buttons">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-primary-custom me-2"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      ย้อนกลับ
                    </button>
                  )}
                  
                  <Link to="/signin" className="btn btn-outline-secondary">
                    มีบัญชีแล้ว? เข้าสู่ระบบ
                  </Link>
                </div>

                <div>
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      className="btn btn-primary-custom"
                      onClick={() => {
                        if (validateStep(currentStep)) {
                          setCurrentStep(currentStep + 1);
                        }
                      }}
                    >
                      ถัดไป
                      <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary-custom"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          กำลังสมัคร...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check me-2"></i>
                          สมัครเสร็จสิ้น
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainerSignUpPage;