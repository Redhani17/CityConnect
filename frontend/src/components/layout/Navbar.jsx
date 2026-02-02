import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Button, Badge, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [newFeedback, setNewFeedback] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    let interval;
    if (isAuthenticated && user?.role === 'admin') {
      interval = setInterval(checkNewFeedback, 30000); // Check every 30s
    }
    return () => clearInterval(interval);
  }, [isAuthenticated, user, newFeedback]);

  const checkNewFeedback = async () => {
    try {
      const response = await axios.get(`${API_URL}/feedback/all`);
      const feedbacks = response.data.data;
      if (feedbacks && feedbacks.length > 0) {
        const latest = feedbacks[0];
        if (!newFeedback || latest._id !== newFeedback._id) {
          setNewFeedback(latest);
          setShowToast(true);
        }
      }
    } catch (error) {
      console.error('Failed to check for feedback:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language || 'en';
  const languageNames = {
    en: 'English',
    hi: 'हिंदी',
    ta: 'தமிழ்'
  };

  return (
    <BootstrapNavbar
      fixed="top"
      expand="xl"
      className="bg-white border-bottom border-light shadow-sm py-2"
      style={{ minHeight: '80px', zIndex: 1040 }}
    >
      <Container fluid className="px-4">
        {/* BRAND SECTION */}
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center me-4">
          <div className="bg-primary text-white rounded p-2 me-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '42px', height: '42px' }}>
            <i className="bi bi-bank2 fs-5"></i>
          </div>
          <div className="d-flex flex-column">
            <span className="fw-bold text-primary lh-1" style={{ letterSpacing: '-0.5px', fontSize: '1.4rem' }}>CityConnect</span>
            <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>Official Portal</span>
          </div>
        </BootstrapNavbar.Brand>

        {/* MOBILE TOGGLE */}
        <BootstrapNavbar.Toggle aria-controls="main-navbar-nav" className="border-0 shadow-none bg-light" />

        {/* NAV ITEMS */}
        <BootstrapNavbar.Collapse id="main-navbar-nav">
          <Nav className="mx-auto mb-2 mb-lg-0 align-items-center">
            {isAuthenticated && (
              <Nav.Link as={Link} to={user?.role === 'admin' ? '/admin' : '/citizen'} className="fw-semibold text-dark px-3 nav-link-hover">
                <i className="bi bi-speedometer2 me-1 text-primary"></i> {t('navbar.dashboard')}
              </Nav.Link>
            )}

            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/complaints" className="fw-medium text-secondary px-3 nav-link-hover">{t('navbar.complaints')}</Nav.Link>
                <Nav.Link as={Link} to="/bills" className="fw-medium text-secondary px-3 nav-link-hover">{t('navbar.bills')}</Nav.Link>

                <Nav.Link as={Link} to="/emergency" className="fw-medium text-danger px-3 nav-link-hover">
                  <i className="bi bi-exclamation-circle-fill me-1"></i> {t('navbar.emergency')}
                </Nav.Link>

                <Nav.Link as={Link} to="/chatbot" className="fw-medium text-secondary px-3 nav-link-hover">
                  <span className="d-flex align-items-center">
                    <i className="bi bi-robot me-1 text-info"></i> {t('navbar.chatbot')}
                  </span>
                </Nav.Link>

                <Nav.Link as={Link} to="/announcements" className="fw-medium text-secondary px-3 nav-link-hover">{t('navbar.announcements')}</Nav.Link>
                <Nav.Link as={Link} to="/jobs" className="fw-medium text-secondary px-3 nav-link-hover">{t('navbar.jobs')}</Nav.Link>
              </>
            )}
          </Nav>

          {/* RIGHT ACTIONS */}
          <div className="d-flex align-items-center mt-3 mt-xl-0 border-start ps-xl-4 ms-xl-2 py-1 gap-3">

            {/* LANGUAGE SELECTOR */}
            <NavDropdown
              title={
                <span className="d-flex align-items-center text-dark fw-bold border rounded-pill px-3 py-1 bg-light hover-shadow transition-all" style={{ fontSize: '0.9rem' }}>
                  <i className="bi bi-translate me-2 text-primary"></i>
                  {languageNames[currentLanguage.split('-')[0]] || 'English'}
                </span>
              }
              id="language-dropdown"
              className="dropdown-clean no-arrow"
            >
              <NavDropdown.Item onClick={() => changeLanguage('en')} active={currentLanguage.startsWith('en')}>
                English
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('hi')} active={currentLanguage.startsWith('hi')}>
                हिन्दी (Hindi)
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('ta')} active={currentLanguage.startsWith('ta')}>
                தமிழ் (Tamil)
              </NavDropdown.Item>
            </NavDropdown>

            {isAuthenticated ? (
              <div className="d-flex align-items-center">
                <div className="text-end me-3 d-none d-lg-block line-height-sm">
                  <div className="fw-bold text-dark small">{user?.name}</div>
                </div>

                <NavDropdown
                  title={
                    <div className="position-relative">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                        <span className="visually-hidden">Online</span>
                      </span>
                    </div>
                  }
                  id="user-dropdown"
                  align="end"
                  className="dropdown-clean no-arrow"
                >
                  <div className="px-3 py-2 border-bottom mb-2 bg-light d-lg-none">
                    <div className="fw-bold text-dark">{user?.name}</div>
                  </div>

                  <NavDropdown.Item onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/citizen')}>
                    <i className="bi bi-person-badge me-2"></i>User Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger fw-semibold">
                    <i className="bi bi-box-arrow-right me-2"></i>{t('navbar.logout')}
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary fw-bold px-4 rounded-pill">
                  {t('navbar.login')}
                </Link>
                <Link to="/register" className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm">
                  {t('navbar.register')}
                </Link>
              </div>
            )}
          </div>
        </BootstrapNavbar.Collapse>
      </Container>

      {/* GLOBAL FEEDBACK NOTIFICATION FOR ADMINS */}
      {user?.role === 'admin' && (
        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1070, marginTop: '80px' }}>
          <Toast show={showToast} onClose={() => setShowToast(false)} delay={8000} autohide bg="primary" text="white">
            <Toast.Header closeButton={true}>
              <i className="bi bi-star-fill text-warning me-2"></i>
              <strong className="me-auto">New Civic Feedback</strong>
              <small>Just now</small>
            </Toast.Header>
            <Toast.Body className="p-3">
              <div className="fw-bold mb-1 text-white">{newFeedback?.userId?.name} rated {newFeedback?.rating}/5</div>
              <div className="small opacity-90 text-white text-truncate">"{newFeedback?.suggestion}"</div>
              <Button
                variant="light"
                size="sm"
                className="mt-2 w-100 fw-bold border-0 shadow-sm py-1"
                style={{ fontSize: '0.75rem' }}
                onClick={() => { setShowToast(false); navigate('/admin'); }}
              >
                View Dashboard
              </Button>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </BootstrapNavbar>
  );
};

export default Navbar;
