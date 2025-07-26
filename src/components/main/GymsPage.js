// src/components/main/GymsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, Wifi, Car } from 'lucide-react';
import ApiService from '../../services/api';

const GymsPage = () => {
  const navigate = useNavigate();
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    fetchGyms();
  }, [locationFilter, priceFilter]);

  const fetchGyms = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get('/gyms', {
        params: { 
          search: searchTerm,
          location: locationFilter,
          priceRange: priceFilter 
        }
      });
      setGyms(response.gyms || []);
    } catch (error) {
      console.error('Error fetching gyms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGyms();
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#232956' }}>
            ยิมและฟิตเนส
          </h1>
          <p className="lead text-muted">
            ค้นหายิมและศูนย์ออกกำลังกายใกล้คุณ
          </p>
        </div>

        {/* Search and Filter */}
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSearch}>
              <div className="row g-3">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ชื่อยิมหรือพื้นที่..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="">ทุกพื้นที่</option>
                    <option value="bangkok">กรุงเทพมหานคร</option>
                    <option value="nonthaburi">นนทบุรี</option>
                    <option value="pathum-thani">ปทุมธานี</option>
                    <option value="samut-prakan">สมุทรปราการ</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="">ทุกราคา</option>
                    <option value="0-500">0 - 500 บาท</option>
                    <option value="500-1000">500 - 1,000 บาท</option>
                    <option value="1000-2000">1,000 - 2,000 บาท</option>
                    <option value="2000+">2,000+ บาท</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn btn-primary w-100">
                    ค้นหา
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Gyms Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">กำลังโหลด...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {gyms.map(gym => (
              <GymCard 
                key={gym.id} 
                gym={gym}
                onClick={() => navigate(`/gym/${gym.id}`)}
              />
            ))}
          </div>
        )}

        {gyms.length === 0 && !loading && (
          <div className="text-center py-5">
            <h4 className="text-muted">ไม่พบยิม</h4>
            <p className="text-muted">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
};

const GymCard = ({ gym, onClick }) => (
  <div className="col-md-6 col-lg-4">
    <div className="card h-100 gym-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="position-relative">
        <img
          src={gym.image || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"}
          alt={gym.name}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-primary">
            <Star size={14} className="me-1" />
            {gym.rating}
          </span>
        </div>
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{gym.name}</h5>
        <p className="card-text flex-grow-1">{gym.description}</p>
        
        <div className="mt-auto">
          <div className="d-flex align-items-center text-muted mb-2">
            <MapPin size={16} className="me-2" />
            <small>{gym.address}</small>
          </div>
          
          <div className="d-flex align-items-center text-muted mb-2">
            <Clock size={16} className="me-2" />
            <small>เปิด {gym.openTime} - {gym.closeTime}</small>
          </div>
          
          {/* Amenities */}
          <div className="d-flex gap-2 mb-3">
            {gym.hasWifi && <Wifi size={16} className="text-success" title="Wi-Fi" />}
            {gym.hasParking && <Car size={16} className="text-success" title="ที่จอดรถ" />}
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="h6 text-primary mb-0">฿{gym.monthlyPrice}</span>
              <small className="text-muted"> /เดือน</small>
            </div>
            <button className="btn btn-outline-primary btn-sm">
              ดูรายละเอียด
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default GymsPage;
