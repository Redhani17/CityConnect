import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation();

    const services = [
        {
            id: "grievance",
            title: t('landing.services.grievance'),
            desc: t('landing.services.grievance_desc'),
            icon: "bi-exclamation-triangle",
            link: "/complaints",
            color: "text-danger"
        },
        {
            id: "bills",
            title: t('landing.services.bills'),
            desc: t('landing.services.bills_desc'),
            icon: "bi-cash-coin",
            link: "/bills",
            color: "text-success"
        },
        {
            id: "emergency",
            title: t('landing.services.emergency'),
            desc: t('landing.services.emergency_desc'),
            icon: "bi-shield-plus",
            link: "/emergency",
            color: "text-danger"
        },
        {
            id: "jobs",
            title: t('landing.services.jobs'),
            desc: t('landing.services.jobs_desc'),
            icon: "bi-briefcase",
            link: "/jobs",
            color: "text-primary"
        },
        {
            id: "announcements",
            title: t('landing.services.announcements'),
            desc: t('landing.services.announcements_desc'),
            icon: "bi-megaphone",
            link: "/announcements",
            color: "text-info"
        },
        {
            id: "chatbot",
            title: t('landing.services.chatbot'),
            desc: t('landing.services.chatbot_desc'),
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
                        {t('landing.hero.badge')}
                    </div>
                    <h1 className="display-4 fw-bold text-primary mb-3">{t('landing.hero.headline')}</h1>
                    <p className="lead text-secondary mb-5 mx-auto" style={{ maxWidth: '700px' }}>
                        {t('landing.hero.subheadline')}
                    </p>
                </Container>
            </section>

            {/* 2. STANDARD SERVICES GRID */}
            <section className="py-5">
                <Container>
                    <h3 className="mb-4 fw-bold text-dark border-bottom pb-3">{t('landing.services.title')}</h3>
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


            {/* 4. HELP SECTION */}
            <section className="py-5 bg-primary text-white">
                <Container className="text-center">
                    <h3 className="fw-bold mb-3">{t('landing.help.title')}</h3>
                    <p className="mb-4 opacity-75">{t('landing.help.subtitle')}</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="light" size="lg" className="fw-bold text-primary" as={Link} to="/emergency">
                            <i className="bi bi-telephone-fill me-2"></i> {t('landing.help.call')}
                        </Button>
                        <Button variant="outline-light" size="lg" className="fw-bold" as={Link} to="/chatbot">
                            <i className="bi bi-chat-dots-fill me-2"></i> {t('landing.help.ask')}
                        </Button>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default LandingPage;
