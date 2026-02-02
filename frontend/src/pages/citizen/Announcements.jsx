import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Badge, Card } from 'react-bootstrap';
import axios from 'axios';
import { motion } from 'framer-motion';

const Announcements = () => {
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

  if (loading) return (
    <Container className="py-5 text-center">
      <div className="spinner-border text-primary mb-3"></div>
      <p className="text-secondary fw-medium">Loading official broadcasts...</p>
    </Container>
  );

  return (
    <Container className="py-4" style={{ maxWidth: '1400px' }}>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 border-bottom pb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Municipal Notifications</h2>
          <p className="text-secondary small mb-0">Stay updated with official city notices, events, and emergency alerts.</p>
        </div>
        <div className="mt-4 mt-md-0">
          <div className="d-flex align-items-center gap-3">
            <span className="small text-muted text-nowrap fw-bold text-uppercase ls-1">Filter By:</span>
            <Form.Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border-subtle shadow-sm py-2 px-3 fw-medium"
              style={{ minWidth: '220px', borderRadius: '8px' }}
            >
              <option value="">All Notifications</option>
              <option value="Event">📅 Public Events</option>
              <option value="Notice">📢 Official Notices</option>
              <option value="Alert">🚨 Safety Alerts</option>
            </Form.Select>
          </div>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 border border-dashed">
          <p className="text-muted mb-0">No active broadcasts found in this category.</p>
        </div>
      ) : (
        <Row className="g-4">
          {announcements.map((item, idx) => (
            <Col md={6} lg={4} key={item._id}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="h-100"
              >
                <Card className={`h-100 border-0 shadow-sm overflow-hidden ${item.category === 'Alert' ? 'border-start border-danger border-4' : ''}`}>
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Badge
                        bg={item.category === 'Alert' ? 'danger' : item.category === 'Event' ? 'primary' : 'info'}
                        className="fw-normal px-2 py-1 rounded-1"
                      >
                        {item.category.toUpperCase()}
                      </Badge>
                      <span className="text-muted small fw-bold">
                        <i className="bi bi-calendar3 me-1"></i>
                        {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h5 className="fw-bold text-dark mb-3 lh-sm">{item.title}</h5>
                    <p className="text-secondary small mb-4 flex-grow-1" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                      {item.description}
                    </p>

                    <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                      <div className="d-flex align-items-center text-muted small">
                        <i className="bi bi-geo-alt me-1"></i>
                        {item.location || 'Multiple Zones'}
                      </div>
                      <button className="btn btn-link btn-sm text-primary fw-bold text-decoration-none p-0">
                        Read Details <i className="bi bi-arrow-right small"></i>
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Announcements;
