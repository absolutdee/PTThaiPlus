// src/components/main/TrainerSearchPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import ApiService from '../../services/api';

const TrainerSearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search filters
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    specialty: searchParams.get('specialty') || '',
    priceRange: searchParams.get('price') || '',
    rating: '',
    experience: '',
    availability: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    searchTrainers();
  }, [filters, currentPage]);

  const searchTrainers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...filters
      };
      
      const response = await ApiService.get('/trainers/search', { params });
      setTrainers(response.trainers);
      setTotalResults(response.total);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      specialty: '',
      priceRange: '',
      rating: '',
      experience: '',
      availability: ''
    });
    setCurrentPage(1);
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Header */}
      <div className="container py-4">
        <div className="row align-items-center mb-4">
          <div className="col-md-6">
            <h1 className="h2 mb-2" style={{ color: '#232956' }}>
              ค้นหาเทรนเนอร์
            </h1>
            <p className="text-muted mb-0">
              พบ {totalResults.toLocaleString()} เทรนเนอร์ที่ตรงกับความต้องการของคุณ
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="btn-group" role="group">
              <button
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th-large me-1"></i> กริด
              </button>
              <button
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list me-1"></i> รายการ
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <MapPin size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ตำแหน่งที่ต้องการ"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.specialty}
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                >
                  <option value="">ความเชี่ยวชาญทั้งหมด</option>
                  <option value="ลดน้ำหนัก">ลดน้ำหนัก</option>
                  <option value="เพิ่มกล้ามเนื้อ">เพิ่มกล้ามเนื้อ</option>
                  <option value="โยคะ">โยคะ</option>
                  <option value="พิลาทิส">พิลาทิส</option>
                  <option value="มวย">มวย</option>
                  <option value="วิ่ง">วิ่ง</option>
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                >
                  <option value="">ราคาทั้งหมด</option>
                  <option value="0-500">0 - 500 บาท</option>
                  <option value="500-1000">500 - 1,000 บาท</option>
                  <option value="1000-2000">1,000 - 2,000 บาท</option>
                  <option value="2000+">2,000+ บาท</option>
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={16} className="me-1" />
                  ตัวกรอง
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="row g-3 mt-3 pt-3 border-top">
                <div className="col-md-3">
                  <label className="form-label">คะแนนขั้นต่ำ</label>
                  <select
                    className="form-select"
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                  >
                    <option value="">ไม่จำกัด</option>
                    <option value="4">4+ ดาว</option>
                    <option value="4.5">4.5+ ดาว</option>
                    <option value="5">5 ดาว</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">ประสบการณ์</label>
                  <select
                    className="form-select"
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                  >
                    <option value="">ไม่จำกัด</option>
                    <option value="1-2">1-2 ปี</option>
                    <option value="3-5">3-5 ปี</option>
                    <option value="5+">5+ ปี</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">ความพร้อม</label>
                  <select
                    className="form-select"
                    value={filters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                  >
                    <option value="">ไม่จำกัด</option>
                    <option value="morning">เช้า</option>
                    <option value="afternoon">บ่าย</option>
                    <option value="evening">เย็น</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={clearFilters}
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">กำลังโหลด...</span>
            </div>
          </div>
        ) : (
          <div className={`row ${viewMode === 'grid' ? 'g-4' : 'g-3'}`}>
            {trainers.map(trainer => (
              <TrainerCard 
                key={trainer.id} 
                trainer={trainer} 
                viewMode={viewMode}
                onClick={() => navigate(`/trainer/${trainer.id}`)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalResults > 12 && (
          <nav aria-label="Trainer search pagination" className="mt-5">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  ก่อนหน้า
                </button>
              </li>
              {[...Array(Math.ceil(totalResults / 12))].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === Math.ceil(totalResults / 12) ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  ถัดไป
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

// Trainer Card Component
const TrainerCard = ({ trainer, viewMode, onClick }) => {
  if (viewMode === 'list') {
    return (
      <div className="col-12">
        <div className="card h-100 trainer-card-list" onClick={onClick} style={{ cursor: 'pointer' }}>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-2">
                <img
                  src={trainer.profileImage || "https://images.unsplash.com/photo-1566753323558-f4e0952af115"}
                  alt={trainer.name}
                  className="rounded-circle"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-6">
                <h5 className="card-title mb-1">{trainer.name}</h5>
                <p className="text-muted mb-2">{trainer.specialization}</p>
                <div className="d-flex align-items-center mb-2">
                  <Star size={16} className="text-warning me-1" />
                  <span>{trainer.rating} ({trainer.reviewCount} รีวิว)</span>
                </div>
                <p className="card-text text-truncate">{trainer.bio}</p>
              </div>
              <div className="col-md-2 text-center">
                <div className="h5 mb-1 text-primary">฿{trainer.pricePerSession}</div>
                <small className="text-muted">ต่อเซสชั่น</small>
              </div>
              <div className="col-md-2 text-center">
                <button className="btn btn-primary">ดูรายละเอียด</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-4">
      <div className="card h-100 trainer-card" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className="position-relative">
          <img
            src={trainer.profileImage || "https://images.unsplash.com/photo-1566753323558-f4e0952af115"}
            alt={trainer.name}
            className="card-img-top"
            style={{ height: '250px', objectFit: 'cover' }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-primary">
              <Star size={14} className="me-1" />
              {trainer.rating}
            </span>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">{trainer.name}</h5>
          <p className="text-muted mb-2">{trainer.specialization}</p>
          <p className="card-text">{trainer.bio}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="h6 text-primary mb-0">฿{trainer.pricePerSession}</span>
              <small className="text-muted"> /เซสชั่น</small>
            </div>
            <button className="btn btn-outline-primary btn-sm">ดูรายละเอียด</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerSearchPage;
