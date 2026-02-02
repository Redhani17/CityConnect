import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
            <Container>
                <Row className="g-4 mb-5">
                    {/* COLUMN 1: BRAND & INFO */}
                    <Col lg={4} md={6}>
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary text-white rounded p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <i className="bi bi-bank2 small"></i>
                            </div>
                            <span className="fw-bold fs-5 tracking-tight">CityConnect</span>
                        </div>
                        <p className="text-white-50 small mb-4 pe-lg-5">
                            The Official Digital Portal for the Municipal Corporation. Dedicated to providing transparent, efficient, and accessible services to every citizen.
                        </p>
                        <div className="d-flex gap-2 mb-4">
                            <a href="#" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: '32px', height: '32px', padding: '0' }}><i className="bi bi-twitter"></i></a>
                            <a href="#" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: '32px', height: '32px', padding: '0' }}><i className="bi bi-facebook"></i></a>
                            <a href="#" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: '32px', height: '32px', padding: '0' }}><i className="bi bi-youtube"></i></a>
                        </div>
                    </Col>

                    {/* COLUMN 2: QUICK LINKS */}
                    <Col lg={2} md={6} xs={6}>
                        <h6 className="fw-bold mb-3 text-uppercase small ls-1 text-white-50">Citizens</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/complaints" className="text-decoration-none text-white hover-opacity">File Complaint</Link></li>
                            <li><Link to="/bills" className="text-decoration-none text-white hover-opacity">Pay Bills</Link></li>
                            <li><Link to="/jobs" className="text-decoration-none text-white hover-opacity">Agencies & Jobs</Link></li>
                            <li><Link to="/announcements" className="text-decoration-none text-white hover-opacity">Public Notices</Link></li>
                        </ul>
                    </Col>

                    {/* COLUMN 3: GOVERNMENT */}
                    <Col lg={2} md={6} xs={6}>
                        <h6 className="fw-bold mb-3 text-uppercase small ls-1 text-white-50">Government</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/admin" className="text-decoration-none text-white hover-opacity">Admin Login</Link></li>
                            <li><Link to="/about" className="text-decoration-none text-white hover-opacity">About City Hall</Link></li>
                            <li><Link to="/departments" className="text-decoration-none text-white hover-opacity">Departments</Link></li>
                            <li><Link to="/terms" className="text-decoration-none text-white hover-opacity">RTI / Values</Link></li>
                        </ul>
                    </Col>

                    {/* COLUMN 4: CONTACT & EMERGENCY */}
                    <Col lg={4} md={6}>
                        <h6 className="fw-bold mb-3 text-uppercase small ls-1 text-white-50">Contact & Support</h6>
                        <ul className="list-unstyled small text-white-50 d-flex flex-column gap-3">
                            <li className="d-flex gap-3">
                                <i className="bi bi-geo-alt-fill text-primary"></i>
                                <span>City Hall Complex, Main Avenue,<br />Sector 1, CityConnect - 110001</span>
                            </li>
                            <li className="d-flex gap-3">
                                <i className="bi bi-telephone-fill text-primary"></i>
                                <span>Helpline: <strong className="text-white">1800-CITY-SERV</strong> (24/7)</span>
                            </li>
                            <li className="d-flex gap-3">
                                <i className="bi bi-envelope-fill text-primary"></i>
                                <span>support@cityconnect.gov.in</span>
                            </li>
                        </ul>
                    </Col>
                </Row>

                <hr className="border-secondary opacity-25" />

                <Row className="align-items-center py-2 small text-white-50">
                    <Col md={6} className="text-center text-md-start">
                        &copy; {new Date().getFullYear()} Municipal Corporation. All Rights Reserved.
                    </Col>
                    <Col md={6} className="text-center text-md-end mt-2 mt-md-0">
                        <Link to="/privacy" className="text-white-50 text-decoration-none me-3">Privacy Policy</Link>
                        <Link to="/terms" className="text-white-50 text-decoration-none me-3">Terms of Use</Link>
                        <Link to="/accessibility" className="text-white-50 text-decoration-none">Accessibility</Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
