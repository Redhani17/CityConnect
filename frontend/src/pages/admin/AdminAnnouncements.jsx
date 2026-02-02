import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Modal, Form, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminAnnouncements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    date: '',
    location: '',
    targetDepartment: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API_URL}/announcements`);
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
      targetDepartment: '',
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
      targetDepartment: announcement.targetDepartment || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editing) {
        await axios.put(`${API_URL}/announcements/${editing._id}`, formData);
        setMessage({ type: 'success', text: 'Announcement record updated successfully.' });
      } else {
        await axios.post(`${API_URL}/announcements`, formData);
        setMessage({ type: 'success', text: 'New broadcast published successfully.' });
      }
      setShowModal(false);
      fetchAnnouncements();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Transaction failed',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this official announcement? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/announcements/${id}`);
        setMessage({ type: 'success', text: 'Broadcast deleted from history.' });
        fetchAnnouncements();
      } catch (error) {
        setMessage({
          type: 'danger',
          text: error.response?.data?.message || 'Failed to remove record',
        });
      }
    }
  };

  const getCategoryBadge = (cat) => {
    const variants = {
      Alert: 'danger',
      Notice: 'info',
      Event: 'primary',
      General: 'secondary'
    };
    return <Badge bg={variants[cat] || 'secondary'} className="text-uppercase ls-1 px-2 py-1 fw-bold" style={{ fontSize: '0.65rem' }}>{cat}</Badge>;
  };

  if (loading) return (
    <Container className="py-5 text-center">
      <div className="spinner-border text-primary mb-3"></div>
      <p className="text-secondary fw-medium">Accessing Broadcast History...</p>
    </Container>
  );

  return (
    <Container className="py-4" style={{ maxWidth: '1400px' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-end mb-4 border-bottom pb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Official Newsroom</h2>
          <p className="text-secondary small mb-0">Manage information delivery to all citizens via the platform broadcast network.</p>
        </div>
        <div className="mt-4 mt-md-0">
          <Button variant="primary" className="fw-bold px-4 py-2 shadow-sm" onClick={handleCreate}>
            <i className="bi bi-plus-lg me-2"></i> New Broadcast
          </Button>
        </div>
      </div>

      {message.text && (
        <Alert
          variant={message.type}
          dismissible
          onClose={() => setMessage({ type: '', text: '' })}
          className="border-0 shadow-sm mb-4"
        >
          <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
          {message.text}
        </Alert>
      )}

      <Row className="g-4">
        {announcements.map((item) => (
          <Col lg={6} key={item._id}>
            <Card className="h-100 border-0 shadow-sm overflow-hidden">
              <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                {getCategoryBadge(item.category)}
                <div className="d-flex gap-2">
                  <Button variant="light" size="sm" className="border px-3 text-primary fw-bold" onClick={() => handleEdit(item)}>
                    <i className="bi bi-pencil me-1"></i> Edit
                  </Button>
                  <Button variant="light" size="sm" className="border px-3 text-danger fw-bold" onClick={() => handleDelete(item._id)}>
                    <i className="bi bi-trash me-1"></i> Remove
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-4 d-flex flex-column">
                <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                <p className="text-secondary small flex-grow-1" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {item.description}
                </p>
                <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center text-muted small">
                  <div className="fw-bold"><i className="bi bi-calendar3 me-1"></i> {new Date(item.date).toLocaleDateString()}</div>
                  <div className="d-flex gap-3">
                    {item.targetDepartment && <Badge bg="info" className="text-dark bg-opacity-10 border border-info border-opacity-25 px-2">Dept: {item.targetDepartment}</Badge>}
                    <div><i className="bi bi-geo-alt me-1"></i> {item.location || 'All Zones'}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* BROADCAST MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light py-3 border-bottom">
          <Modal.Title className="h5 fw-bold mb-0">
            {editing ? 'Update Announcement' : 'Compose New Broadcast'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Headline</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter the main title"
                    className="bg-light py-3 border-light shadow-inner"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Detailed Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Describe the news or event in detail..."
                    className="bg-light py-3 border-light shadow-inner"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    className="bg-light py-3 border-light"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="General">General News</option>
                    <option value="Event">Public Event</option>
                    <option value="Notice">Official Notice</option>
                    <option value="Alert">Critical Alert</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Schedule Date</Form.Label>
                  <Form.Control
                    type="date"
                    className="bg-light py-3 border-light"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Location / Zone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Optional"
                    className="bg-light py-3 border-light"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Target Department</Form.Label>
                  <Form.Select
                    value={formData.targetDepartment}
                    className="bg-light py-3 border-light shadow-inner"
                    onChange={(e) => setFormData({ ...formData, targetDepartment: e.target.value })}
                  >
                    <option value="">All Departments (Public)</option>
                    <option value="Roads">Roads & Infrastructure</option>
                    <option value="Water Supply">Water & Sanitation</option>
                    <option value="Electricity">Public Lighting/Electricity</option>
                    <option value="Waste Management">Solid Waste Management</option>
                    <option value="Parks & Recreation">Parks & Greenery</option>
                    <option value="Public Safety">Public Safety & Surveillance</option>
                    <option value="Other">Other Miscellaneous</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    If selected, this announcement will only be visible to officials of this department (and Admins).
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light border-top py-3">
            <Button variant="outline-secondary" className="px-4 fw-medium" onClick={() => setShowModal(false)}>
              Discard
            </Button>
            <Button variant="primary" type="submit" className="px-4 fw-bold shadow-sm">
              {editing ? 'Update Record' : 'Publish Broadcast'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminAnnouncements;
