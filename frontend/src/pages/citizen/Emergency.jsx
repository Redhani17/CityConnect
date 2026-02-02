import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const Emergency = () => {
  const [sosSent, setSosSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  const handleSOS = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/emergency/sos`, {
        location: 'Current Location',
        emergencyType: 'General Emergency',
        message: 'SOS Request',
      });
      setSosSent(true);
      setTimeout(() => setSosSent(false), 8000);
    } catch (error) {
      console.error('Failed to send SOS:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '1000px' }}>

      {/* ALERT BANNER */}
      <Alert variant="danger" className="text-center shadow-sm border-danger">
        <h4 className="alert-heading fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i>EMERGENCY SERVICES</h4>
        <p className="mb-0">Only use this page for life-threatening emergencies or urgent assistance.</p>
      </Alert>

      <Row className="g-5 mt-2">
        {/* SOS SECTION */}
        <Col md={6} className="text-center">
          <Card className="h-100 border-0 shadow-sm bg-light">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5">
              <h3 className="fw-bold text-dark mb-4">Request Immediate Help</h3>

              {sosSent ? (
                <div className="text-success animate-pulse">
                  <i className="bi bi-check-circle-fill display-1"></i>
                  <h4 className="mt-3 fw-bold">SOS SENT</h4>
                  <p>Help is on the way!</p>
                </div>
              ) : (
                <Button
                  variant="danger"
                  className="rounded-circle shadow-lg d-flex flex-column align-items-center justify-content-center mb-3"
                  style={{ width: '180px', height: '180px', border: '8px solid rgba(255,255,255,0.3)' }}
                  onClick={handleSOS}
                  disabled={loading}
                >
                  {loading ? <span className="spinner-border"></span> : (
                    <>
                      <i className="bi bi-broadcast fs-1"></i>
                      <span className="fs-3 fw-bold mt-1">SOS</span>
                    </>
                  )}
                </Button>
              )}
              <p className="text-muted small mt-2">Press button to share location with authorities</p>
            </Card.Body>
          </Card>
        </Col>

        {/* CONTACTS LIST */}
        <Col md={6}>
          <h4 className="fw-bold mb-3 border-bottom pb-2">Emergency Contacts</h4>
          <div className="d-flex flex-column gap-3">
            {contacts.length === 0 && <p className="text-muted">Loading contacts...</p>}
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

            {/* Static Fallback if empty */}
            {contacts.length === 0 && (
              <>
                <Card className="border">
                  <Card.Body className="p-3 d-flex align-items-center">
                    <i className="bi bi-shield-shaded fs-3 text-primary me-3"></i>
                    <div><h6 className="fw-bold mb-0">Police Control Room</h6><small>General Help</small></div>
                    <Badge bg="primary" className="ms-auto fs-6">100</Badge>
                  </Card.Body>
                </Card>
                <Card className="border">
                  <Card.Body className="p-3 d-flex align-items-center">
                    <i className="bi bi-fire fs-3 text-danger me-3"></i>
                    <div><h6 className="fw-bold mb-0">Fire & Rescue</h6><small>Immediate Response</small></div>
                    <Badge bg="danger" className="ms-auto fs-6">101</Badge>
                  </Card.Body>
                </Card>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Emergency;
