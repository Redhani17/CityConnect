import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          🏙️ CityConnect
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? (
            <Nav className="ms-auto">
              {user?.role === 'citizen' && (
                <>
                  <Nav.Link as={Link} to="/citizen">
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/complaints">
                    Complaints
                  </Nav.Link>
                  <Nav.Link as={Link} to="/bills">
                    Bills
                  </Nav.Link>
                  <Nav.Link as={Link} to="/emergency">
                    Emergency
                  </Nav.Link>
                  <Nav.Link as={Link} to="/chatbot">
                    Chatbot
                  </Nav.Link>
                  <Nav.Link as={Link} to="/announcements">
                    Announcements
                  </Nav.Link>
                  <Nav.Link as={Link} to="/jobs">
                    Jobs
                  </Nav.Link>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Nav.Link as={Link} to="/admin">
                    Admin Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/complaints">
                    Manage Complaints
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/announcements">
                    Announcements
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/jobs">
                    Jobs
                  </Nav.Link>
                </>
              )}
              <NavDropdown title={user?.name || 'User'} id="user-dropdown">
                <NavDropdown.Item disabled>
                  {user?.email}
                </NavDropdown.Item>
                <NavDropdown.Item disabled>
                  Role: {user?.role}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
            </Nav>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
