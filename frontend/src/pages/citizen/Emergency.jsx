import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Emergency = () => {
  const { t } = useTranslation();
  const [sosSent, setSosSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const HOLD_DURATION = 5000; // 5 seconds

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${API_URL}/emergency/contacts`);
        setContacts(response.data.data.contacts);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  // Long-press logic
  const startPress = () => {
    if (sosSent || loading) return;
    setIsPressing(true);
    setHoldProgress(0);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);

      if (elapsed >= HOLD_DURATION) {
        clearInterval(timerRef.current);
        triggerEmergency();
      }
    }, 50);
  };

  const endPress = () => {
    setIsPressing(false);
    clearInterval(timerRef.current);
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  const triggerEmergency = async () => {
    setLoading(true);
    try {
      // 1. Send system SOS alert
      await axios.post(`${API_URL}/emergency/sos`, {
        location: 'Current Location',
        emergencyType: 'Critical SOS',
        message: 'Immediate assistance requested via 5s hold.',
      });

      // 2. Initiate Twilio call to user specified number
      await axios.post(`${API_URL}/twilio/call`, {
        phoneNumber: '8012537771'
      });

      setSosSent(true);
      setTimeout(() => {
        setSosSent(false);
        setHoldProgress(0);
      }, 10000);
    } catch (error) {
      console.error('Failed to trigger emergency:', error);
      alert('Emergency trigger failed. Please call 108 immediately.');
    } finally {
      setLoading(false);
      setIsPressing(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '1000px' }}>

      {/* ALERT BANNER */}
      <Alert variant="danger" className="text-center shadow-sm border-danger">
        <h4 className="alert-heading fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i>{t('emergency.title')}</h4>
        <p className="mb-0">{t('emergency.warning')}</p>
      </Alert>

      <Row className="g-5 mt-2">
        {/* SOS SECTION */}
        <Col md={6} className="text-center">
          <Card className="h-100 border-0 shadow-sm bg-light">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5">
              <h3 className="fw-bold text-dark mb-4">{t('emergency.request_help')}</h3>

              <div className="position-relative mb-4" style={{ width: '200px', height: '200px' }}>
                {/* Progress Ring Background */}
                <svg className="position-absolute top-0 left-0" width="200" height="200" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#e9ecef" strokeWidth="8" />
                  <circle
                    cx="100" cy="100" r="90" fill="none"
                    stroke={sosSent ? "#198754" : "#dc3545"}
                    strokeWidth="8"
                    strokeDasharray="565.48"
                    strokeDashoffset={565.48 - (565.48 * holdProgress) / 100}
                    style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease' }}
                    transform="rotate(-90 100 100)"
                  />
                </svg>

                <Button
                  variant={sosSent ? "success" : "danger"}
                  className={`rounded-circle shadow-lg d-flex flex-column align-items-center justify-content-center position-absolute top-50 start-50 translate-middle ${isPressing ? 'scale-95' : ''}`}
                  style={{
                    width: '160px',
                    height: '160px',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: sosSent ? '#198754' : '#dc3545'
                  }}
                  onMouseDown={startPress}
                  onMouseUp={endPress}
                  onMouseLeave={endPress}
                  onTouchStart={startPress}
                  onTouchEnd={endPress}
                  disabled={loading}
                >
                  {loading ? <span className="spinner-border"></span> : (
                    <>
                      <i className={`bi ${sosSent ? 'bi-check-lg' : 'bi-broadcast'} fs-1`}></i>
                      <span className="fs-3 fw-bold mt-1">{sosSent ? t('emergency.sos_sent') : t('emergency.sos_button')}</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="text-muted small mt-2 px-3">
                {sosSent ? (
                  <span className="text-success fw-bold">{t('emergency.help_on_way')}</span>
                ) : isPressing ? (
                  <span className="text-primary fw-bold">{t('emergency.holding')} ({Math.ceil((HOLD_DURATION - (holdProgress * HOLD_DURATION) / 100) / 1000)}s)</span>
                ) : (
                  t('emergency.instruction')
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* CONTACTS LIST */}
        <Col md={6}>
          <h4 className="fw-bold mb-3 border-bottom pb-2">{t('emergency.contacts')}</h4>
          <div className="d-flex flex-column gap-3">
            {contacts.length === 0 && <p className="text-muted">Loading...</p>}
            {contacts.map((contact, idx) => (
              <a href={`tel:${contact.number}`} key={idx} className="text-decoration-none">
                <Card className="border shadow-sm hover-shadow transition-all">
                  <Card.Body className="d-flex align-items-center p-3">
                    <div className={`rounded-circle p-3 me-3 ${contact.type.includes('Police') ? 'bg-primary text-white' : contact.type.includes('Medical') ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                      <i className={`bi ${contact.type.includes('Police') ? 'bi-shield-fill' : contact.type.includes('Medical') ? 'bi-hospital-fill' : 'bi-fire'} fs-5`}></i>
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">{contact.name}</h6>
                      <div className="small text-secondary">{contact.type}</div>
                    </div>
                    <div className="ms-auto">
                      <Badge bg="light" text="dark" className="border fs-6 font-monospace px-3 py-2">
                        <i className="bi bi-telephone-fill me-2 text-secondary"></i>{contact.number}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </a>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Emergency;
