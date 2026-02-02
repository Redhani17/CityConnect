import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Form, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAnnouncements();
  }, [filter]);

  const fetchAnnouncements = async () => {
    try {
      const url = filter
        ? `${API_URL}/announcements?category=${filter}`
        : `${API_URL}/announcements`;
      const response = await axios.get(url);
      setAnnouncements(response.data.data.announcements);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>City Announcements & Events</h2>
        <Form.Select
          style={{ width: 'auto' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Event">Events</option>
          <option value="Notice">Notices</option>
          <option value="Alert">Alerts</option>
          <option value="General">General</option>
        </Form.Select>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p>No announcements available.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {announcements.map((announcement) => (
            <Col md={6} key={announcement._id} className="mb-3">
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Badge bg="primary">{announcement.category}</Badge>
                  <small className="text-muted">
                    {new Date(announcement.date).toLocaleDateString()}
                  </small>
                </Card.Header>
                <Card.Body>
                  <Card.Title>{announcement.title}</Card.Title>
                  <Card.Text>{announcement.description}</Card.Text>
                  {announcement.location && (
                    <Card.Text>
                      <small className="text-muted">
                        📍 {announcement.location}
                      </small>
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Announcements;
