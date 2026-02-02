import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            {/* 
                REQUESTED LINKS: 
                Dashboard, Complaints, Bills, Emergency, Chatbot, Announcement, Jobs 
             */}

            {isAuthenticated && (
              <Nav.Link as={Link} to={user?.role === 'admin' ? '/admin' : '/citizen'} className="fw-semibold text-dark px-3 nav-link-hover">
                <i className="bi bi-speedometer2 me-1 text-primary"></i> Dashboard
              </Nav.Link>
            )}

            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/complaints" className="fw-medium text-secondary px-3 nav-link-hover">Complaints</Nav.Link>
                <Nav.Link as={Link} to="/bills" className="fw-medium text-secondary px-3 nav-link-hover">Bills</Nav.Link>

                <Nav.Link as={Link} to="/emergency" className="fw-medium text-danger px-3 nav-link-hover">
                  <i className="bi bi-exclamation-circle-fill me-1"></i> Emergency
                </Nav.Link>

                {/* Chatbot Link - Visual Highlight */}
                <Nav.Link as={Link} to="/chatbot" className="fw-medium text-secondary px-3 nav-link-hover">
                  <span className="d-flex align-items-center">
                    <i className="bi bi-robot me-1 text-info"></i> Chatbot
                  </span>
                </Nav.Link>

                <Nav.Link as={Link} to="/announcements" className="fw-medium text-secondary px-3 nav-link-hover">Announcements</Nav.Link>
                <Nav.Link as={Link} to="/jobs" className="fw-medium text-secondary px-3 nav-link-hover">Jobs</Nav.Link>
              </>
            )}
          </Nav>

          {/* RIGHT ACTIONS */}
          <div className="d-flex align-items-center mt-3 mt-xl-0 border-start ps-xl-4 ms-xl-2 py-1">
            {isAuthenticated ? (
              <div className="d-flex align-items-center">
                {/* ROLE DISPLAY - REQUESTED */}
                <div className="text-end me-3 d-none d-lg-block line-height-sm">
                  <div className="fw-bold text-dark small">{user?.name}</div>
                  <Badge bg="primary-subtle" text="primary" className="fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>
                    {user?.role || 'Citizen'}
                  </Badge>
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
                    <small className="text-muted text-uppercase">{user?.role}</small>
                  </div>

                  <NavDropdown.Item onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/citizen')}>
                    <i className="bi bi-person-badge me-2"></i>User Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger fw-semibold">
                    <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary fw-bold px-4 rounded-pill">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
