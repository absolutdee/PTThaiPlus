// src/components/main/TrainerSignUpPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Award, Camera, 
  Upload, Plus, X, Save, Loader, CheckCircle 
} from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { authService } from '../../services/auth';
import { uploadService } from '../../services/upload';

const TrainerSignUpPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useNotification();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form Data
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    province: '',
    postalCode: ''
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    specializations: [],
    experience: '',
    certifications: [],
    education: '',
    bio: '',
    languages: ['ไทย']
  });

  const [businessInfo, setBusinessInfo] = useState({
    serviceAreas: [],
    workingHours: {
      monday: { start: '09:00', end: '18:00', available: true },
      tuesday: { start: '09:00', end: '18:00', available: true },
      wednesday: { start: '09:00', end: '18:00', available: true },
      thursday: { start: '09:00', end: '18:00', available: true },
      friday: { start: '09:00', end: '18:00', available: true },
      saturday: { start: '09:00', end: '16:00', available: true },
      sunday: { start: '10:00', end: '16:00', available: false }
    },
    packages: [
      {
        id: 1,
        name: 'แพคเกจพื้นฐาน',
        description: '',
        sessions: 4,
        price: 2000,
        duration: 60
      }
    ]
  });

  const [documents, setDocuments] = useState({
    profilePhoto: null,
    portfolioImages: [],
    certificationFiles: [],
    idCard: null
  });

  const [agreementAccepted, setAgreementAccepted] = useState(false);

  // Options
  const specializationOptions = [
    'ลดน้ำหนัก', 'เพิ่มกล้ามเนื้อ', 'โยคะ', 'พิลาทิส', 'มวย', 'วิ่ง',
    'ฟิตเนสทั่วไป', 'แอโรบิค', 'ความแข็งแรง', 'ความยืดหยุ่น',
    'กายภาพบำบัด', 'ผู้สูงอายุ', 'เด็กและวัยรุ่น', 'คนพิการ'
  ];

  const provinceOptions = [
    'กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร'
  ];

  const languageOptions = ['ไทย', 'อังกฤษ', 'จีน', 'ญี่ปุ่น', 'เกาหลี'];

  // Step validation
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return personalInfo.firstName && personalInfo.lastName && 
               personalInfo.email && personalInfo.phone;
      case 2:
        return professionalInfo.specializations.length > 0 && 
               professionalInfo.experience && professionalInfo.bio;
      case 3:
        return businessInfo.serviceAreas.length > 0 && 
               businessInfo.packages.length > 0;
      case 4:
        return documents.profilePhoto && agreementAccepted;
      default:
        return true;
    }
  };

  // Handle file upload
  const handleFileUpload = async (file, type) => {
    try {
      const result = await uploadService.uploadFile(file, {
        folder: `trainer-applications/${type}`,
        maxSize: type === 'profilePhoto' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
      });
      return result.url;
    } catch (error) {
      showError(error.message);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      showError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload files
      let profilePhotoUrl = null;
      if (documents.profilePhoto) {
        profilePhotoUrl = await handleFileUpload(documents.profilePhoto, 'profilePhoto');
      }

      const portfolioUrls = [];
      for (const image of documents.portfolioImages) {
        const url = await handleFileUpload(image, 'portfolio');
        if (url) portfolioUrls.push(url);
      }

      const certificationUrls = [];
      for (const cert of documents.certificationFiles) {
        const url = await handleFileUpload(cert, 'certifications');
        if (url) certificationUrls.push(url);
      }

      let idCardUrl = null;
      if (documents.idCard) {
        idCardUrl = await handleFileUpload(documents.idCard, 'idCard');
      }

      // Prepare application data
      const applicationData = {
        ...personalInfo,
        ...professionalInfo,
        ...businessInfo,
        documents: {
          profilePhoto: profilePhotoUrl,
          portfolioImages: portfolioUrls,
          certificationFiles: certificationUrls,
          idCard: idCardUrl
        },
        status: 'pending'
      };

      await authService.registerTrainer(applicationData);
      
      showSuccess('ส่งใบสมัครเรียบร้อยแล้ว! เราจะตรวจสอบและติดต่อกลับภายใน 3-5 วันทำการ');
      navigate('/signin');
      
    } catch (error) {
      showError(error.message || 'เกิดข้อผิดพลาดในการส่งใบสมัคร');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(4, prev + 1));
    } else {
      showError('กรุณากรอกข้อมูลให้ครบถ้วนก่อนดำเนินการต่อ');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="step-indicator mb-4">
      <div className="d-flex justify-content-between align-items-center">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`step-circle ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: currentStep >= step ? '#232956' : '#e9ecef',
                color: currentStep >= step ? 'white' : '#6c757d',
                fontWeight: '600'
              }}
            >
              {currentStep > step ? <CheckCircle size={20} /> : step}
            </div>
            {step < 4 && (
              <div
                className="step-line"
                style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: currentStep > step ? '#232956' : '#e9ecef',
                  margin: '0 1rem'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="row mt-2">
        <div className="col-3 text-center">
          <small className="text-muted">ข้อมูลส่วนตัว</small>
        </div>
        <div className="col-3 text-center">
          <small className="text-muted">ข้อมูลวิชาชีพ</small>
        </div>
        <div className="col-3 text-center">
          <small className="text-muted">การให้บริการ</small>
        </div>
        <div className="col-3 text-center">
          <small className="text-muted">เอกสารและยืนยัน</small>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        paddingTop: '80px',
        paddingBottom: '40px'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold" style={{ color: '#232956' }}>
                สมัครเป็นเทรนเนอร์
              </h1>
              <p className="lead text-muted">
                เข้าร่วมกับเราและเริ่มต้นการเป็นเทรนเนอร์มืออาชีพ
              </p>
            </div>

            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <StepIndicator />

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="step-content">
                    <h3 className="mb-4">ข้อมูลส่วนตัว</h3>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">ชื่อ *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={personalInfo.firstName}
                          onChange={(e) => setPersonalInfo(prev => ({
                            ...prev, firstName: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">นามสกุล *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={personalInfo.lastName}
                          onChange={(e) => setPersonalInfo(prev => ({
                            ...prev, lastName: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">อีเมล *</label>
                        <input
                          type="email"
                          className="form-control"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo(prev => ({
                            ...prev, email: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">เบอร์โทรศัพท์ *</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo(prev => ({
                            ...prev, phone: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">วันเกิด</label>
                        <input
                          type="date"
                          className="form-control"
                          value={personalInfo.dateOfBirth}
                          onChange={(e) => setPersonalInfo(prev => ({
                            ...prev, dateOfBirth: e.target.value
                          }))}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">เพศ</label>
                        <select
                          className="form-select"
                          value={personalInfo.gender}
                          onChange={(e) => setPersonalInfo(prev => ({
                            ...prev, gender: e.target.value
                          }))}
                        >
                          <option value="">เลือกเพศ</option>
                          <option value="male">ชาย</option>
                          <option value="female">หญิง</option>
                          <option value="other">อื่นๆ</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">ที่อยู่</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={personalInfo.address}
                          onChange={(e) => setPersonalInfo(prev => ({
                            ...prev, address: e.target.value
                          }))}
                        />
                      </div>
                      <div className="col-md-8">
                        <label className="form-label">จังหวัด</label>
                        <select
                          className="form-select"
                          value={personalInfo.province}
                          onChange={(e) => setPersonalInfo(prev => ({
                            ...prev, province: e.target.value
                          }))}
                        >
                          <option value="">เลือกจังหวัด</option>
                          {provinceOptions.map(province => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">รหัสไปรษณีย์</label>
                        <input
                          type="text"
                          className="form-control"
                          value={personalInfo.postalCode}
                          onChange={(e) => setPersonalInfo(prev => ({
                            ...prev, postalCode: e.target.value
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Information */}
                {currentStep === 2 && (
                  <div className="step-content">
                    <h3 className="mb-4">ข้อมูลวิชาชีพ</h3>
                    
                    <div className="mb-4">
                      <label className="form-label">ความเชี่ยวชาญ *</label>
                      <div className="row g-2">
                        {specializationOptions.map(spec => (
                          <div key={spec} className="col-md-4">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={spec}
                                checked={professionalInfo.specializations.includes(spec)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setProfessionalInfo(prev => ({
                                      ...prev,
                                      specializations: [...prev.specializations, spec]
                                    }));
                                  } else {
                                    setProfessionalInfo(prev => ({
                                      ...prev,
                                      specializations: prev.specializations.filter(s => s !== spec)
                                    }));
                                  }
                                }}
                              />
                              <label className="form-check-label" htmlFor={spec}>
                                {spec}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">ประสบการณ์ (ปี) *</label>
                      <select
                        className="form-select"
                        value={professionalInfo.experience}
                        onChange={(e) => setProfessionalInfo(prev => ({
                          ...prev, experience: e.target.value
                        }))}
                      >
                        <option value="">เลือกประสบการณ์</option>
                        <option value="0-1">น้อยกว่า 1 ปี</option>
                        <option value="1-3">1-3 ปี</option>
                        <option value="3-5">3-5 ปี</option>
                        <option value="5-10">5-10 ปี</option>
                        <option value="10+">มากกว่า 10 ปี</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">การศึกษา</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="เช่น ปริญญาตรี วิทยาศาสตร์การกีฬา จุฬาลงกรณ์มหาวิทยาลัย"
                        value={professionalInfo.education}
                        onChange={(e) => setProfessionalInfo(prev => ({
                          ...prev, education: e.target.value
                        }))}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">แนะนำตัว *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="เล่าเกี่ยวกับตัวคุณ ประสบการณ์ และเหตุผลที่เป็นเทรนเนอร์..."
                        value={professionalInfo.bio}
                        onChange={(e) => setProfessionalInfo(prev => ({
                          ...prev, bio: e.target.value
                        }))}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">ภาษาที่สามารถสื่อสารได้</label>
                      <div className="row g-2">
                        {languageOptions.map(lang => (
                          <div key={lang} className="col-md-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={lang}
                                checked={professionalInfo.languages.includes(lang)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setProfessionalInfo(prev => ({
                                      ...prev,
                                      languages: [...prev.languages, lang]
                                    }));
                                  } else {
                                    setProfessionalInfo(prev => ({
                                      ...prev,
                                      languages: prev.languages.filter(l => l !== lang)
                                    }));
                                  }
                                }}
                              />
                              <label className="form-check-label" htmlFor={lang}>
                                {lang}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Business Information */}
                {currentStep === 3 && (
                  <div className="step-content">
                    <h3 className="mb-4">การให้บริการ</h3>
                    
                    <div className="mb-4">
                      <label className="form-label">พื้นที่ให้บริการ *</label>
                      <div className="row g-2">
                        {provinceOptions.map(area => (
                          <div key={area} className="col-md-4">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={area}
                                checked={businessInfo.serviceAreas.includes(area)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setBusinessInfo(prev => ({
                                      ...prev,
                                      serviceAreas: [...prev.serviceAreas, area]
                                    }));
                                  } else {
                                    setBusinessInfo(prev => ({
                                      ...prev,
                                      serviceAreas: prev.serviceAreas.filter(a => a !== area)
                                    }));
                                  }
                                }}
                              />
                              <label className="form-check-label" htmlFor={area}>
                                {area}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="mb-4">
                      <label className="form-label">เวลาทำงาน</label>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>วัน</th>
                              <th>เปิดบริการ</th>
                              <th>เวลาเริ่ม</th>
                              <th>เวลาสิ้นสุด</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(businessInfo.workingHours).map(([day, hours]) => (
                              <tr key={day}>
                                <td>{
                                  {
                                    monday: 'จันทร์', tuesday: 'อังคาร', wednesday: 'พุธ',
                                    thursday: 'พฤหัสบดี', friday: 'ศุกร์', saturday: 'เสาร์', sunday: 'อาทิตย์'
                                  }[day]
                                }</td>
                                <td>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={hours.available}
                                      onChange={(e) => setBusinessInfo(prev => ({
                                        ...prev,
                                        workingHours: {
                                          ...prev.workingHours,
                                          [day]: { ...hours, available: e.target.checked }
                                        }
                                      }))}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="time"
                                    className="form-control form-control-sm"
                                    value={hours.start}
                                    disabled={!hours.available}
                                    onChange={(e) => setBusinessInfo(prev => ({
                                      ...prev,
                                      workingHours: {
                                        ...prev.workingHours,
                                        [day]: { ...hours, start: e.target.value }
                                      }
                                    }))}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="time"
                                    className="form-control form-control-sm"
                                    value={hours.end}
                                    disabled={!hours.available}
                                    onChange={(e) => setBusinessInfo(prev => ({
                                      ...prev,
                                      workingHours: {
                                        ...prev.workingHours,
                                        [day]: { ...hours, end: e.target.value }
                                      }
                                    }))}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Package Information */}
                    <div className="mb-4">
                      <label className="form-label">แพคเกจการให้บริการ *</label>
                      {businessInfo.packages.map((pkg, index) => (
                        <div key={pkg.id} className="card mb-3">
                          <div className="card-body">
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label">ชื่อแพคเกจ</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={pkg.name}
                                  onChange={(e) => {
                                    const updatedPackages = [...businessInfo.packages];
                                    updatedPackages[index].name = e.target.value;
                                    setBusinessInfo(prev => ({
                                      ...prev, packages: updatedPackages
                                    }));
                                  }}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">ราคา (บาท)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={pkg.price}
                                  onChange={(e) => {
                                    const updatedPackages = [...businessInfo.packages];
                                    updatedPackages[index].price = parseInt(e.target.value);
                                    setBusinessInfo(prev => ({
                                      ...prev, packages: updatedPackages
                                    }));
                                  }}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">จำนวนเซสชั่น</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={pkg.sessions}
                                  onChange={(e) => {
                                    const updatedPackages = [...businessInfo.packages];
                                    updatedPackages[index].sessions = parseInt(e.target.value);
                                    setBusinessInfo(prev => ({
                                      ...prev, packages: updatedPackages
                                    }));
                                  }}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">ระยะเวลา (นาที)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={pkg.duration}
                                  onChange={(e) => {
                                    const updatedPackages = [...businessInfo.packages];
                                    updatedPackages[index].duration = parseInt(e.target.value);
                                    setBusinessInfo(prev => ({
                                      ...prev, packages: updatedPackages
                                    }));
                                  }}
                                />
                              </div>
                              <div className="col-12">
                                <label className="form-label">รายละเอียด</label>
                                <textarea
                                  className="form-control"
                                  rows="2"
                                  value={pkg.description}
                                  onChange={(e) => {
                                    const updatedPackages = [...businessInfo.packages];
                                    updatedPackages[index].description = e.target.value;
                                    setBusinessInfo(prev => ({
                                      ...prev, packages: updatedPackages
                                    }));
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Documents and Agreement */}
                {currentStep === 4 && (
                  <div className="step-content">
                    <h3 className="mb-4">เอกสารและการยืนยัน</h3>
                    
                    <div className="mb-4">
                      <label className="form-label">รูปโปรไฟล์ *</label>
                      <div className="border rounded p-3 text-center">
                        {documents.profilePhoto ? (
                          <div>
                            <img
                              src={URL.createObjectURL(documents.profilePhoto)}
                              alt="Profile"
                              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                            <div className="mt-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => setDocuments(prev => ({ ...prev, profilePhoto: null }))}
                              >
                                ลบรูป
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Camera size={48} className="text-muted mb-2" />
                            <p className="text-muted">คลิกเพื่อเลือกรูปโปรไฟล์</p>
                            <input
                              type="file"
                              accept="image/*"
                              className="d-none"
                              id="profilePhoto"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  setDocuments(prev => ({ ...prev, profilePhoto: e.target.files[0] }));
                                }
                              }}
                            />
                            <label htmlFor="profilePhoto" className="btn btn-outline-primary">
                              <Upload size={16} className="me-2" />
                              เลือกรูป
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="agreement"
                          checked={agreementAccepted}
                          onChange={(e) => setAgreementAccepted(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="agreement">
                          ฉันยอมรับ{' '}
                          <Link to="/terms" target="_blank" className="text-decoration-none">
                            ข้อตกลงการให้บริการ
                          </Link>{' '}
                          และ{' '}
                          <Link to="/privacy" target="_blank" className="text-decoration-none">
                            นโยบายความเป็นส่วนตัว
                          </Link>{' '}
                          ของ FitConnect
                        </label>
                      </div>
                    </div>

                    <div className="alert alert-info">
                      <h6 className="alert-heading">ขั้นตอนต่อไป</h6>
                      <p className="mb-0">
                        หลังจากส่งใบสมัครแล้ว ทีมงานจะตรวจสอบข้อมูลและติดต่อกลับภายใน 3-5 วันทำการ 
                        หากผ่านการอนุมัติ คุณจะได้รับอีเมลยืนยันพร้อมคำแนะนำในการเริ่มต้น
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={prevStep}
                        disabled={isSubmitting}
                      >
                        ย้อนกลับ
                      </button>
                    )}
                  </div>
                  <div>
                    {currentStep < 4 ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={nextStep}
                      >
                        ดำเนินการต่อ
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !agreementAccepted}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader size={16} className="me-2" style={{ animation: 'spin 1s linear infinite' }} />
                            กำลังส่งใบสมัคร...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="me-2" />
                            ส่งใบสมัคร
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Help Text */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    มีคำถาม? <Link to="/contact" className="text-decoration-none">ติดต่อเรา</Link> หรือ 
                    โทร <a href="tel:02-123-4567" className="text-decoration-none">02-123-4567</a>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerSignUpPage;
