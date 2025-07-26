// src/components/main/ArticlesPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, Eye, Tag } from 'lucide-react';
import ApiService from '../../services/api';

const ArticlesPage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [selectedCategory, currentPage]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get('/articles', {
        params: {
          page: currentPage,
          limit: 9,
          search: searchTerm,
          category: selectedCategory
        }
      });
      setArticles(response.articles || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ApiService.get('/articles/categories');
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchArticles();
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: '#232956' }}>
            บทความและเคล็ดลับ
          </h1>
          <p className="lead text-muted">
            ความรู้และเคล็ดลับเกี่ยวกับการออกกำลังกายและสุขภาพ
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
                  placeholder="ค้นหาบทความ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  <Search size={16} className="me-1" />
                  ค้นหา
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">หมวดหมู่ทั้งหมด</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">กำลังโหลด...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article}
                onClick={() => navigate(`/article/${article.id}`)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Articles pagination" className="mt-5">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  ก่อนหน้า
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  ถัดไป
                </button>
              </li>
            </ul>
          </nav>
        )}

        {articles.length === 0 && !loading && (
          <div className="text-center py-5">
            <h4 className="text-muted">ไม่พบบทความ</h4>
            <p className="text-muted">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ArticleCard = ({ article, onClick }) => (
  <div className="col-md-6 col-lg-4">
    <div className="card h-100 article-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="position-relative">
        <img
          src={article.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"}
          alt={article.title}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
        {article.category && (
          <div className="position-absolute top-0 start-0 m-2">
            <span className="badge bg-primary">
              <Tag size={12} className="me-1" />
              {article.category.name}
            </span>
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{article.title}</h5>
        <p className="card-text flex-grow-1">{article.excerpt}</p>
        
        <div className="mt-auto">
          <div className="d-flex align-items-center text-muted mb-2">
            <User size={14} className="me-2" />
            <small>{article.author}</small>
          </div>
          
          <div className="d-flex justify-content-between align-items-center text-muted">
            <div className="d-flex align-items-center">
              <Calendar size={14} className="me-1" />
              <small>{new Date(article.publishedAt).toLocaleDateString('th-TH')}</small>
            </div>
            <div className="d-flex align-items-center">
              <Eye size={14} className="me-1" />
              <small>{article.views} ครั้ง</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ArticlesPage;
