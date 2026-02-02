import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Badge, Card, Button, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    date: '',
    location: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
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

  const handleCreate = () => {
    setEditing(null);
    setFormData({
      title: '',
      description: '',
      category: 'General',
      date: new Date().toISOString().split('T')[0],
      location: '',
    });
    setShowModal(true);
  };

  const handleEdit = (announcement) => {
    setEditing(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description,
      category: announcement.category,
      date: announcement.date.split('T')[0],
      location: announcement.location || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editing) {
        await axios.put(`${API_URL}/announcements/${editing._id}`, formData);
        setMessage({ type: 'success', text: 'Announcement updated successfully.' });
      } else {
        await axios.post(`${API_URL}/announcements`, formData);
        setMessage({ type: 'success', text: 'New announcement published successfully.' });
      }
      setShowModal(false);
      fetchAnnouncements();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Action failed',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await axios.delete(`${API_URL}/announcements/${id}`);
        setMessage({ type: 'success', text: 'Announcement deleted.' });
        fetchAnnouncements();
      } catch (error) {
        setMessage({
          type: 'danger',
          text: error.response?.data?.message || 'Failed to delete',
        });
      }
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
        <div className="mt-4 mt-md-0 d-flex gap-3 align-items-center">
          {user?.role === 'department' && (
            <Button variant="primary" className="fw-bold px-4 shadow-sm" onClick={handleCreate}>
              <i className="bi bi-plus-lg me-2"></i> New
            </Button>
          )}
          <div className="d-flex align-items-center gap-3">
            <span className="small text-muted text-nowrap fw-bold text-uppercase ls-1 d-none d-lg-inline">Filter:</span>
            <Form.Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border-subtle shadow-sm py-2 px-3 fw-medium"
              style={{ minWidth: '180px', borderRadius: '8px' }}
            >
              <option value="">All Notifications</option>
              <option value="Event">📅 Public Events</option>
              <option value="Notice">📢 Official Notices</option>
              <option value="Alert">🚨 Safety Alerts</option>
            </Form.Select>
          </div>
        </div>
      </div>

      {message.text && (
        <Alert
          variant={message.type}
          dismissible
          onClose={() => setMessage({ type: '', text: '' })}
          className="border-0 shadow-sm mb-4"
        >
          {message.text}
        </Alert>
      )}

      {announcements.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 border border-dashed">
          <p className="text-muted mb-0">No active broadcasts found {filter ? 'in this category' : ''}.</p>
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
                  <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <Badge
                      bg={item.category === 'Alert' ? 'danger' : item.category === 'Event' ? 'primary' : 'info'}
                      className="fw-normal px-2 py-1 rounded-1"
                    >
                      {item.category.toUpperCase()}
                    </Badge>
                    {user?.role === 'department' && (
                      <div className="d-flex gap-2">
                        <Button variant="link" size="sm" className="text-primary p-0" onClick={() => handleEdit(item)}>
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button variant="link" size="sm" className="text-danger p-0" onClick={() => handleDelete(item._id)}>
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    )}
                  </Card.Header>
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
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

      {/* COMPOSE MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="h5 fw-bold">{editing ? 'Update' : 'Compose'} Announcement</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Headline</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Announcement title"
                className="bg-light"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Details of the announcement..."
                className="bg-light"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-light"
                  >
                    <option value="General">General News</option>
                    <option value="Event">Public Event</option>
                    <option value="Notice">Official Notice</option>
                    <option value="Alert">Critical Alert</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Location</Form.Label>
              <Form.Control
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. City Hall, Main Street"
                className="bg-light"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light border-top">
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" className="fw-bold px-4">
              {editing ? 'Update' : 'Publish'} Broadcast
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </Container>
  );
};

export default Announcements;
