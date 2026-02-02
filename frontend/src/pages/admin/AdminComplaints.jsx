import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    assignedDepartment: '',
    adminRemarks: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_URL = API_URL.replace('/api', '');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${API_URL}/complaints/all`);
      setComplaints(response.data.data.complaints);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (complaint) => {
    setSelectedComplaint(complaint);
    setFormData({
      status: complaint.status,
      assignedDepartment: complaint.assignedDepartment || '',
      adminRemarks: complaint.adminRemarks || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await axios.put(
        `${API_URL}/complaints/${selectedComplaint._id}/status`,
        formData
      );
      setMessage({ type: 'success', text: 'Official record updated successfully.' });
      setShowModal(false);
      fetchComplaints();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to update record',
      });
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      Pending: { bg: 'warning-subtle', text: 'warning', icon: 'bi-clock' },
      'In Progress': { bg: 'info-subtle', text: 'info', icon: 'bi-gear-fill' },
      Resolved: { bg: 'success-subtle', text: 'success', icon: 'bi-check-circle-fill' },
    };
    const config = configs[status] || { bg: 'secondary', text: 'white', icon: 'bi-question' };

    return (
      <Badge bg={config.bg} className={`text-${config.text} border border-${config.text} border-opacity-25 px-2 py-1 fw-bold text-uppercase ls-1`} style={{ fontSize: '0.65rem' }}>
        <i className={`bi ${config.icon} me-1`}></i> {status}
      </Badge>
    );
  };

  if (loading) return (
    <Container className="py-5 text-center">
      <div className="spinner-border text-primary mb-3"></div>
      <p className="text-secondary fw-medium">Loading citizen grievances...</p>
    </Container>
  );

  return (
    <Container className="py-4" style={{ maxWidth: '1400px' }}>
      <div className="mb-4 d-flex justify-content-between align-items-end">
        <div>
          <h2 className="fw-bold text-dark mb-1">Grievance Management</h2>
          <p className="text-secondary small mb-0">Centralized log of all citizen-reported civic issues requiring administrative action.</p>
        </div>
        <div className="font-mono small text-muted">
          Total Records: <span className="fw-bold text-primary">{complaints.length}</span>
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

      <Card className="border-0 shadow-sm overflow-hidden">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light border-bottom text-uppercase small ls-1 fw-bold text-secondary">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="py-3">Reporting Citizen</th>
                <th className="py-3">Category / Location</th>
                <th className="py-3 text-center">Status</th>
                <th className="py-3 px-4 text-end">Management</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id} className="border-bottom">
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark">{complaint.title}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                      ID: {complaint._id.slice(-8).toUpperCase()}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="fw-medium text-dark">{complaint.userId?.name || 'N/A'}</div>
                    <div className="text-muted small">{complaint.userId?.email}</div>
                  </td>
                  <td className="py-3">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <Badge bg="light" text="secondary" className="border fw-normal">{complaint.category}</Badge>
                    </div>
                    <div className="text-muted small"><i className="bi bi-geo-alt me-1"></i> {complaint.location}</div>
                  </td>
                  <td className="py-3 text-center">
                    {getStatusBadge(complaint.status)}
                  </td>
                  <td className="py-3 px-4 text-end">
                    <Button
                      variant="light"
                      size="sm"
                      className="border fw-bold px-3 text-primary"
                      onClick={() => handleUpdate(complaint)}
                    >
                      Take Action
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* ACTION MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light py-3 border-bottom">
          <Modal.Title className="h5 fw-bold mb-0">Record Management Dashboard</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            {selectedComplaint && (
              <div className="bg-light p-3 rounded-3 mb-4 border">
                {selectedComplaint.imageUrl && (
                  <div className="mb-4 rounded-3 overflow-hidden border shadow-sm bg-white">
                    <img
                      src={`${BASE_URL}${selectedComplaint.imageUrl}`}
                      alt="Complaint Evidence"
                      className="w-100 object-fit-contain"
                      style={{ maxHeight: '350px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/800x400?text=Evidence+Image+Not+Found';
                      }}
                    />
                  </div>
                )}
                <Row className="g-3">
                  <Col md={12}>
                    <label className="text-muted small fw-bold text-uppercase ls-1 d-block mb-1">Incident Detail</label>
                    <div className="fw-bold h6 mb-1 text-primary">{selectedComplaint.title}</div>
                    <p className="text-secondary small mb-0">{selectedComplaint.description}</p>
                  </Col>
                  <Col md={6}>
                    <label className="text-muted small fw-bold text-uppercase ls-1 d-block mb-1">Reporter</label>
                    <div className="small fw-medium">{selectedComplaint.userId?.name} ({selectedComplaint.userId?.email})</div>
                  </Col>
                  <Col md={6}>
                    <label className="text-muted small fw-bold text-uppercase ls-1 d-block mb-1">Date Logged</label>
                    <div className="small fw-medium">{new Date(selectedComplaint.createdAt).toLocaleString()}</div>
                  </Col>
                </Row>
              </div>
            )}

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Update Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="py-2 bg-white border-subtle"
                    required
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="In Progress">Investigation In Progress</option>
                    <option value="Resolved">Resolution Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Assign to Department</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Civil Works, PWD, Health"
                    value={formData.assignedDepartment}
                    className="py-2 bg-white border-subtle"
                    onChange={(e) => setFormData({ ...formData, assignedDepartment: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Official Administrator Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Provide specific details about the action taken or next steps..."
                    value={formData.adminRemarks}
                    className="py-2 bg-white border-subtle"
                    onChange={(e) => setFormData({ ...formData, adminRemarks: e.target.value })}
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
              Commit Record Update
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminComplaints;
