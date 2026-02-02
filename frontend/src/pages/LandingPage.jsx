import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const services = [
        {
            title: "Grievance Redressal",
            desc: "Report potholes, garbage, or street light issues.",
            icon: "bi-exclamation-triangle",
            link: "/complaints",
            color: "text-danger"
        },
        {
            title: "Bill Payments",
            desc: "Pay property tax, water, and electricity bills.",
            icon: "bi-cash-coin",
            link: "/bills",
            color: "text-success"
        },
        {
            title: "Emergency Services",
            desc: "Access Police, Ambulance, and Fire departments.",
            icon: "bi-shield-plus",
            link: "/emergency",
            color: "text-danger"
        },
        {
            title: "Job Opportunities",
            desc: "Find government contracts and daily wage rolls.",
            icon: "bi-briefcase",
            link: "/jobs",
            color: "text-primary"
        },
        {
            title: "City Announcements",
            desc: "Latest news, public notices, and event updates.",
            icon: "bi-megaphone",
            link: "/announcements",
            color: "text-info"
        },
        {
            title: "AI Assistant",
            desc: "Get instant answers to your civic queries.",
            icon: "bi-robot",
            link: "/chatbot",
            color: "text-secondary"
        }
    ];

    return (
        <div className="landing-page bg-light min-vh-100">

            {/* 1. OFFICIAL HERO HEADLINE & SEARCH */}
            <section className="bg-white border-bottom py-5 mb-5 mt-4">
                <Container className="text-center py-4">
                    <div className="d-inline-block border rounded-pill px-3 py-1 mb-3 bg-light text-secondary small fw-bold text-uppercase ls-1">
                        Official City Services Portal
                    </div>
                    <h1 className="display-4 fw-bold text-primary mb-3">How can we help you today?</h1>
                    <p className="lead text-secondary mb-5 mx-auto" style={{ maxWidth: '700px' }}>
                        Access municipal services, pay bills, and stay updated with city news from a single platform.
                    </p>


                </Container>
            </section>

            {/* 2. STANDARD SERVICES GRID */}
            <section className="py-5">
                <Container>
                    <h3 className="mb-4 fw-bold text-dark border-bottom pb-3">Online Services</h3>
                    <Row className="g-4">
                        {services
                            .filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((service, idx) => (
                                <Col md={6} lg={4} key={idx}>
                                    <Card className="h-100 border shadow-sm hover-shadow transition-all text-decoration-none" as={Link} to={service.link}>
                                        <Card.Body className="p-4 d-flex align-items-start">
                                            <div className={`me-3 mt-1 fs-3 ${service.color}`}>
                                                <i className={`bi ${service.icon}`}></i>
                                            </div>
                                            <div>
                                                <h5 className="fw-bold text-dark mb-1">{service.title}</h5>
                                                <p className="text-secondary small mb-0">{service.desc}</p>
                                            </div>
                                            <div className="ms-auto mt-1">
                                                <i className="bi bi-chevron-right text-muted small"></i>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                    </Row>
                </Container>
            </section>

            {/* 3. NEWS & UPDATES (Simplified) */}
            <section className="py-5 bg-white border-top">
                <Container>
                    <Row className="align-items-center mb-4">
                        <Col>
                            <h3 className="fw-bold text-dark mb-0">Latest Updates</h3>
                        </Col>
                        <Col className="text-end">
                            <Link to="/announcements" className="text-decoration-none fw-bold">View all news &rarr;</Link>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col md={4}>
                            <div className="border-start border-4 border-primary ps-3 py-1">
                                <small className="text-muted d-block mb-1">Oct 24, 2026</small>
                                <Link to="/announcements" className="fw-bold text-dark text-decoration-none d-block mb-1">Main Street Maintenance Schedule</Link>
                                <p className="small text-secondary mb-0">Road closure expected from 10 AM to 4 PM.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="border-start border-4 border-success ps-3 py-1">
                                <small className="text-muted d-block mb-1">Oct 22, 2026</small>
                                <Link to="/announcements" className="fw-bold text-dark text-decoration-none d-block mb-1">New Recycling Guidelines</Link>
                                <p className="small text-secondary mb-0">Updated waste segregation rules effective next month.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="border-start border-4 border-warning ps-3 py-1">
                                <small className="text-muted d-block mb-1">Oct 20, 2026</small>
                                <Link to="/announcements" className="fw-bold text-dark text-decoration-none d-block mb-1">Health Camp @ City Hall</Link>
                                <p className="small text-secondary mb-0">Free checkups available for senior citizens.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* 4. HELP SECTION */}
            <section className="py-5 bg-primary text-white">
                <Container className="text-center">
                    <h3 className="fw-bold mb-3">Need Assistance?</h3>
                    <p className="mb-4 opacity-75">Our helpline is available 24/7 for emergency reporting.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="light" size="lg" className="fw-bold text-primary" as={Link} to="/emergency">
                            <i className="bi bi-telephone-fill me-2"></i> Call Helpline
                        </Button>
                        <Button variant="outline-light" size="lg" className="fw-bold" as={Link} to="/chatbot">
                            <i className="bi bi-chat-dots-fill me-2"></i> Ask Chatbot
                        </Button>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default LandingPage;
