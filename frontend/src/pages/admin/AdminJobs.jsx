import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Modal, Form, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    salary: '',
    requirements: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`);
      setJobs(response.data.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setFormData({
      title: '',
      description: '',
      department: '',
      location: '',
      salary: '',
      requirements: '',
      contactEmail: '',
      contactPhone: '',
    });
    setShowModal(true);
  };

  const handleEdit = (job) => {
    setEditing(job);
    setFormData({
      title: job.title,
      description: job.description,
      department: job.department,
      location: job.location,
      salary: job.salary,
      requirements: job.requirements || '',
      contactEmail: job.contactEmail,
      contactPhone: job.contactPhone || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editing) {
        await axios.put(`${API_URL}/jobs/${editing._id}`, formData);
        setMessage({ type: 'success', text: 'Tender record updated successfully.' });
      } else {
        await axios.post(`${API_URL}/jobs`, formData);
        setMessage({ type: 'success', text: 'New employment opportunity published.' });
      }
      setShowModal(false);
      fetchJobs();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Transaction failed',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this job posting from the public board?')) {
      try {
        await axios.delete(`${API_URL}/jobs/${id}`);
        setMessage({ type: 'success', text: 'Posting successfully archived/removed.' });
        fetchJobs();
      } catch (error) {
        setMessage({
          type: 'danger',
          text: error.response?.data?.message || 'Failed to remove posting',
        });
      }
    }
  };

  if (loading) return (
    <Container className="py-5 text-center">
      <div className="spinner-border text-primary mb-3"></div>
      <p className="text-secondary fw-medium">Retrieving Employment Records...</p>
    </Container>
  );

  return (
    <Container className="py-4" style={{ maxWidth: '1400px' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-end mb-4 border-bottom pb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Employment Board Ops</h2>
          <p className="text-secondary small mb-0">Manage municipal job postings, government contracts, and development tenders.</p>
        </div>
        <div className="mt-4 mt-md-0">
          <Button variant="success" className="fw-bold px-4 py-2 shadow-sm text-white border-0" onClick={handleCreate}>
            <i className="bi bi-briefcase me-2"></i> Post New Role
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
        {jobs.map((job) => (
          <Col lg={6} key={job._id}>
            <Card className="h-100 border-0 shadow-sm overflow-hidden">
              <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <Badge bg="success-subtle" className="text-success border border-success border-opacity-25 text-uppercase ls-1 px-2 py-1 fw-bold" style={{ fontSize: '0.65rem' }}>
                  {job.department}
                </Badge>
                <div className="d-flex gap-2">
                  <Button variant="light" size="sm" className="border px-3 text-primary fw-bold" onClick={() => handleEdit(job)}>
                    <i className="bi bi-pencil me-1"></i> Edit
                  </Button>
                  <Button variant="light" size="sm" className="border px-3 text-danger fw-bold" onClick={() => handleDelete(job._id)}>
                    <i className="bi bi-trash me-1"></i> Delete
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-4 d-flex flex-column">
                <h5 className="fw-bold text-dark mb-2">{job.title}</h5>
                <p className="text-secondary small mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {job.description.length > 200 ? job.description.substring(0, 200) + '...' : job.description}
                </p>

                <Row className="g-2 mt-auto pt-3 border-top">
                  <Col xs={6}>
                    <div className="text-muted small fw-bold text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>Location</div>
                    <div className="small fw-medium text-dark"><i className="bi bi-geo-alt me-1"></i> {job.location}</div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-muted small fw-bold text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>Salary Range</div>
                    <div className="small fw-medium text-success fw-bold">{job.salary || 'Competitive'}</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* JOB MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light py-3 border-bottom">
          <Modal.Title className="h5 fw-bold mb-0">Record Detail Management</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Job Headline / Tender Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Senior Civil Engineer, Data Entry Operator"
                    className="bg-light py-3 border-light shadow-inner"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Department</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Public Works, IT Dept"
                    className="bg-light py-2 border-light shadow-inner"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Work Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Central Zone, Sector 4, remote etc."
                    className="bg-light py-2 border-light shadow-inner"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Description of Scope</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Outline the responsibilities and project scope..."
                    className="bg-light py-2 border-light shadow-inner"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Salary / Compensation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. ₹50,000 / Month"
                    className="bg-light py-2 border-light shadow-inner"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Primary Multi-media Contact</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Official Dept Email"
                    className="bg-light py-2 border-light shadow-inner"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light border-top py-3">
            <Button variant="outline-secondary" className="px-4 fw-medium" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="px-4 fw-bold shadow-sm">
              {editing ? 'Commit Record Changes' : 'Publish Opportunity'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminJobs;
