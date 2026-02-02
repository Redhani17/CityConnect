import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Emergency = () => {
  const { user } = useAuth();
  const [sosSent, setSosSent] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  React.useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_URL}/emergency/contacts`);
      setContacts(response.data.data.contacts);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const handleSOS = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/emergency/sos`, {
        location: 'Current Location',
        emergencyType: 'General Emergency',
        message: 'SOS Request',
      });
      setSosSent(true);
      setTimeout(() => setSosSent(false), 5000);
    } catch (error) {
      console.error('Failed to send SOS:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Emergency Services</h2>

      <Row>
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="mb-4">Emergency SOS</Card.Title>
              {sosSent && (
                <Alert variant="success" className="mb-3">
                  SOS request sent! Help is on the way!
                </Alert>
              )}
              <Button
                className="sos-button btn-danger"
                onClick={handleSOS}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'SOS'}
              </Button>
              <p className="mt-3 text-muted">
                Click the button above to send an emergency SOS request
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Emergency Contacts</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {contacts.map((contact, index) => (
                  <ListGroup.Item key={index}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{contact.name}</strong>
                        <br />
                        <small className="text-muted">{contact.type}</small>
                      </div>
                      <Button
                        variant="outline-primary"
                        href={`tel:${contact.number}`}
                      >
                        {contact.number}
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Emergency;
