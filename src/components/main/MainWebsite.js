import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Navbar, 
  Nav, 
  Container, 
  Button, 
  Offcanvas,
  Dropdown
} from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from "@emotion/react";
import logo from '../../assets/images/logo-new2020.png';
import logofooter from '../../assets/images/logo-new2020-white.png';
// ✅ แก้ไข: เพิ่ม inline styles แทน import CSS

// ✅ CSS Styles Object
const styles = {
  navbar: {
    background: 'var(--white, #ffffff)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderBottom: '1px solid #f0f0f0',
  },
  navbarBrand: {
    color: 'var(--primary-color, #232956) !important',
    fontWeight: '800',
    fontSize: '2rem',
    letterSpacing: '2px',
    textDecoration: 'none',
  },
  navbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarNavWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem', // ✅ ระยะห่างระหว่าง nav และ auth buttons
  },
  navbarNav: {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '0.5rem', // ✅ ระยะห่างระหว่าง menu items
  },
  navLink: {
    color: 'var(--primary-color, #232956) !important',
    fontWeight: '500',
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '0 0.8rem',
    padding: '0.8rem 0',
    position: 'relative',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    cursor: 'pointer',
  },
  navLinkActive: {
    color: 'var(--secondary-color, #df2528) !important',
  },
  // ✅ เพิ่ม styles สำหรับ hover line effect
  navLinkAfter: {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '0',
    height: '3px',
    background: 'var(--secondary-color, #df2528)',
    transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  btnOutlinePrimary: {
    color: 'var(--primary-color, #232956)',
    borderColor: 'var(--primary-color, #232956)',
    background: 'transparent',
    padding: '0.5rem 1.5rem',
    fontWeight: '600',
    borderRadius: '25px',
    transition: 'all 0.3s ease',
  },
  btnPrimaryCustom: {
    background: 'var(--secondary-color, #df2528)',
    borderColor: 'var(--secondary-color, #df2528)',
    color: 'white',
    padding: '0.5rem 1.5rem',
    fontWeight: '600',
    borderRadius: '25px',
    transition: 'all 0.3s ease',
  },
  footer: {
    background: 'var(--primary-color, #232956)',
    color: 'white',
    padding: '3rem 0 1rem',
  },
  footerBrand: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'white',
    marginBottom: '1rem',
    letterSpacing: '2px',
  },
  socialIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45px',
    height: '45px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '50%',
    fontSize: '1.2rem',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    marginRight: '1rem',
  },
  backToTop: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'var(--secondary-color, #df2528)',
    color: 'white',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 1000,
  }
};

// ✅ เพิ่ม function สำหรับจัดการ hover effect
const addHoverLine = (element) => {
  if (!element.querySelector('.hover-line')) {
    const line = document.createElement('div');
    line.className = 'hover-line';
    line.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 3px;
      background: var(--secondary-color, #df2528);
      transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      pointer-events: none;
    `;
    element.style.position = 'relative';
    element.appendChild(line);
  }
};

const removeHoverLine = (element) => {
  const line = element.querySelector('.hover-line');
  if (line) {
    line.remove();
  }
};

// ✅ เพิ่ม function สำหรับ active line
const addActiveLine = (element) => {
  if (!element.querySelector('.active-line')) {
    const line = document.createElement('div');
    line.className = 'active-line';
    line.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--secondary-color, #df2528);
      animation: slideInFromLeft 0.4s ease-out;
    `;
    element.style.position = 'relative';
    element.appendChild(line);
  }
};

// ✅ เพิ่ม CSS animation ลงใน head
const addAnimationCSS = () => {
  if (!document.querySelector('#nav-animations')) {
    const style = document.createElement('style');
    style.id = 'nav-animations';
    style.textContent = `
      @keyframes slideInFromLeft {
        from {
          width: 0;
          opacity: 0;
        }
        to {
          width: 100%;
          opacity: 1;
        }
      }
      
      :root {
        --primary-color: #232956;
        --secondary-color: #df2528;
        --white: #ffffff;
      }
    `;
    document.head.appendChild(style);
  }
};

const isMobile = window.innerWidth < 768;

const MainWebsite = () => {
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { isMobile } = useTheme();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // ✅ เพิ่ม useEffect สำหรับเพิ่ม CSS animations
  useEffect(() => {
    addAnimationCSS();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { path: '/', label: 'หน้าแรก', exact: true },
    { path: '/search', label: 'ค้นหาเทรนเนอร์' },
    { path: '/events', label: 'อีเว้นท์' },
    { path: '/gyms', label: 'ยิม & ฟิตเนส' },
    { path: '/articles', label: 'บทความ' },
    { path: '/contact', label: 'ติดต่อเรา' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardRedirect = () => {
    if (user?.role === 'trainer') {
      navigate('/trainer');
    } else if (user?.role === 'client') {
      navigate('/client');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <div className="main-website">
      {/* Navigation Bar */}
      <Navbar 
        expand="lg" 
        fixed="top" 
        style={{
          ...styles.navbar,
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : '#ffffff',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <Container style={styles.navbarContainer}>
          {/* Brand Logo */}
          <Navbar.Brand as={Link} to="/" style={styles.navbarBrand}>
            <Link to="/">
              <img src={logo} className="App-logo" alt="logo" style={{ height: "48px" }} />
            </Link>
          </Navbar.Brand>

          {/* Mobile Menu Toggle */}
          <Button
            variant="outline-primary"
            className="d-lg-none"
            onClick={handleShow}
            style={styles.btnOutlinePrimary}
          >
            <i className="fas fa-bars"></i>
          </Button>

          {/* ✅ Desktop Navigation - ปรับให้เมนูและปุ่มอยู่ทางขวา */}
          <div className="d-none d-lg-flex" style={styles.navbarNavWrapper}>
            {/* Navigation Menu */}
            <Nav style={styles.navbarNav}>
              {navItems.map((item, index) => (
                <Nav.Link
                  key={index}
                  as={Link}
                  to={item.path}
                  style={{
                    ...styles.navLink,
                    ...(location.pathname === item.path ? styles.navLinkActive : {})
                  }}
                  ref={(el) => {
                    if (el) {
                      // ✅ เพิ่ม hover line effect
                      addHoverLine(el);
                      
                      // ✅ เพิ่ม active line effect
                      if (location.pathname === item.path) {
                        addActiveLine(el);
                      } else {
                        // ลบ active line ถ้าไม่ใช่หน้าปัจจุบัน
                        const activeLine = el.querySelector('.active-line');
                        if (activeLine) activeLine.remove();
                      }
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--secondary-color, #df2528)';
                    const line = e.target.querySelector('.hover-line');
                    if (line) line.style.width = '100%';
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.color = 'var(--primary-color, #232956)';
                    }
                    const line = e.target.querySelector('.hover-line');
                    if (line && location.pathname !== item.path) {
                      line.style.width = '0';
                    }
                  }}
                >
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>

            {/* Auth Buttons */}
            <Nav>
              {isAuthenticated ? (
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="outline-primary" 
                    id="user-dropdown"
                    className="d-flex align-items-center"
                    style={styles.btnOutlinePrimary}
                  >
                    <img
                      src={user?.profile?.avatar || '/images/default-avatar.png'}
                      alt="Profile"
                      width="30"
                      height="30"
                      className="rounded-circle me-2"
                    />
                    <span>{user?.name}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleDashboardRedirect}>
                      <i className="fas fa-tachometer-alt me-2"></i>
                      แดชบอร์ด
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="fas fa-user me-2"></i>
                      โปรไฟล์
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings">
                      <i className="fas fa-cog me-2"></i>
                      ตั้งค่า
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <i className="fas fa-sign-out-alt me-2"></i>
                      ออกจากระบบ
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    as={Link} 
                    to="/signin"
                    size="sm"
                    style={styles.btnOutlinePrimary}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--primary-color, #232956)';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--primary-color, #232956)';
                    }}
                  >
                    เข้าสู่ระบบ
                  </Button>
                  <Button 
                    variant="primary" 
                    as={Link} 
                    to="/signup"
                    size="sm"
                    style={styles.btnPrimaryCustom}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#c41f22';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--secondary-color, #df2528)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    สมัครสมาชิก
                  </Button>
                </div>
              )}
            </Nav>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          {/*<Link to="/">
              <img src={logo} className="App-logo" alt="logo" style={{ height: "48px" }} />
          </Link>*/}
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {navItems.map((item, index) => (
              <Nav.Link
                key={index}
                as={Link}
                to={item.path}
                className={`py-3 ${location.pathname === item.path ? 'text-danger' : ''}`}
                onClick={handleClose}
                style={{
                  color: location.pathname === item.path ? 'var(--secondary-color, #df2528)' : 'var(--primary-color, #232956)',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--secondary-color, #df2528)';
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.color = 'var(--primary-color, #232956)';
                  }
                }}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>

          <hr />

          {isAuthenticated ? (
            <div>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={user?.profile?.avatar || '/images/default-avatar.png'}
                  alt="Profile"
                  width="40"
                  height="40"
                  className="rounded-circle me-3"
                />
                <div>
                  <div className="fw-bold" style={{ color: 'var(--primary-color, #232956)' }}>{user?.name}</div>
                  <small className="text-muted">{user?.email}</small>
                </div>
              </div>

              <Nav className="flex-column">
                <Nav.Link 
                  onClick={() => { handleDashboardRedirect(); handleClose(); }}
                  style={{ color: 'var(--primary-color, #232956)', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--primary-color, #232956)'}
                >
                  <i className="fas fa-tachometer-alt me-2"></i>
                  แดชบอร์ด
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/profile" 
                  onClick={handleClose}
                  style={{ color: 'var(--primary-color, #232956)', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--primary-color, #232956)'}
                >
                  <i className="fas fa-user me-2"></i>
                  โปรไฟล์
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/settings" 
                  onClick={handleClose}
                  style={{ color: 'var(--primary-color, #232956)', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--primary-color, #232956)'}
                >
                  <i className="fas fa-cog me-2"></i>
                  ตั้งค่า
                </Nav.Link>
                <Nav.Link 
                  onClick={() => { handleLogout(); handleClose(); }}
                  style={{ color: 'var(--secondary-color, #df2528)', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  ออกจากระบบ
                </Nav.Link>
              </Nav>
            </div>
          ) : (
            <div className="d-grid gap-2">
              <Button 
                variant="outline-primary" 
                as={Link} 
                to="/signin"
                onClick={handleClose}
                style={styles.btnOutlinePrimary}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--primary-color, #232956)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--primary-color, #232956)';
                }}
              >
                เข้าสู่ระบบ
              </Button>
              <Button 
                variant="primary" 
                as={Link} 
                to="/signup"
                onClick={handleClose}
                style={styles.btnPrimaryCustom}
                onMouseEnter={(e) => {
                  e.target.style.background = '#c41f22';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--secondary-color, #df2528)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                สมัครสมาชิก
              </Button>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <main className="main-content" style={{ paddingTop: '80px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-0" style={styles.footer}>
        <Container>
          <div className="row py-5">
            <div className="col-lg-4 mb-4">
              <div style={styles.footerBrand}>
                <Link to="/">
              <img src={logofooter} className="App-logo" alt="logo" style={{ height: "60px" }} />
            </Link>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                แพลตฟอร์มหาเทรนเนอร์ส่วนตัวที่ดีที่สุดในประเทศไทย เชื่อมต่อเทรนเนอร์มืออาชีพกับลูกค้าที่ต้องการสุขภาพดี
              </p>
              <div className="d-flex">
                <a 
                  href="#" 
                  style={styles.socialIcon}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--secondary-color, #df2528)';
                    e.target.style.transform = 'scale(1.15)';
                    e.target.style.borderColor = 'var(--secondary-color, #df2528)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.borderColor = 'transparent';
                  }}
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a 
                  href="#" 
                  style={styles.socialIcon}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--secondary-color, #df2528)';
                    e.target.style.transform = 'scale(1.15)';
                    e.target.style.borderColor = 'var(--secondary-color, #df2528)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.borderColor = 'transparent';
                  }}
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a 
                  href="#" 
                  style={styles.socialIcon}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--secondary-color, #df2528)';
                    e.target.style.transform = 'scale(1.15)';
                    e.target.style.borderColor = 'var(--secondary-color, #df2528)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.borderColor = 'transparent';
                  }}
                >
                  <i className="fab fa-line"></i>
                </a>
                <a 
                  href="#" 
                  style={{...styles.socialIcon, marginRight: '0'}}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--secondary-color, #df2528)';
                    e.target.style.transform = 'scale(1.15)';
                    e.target.style.borderColor = 'var(--secondary-color, #df2528)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.borderColor = 'transparent';
                  }}
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold" style={{ color: '#ffffff', marginBottom: '1rem', fontWeight: '700' }}>บริการ</h6>
              <ul className="list-unstyled">
                <li><a href="/search" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>หาเทรนเนอร์</a></li>
                <li><a href="/gyms" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>ยิม & ฟิตเนส</a></li>
                <li><a href="/events" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>อีเว้นท์</a></li>
                <li><a href="/articles" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>บทความ</a></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold" style={{ color: '#ffffff', marginBottom: '1rem', fontWeight: '700' }}>สำหรับเทรนเนอร์</h6>
              <ul className="list-unstyled">
                <li><a href="/signup?role=trainer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>สมัครเป็นเทรนเนอร์</a></li>
                <li><a href="/trainer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>ศูนย์เทรนเนอร์</a></li>
                <li><a href="/help" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>ช่วยเหลือ</a></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold" style={{ color: '#ffffff', marginBottom: '1rem', fontWeight: '700' }}>บริษัท</h6>
              <ul className="list-unstyled">
                <li><a href="/about" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>เกี่ยวกับเรา</a></li>
                <li><a href="/contact" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>ติดต่อเรา</a></li>
                <li><a href="/careers" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>ร่วมงาน</a></li>
                <li><a href="/press" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>ข่าวสาร</a></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold" style={{ color: '#ffffff', marginBottom: '1rem', fontWeight: '700' }}>ช่วยเหลือ</h6>
              <ul className="list-unstyled">
                <li><a href="/help" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>ศูนย์ช่วยเหลือ</a></li>
                <li><a href="/privacy" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>นโยบายความเป็นส่วนตัว</a></li>
                <li><a href="/terms" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color, #df2528)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>ข้อกำหนดการใช้งาน</a></li>
              </ul>
            </div>
          </div>
          
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          
          <div className="row py-3">
            <div className="col-md-6">
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>&copy; 2025 PT Thailand Plus. สงวนสิทธิ์ทุกประการ</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.2)' }}>V. BETA</p>
            </div>
          </div>
        </Container>
      </footer>

      {/* Back to Top Button */}
      <button
        style={{
          ...styles.backToTop,
          display: scrolled ? 'flex' : 'none',
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = '0 10px 30px rgba(223, 37, 40, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </div>
  );
};

export default MainWebsite;