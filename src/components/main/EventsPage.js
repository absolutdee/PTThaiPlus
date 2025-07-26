// src/components/main/EventsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import ApiService from '../../services/api';

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, ongoing, past
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get('/events', {
        params: { filter, search: searchTerm }
      });
      setEvents(response.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#232956' }}>
            อีเว้นท์และกิจกรรม
          </h1>
          <p className="lead text-muted">
            เข้าร่วมกิจกรรมออกกำลังกายและสุขภาพที่น่าสนใจ
          </p>
        </div>

        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-8">
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="ค้นหาอีเว้นท์..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  ค้นหา
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">อีเว้นท์ทั้งหมด</option>
              <option value="upcoming">กำลังจะเกิดขึ้น</option>
              <option value="ongoing">กำลังดำเนินการ</option>
              <option value="past">ผ่านมาแล้ว</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">กำลังโหลด...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {events.map(event => (
              <EventCard 
                key={event.id} 
                event={event}
                onClick={() => navigate(`/event/${event.id}`)}
              />
            ))}
          </div>
        )}

        {events.length === 0 && !loading && (
          <div className="text-center py-5">
            <h4 className="text-muted">ไม่พบอีเว้นท์</h4>
            <p className="text-muted">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event, onClick }) => {
  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { class: 'bg-info', text: 'กำลังจะเกิดขึ้น' },
      ongoing: { class: 'bg-success', text: 'กำลังดำเนินการ' },
      past: { class: 'bg-secondary', text: 'จบแล้ว' },
      cancelled: { class: 'bg-danger', text: 'ยกเลิก' }
    };
    const badge = badges[status] || badges.upcoming;
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 event-card" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className="position-relative">
          <img
            src={event.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"}
            alt={event.title}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            {getStatusBadge(event.status)}
          </div>
        </div>
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{event.title}</h5>
          <p className="card-text flex-grow-1">{event.description}</p>
          
          <div className="mt-auto">
            <div className="d-flex align-items-center text-muted mb-2">
              <Calendar size={16} className="me-2" />
              <small>{new Date(event.startDate).toLocaleDateString('th-TH')}</small>
            </div>
            
            <div className="d-flex align-items-center text-muted mb-2">
              <Clock size={16} className="me-2" />
              <small>{event.startTime} - {event.endTime}</small>
            </div>
            
            <div className="d-flex align-items-center text-muted mb-2">
              <MapPin size={16} className="me-2" />
              <small>{event.location}</small>
            </div>
            
            <div className="d-flex align-items-center text-muted mb-3">
              <Users size={16} className="me-2" />
              <small>{event.participantCount}/{event.maxParticipants} คน</small>
            </div>
            
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="h6 text-primary mb-0">
                  {event.price === 0 ? 'ฟรี' : `฿${event.price}`}
                </span>
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
};

export default EventsPage;
