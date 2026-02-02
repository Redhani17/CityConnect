import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Badge, Card } from 'react-bootstrap';
import axios from 'axios';
import { motion } from 'framer-motion';
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

  const getCategoryColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'alert': return 'danger';
      case 'event': return 'primary';
      case 'notice': return 'info';
      default: return 'secondary';
    }
  }

  if (loading) return <div className="p-5 text-center font-mono text-muted">FETCHING BROADCASTS...</div>;

  return (
    <Container className="py-5" style={{ maxWidth: '1280px' }}>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-end mb-5 border-bottom pb-4">
        <div>
          <span className="font-mono text-muted small d-block mb-1">CITY BROADCAST NETWORK</span>
          <h2 className="display-5 fw-bold tracking-tight">Events & Notices</h2>
        </div>
        <div className="mt-3 mt-md-0">
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-light border-0 py-2 px-4 rounded-pill fw-bold"
            style={{ minWidth: '200px' }}
          >
            <option value="">All Categories</option>
            <option value="Event">📅 Public Events</option>
            <option value="Notice">📢 Official Notices</option>
            <option value="Alert">🚨 Safety Alerts</option>
          </Form.Select>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No recent broadcasts found.</p>
        </div>
      ) : (
        <div className="row g-4 masonry-grid">
          {announcements.map((item, idx) => (
            <Col md={6} lg={4} key={item._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`h-100 bento-card p-0 ${item.category === 'Alert' ? 'border-danger' : 'border-light'}`}
              >
                {/* HEADER */}
                <div className={`p-4 ${item.category === 'Alert' ? 'bg-danger text-white' : 'bg-white'}`}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg={item.category === 'Alert' ? 'white' : 'light'} text={item.category === 'Alert' ? 'danger' : 'dark'} className="border">
                      {item.category.toUpperCase()}
                    </Badge>
                    <span className={`font-mono small ${item.category === 'Alert' ? 'text-white-50' : 'text-muted'}`}>
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="fw-bold mb-0">{item.title}</h4>
                </div>

                {/* BODY */}
                <div className="p-4 bg-white flex-grow-1 d-flex flex-column">
                  <p className="text-secondary mb-4">{item.description}</p>

                  <div className="mt-auto pt-3 border-top d-flex align-items-center gap-2 text-muted small font-mono">
                    {item.location && (
                      <>
                        <i className="bi bi-geo-alt-fill text-primary"></i>
                        {item.location}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Announcements;
