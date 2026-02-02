import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    adminRemarks: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${API_URL}/complaints/my-complaints`);
      setComplaints(response.data.data.complaints);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdate = (complaint) => {
    setSelectedComplaint(complaint);
    setFormData({
      status: complaint.status,
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
      setMessage({ type: 'success', text: 'Complaint status updated successfully.' });
      setShowModal(false);
      fetchComplaints();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to update complaint',
      });
    }
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      case 'in progress': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Grievance Redressal</h2>
          <p className="text-secondary small mb-0">Track and manage your civic complaints.</p>
        </div>
        {user?.role !== 'department' && (
          <Link to="/complaints/submit" className="btn btn-primary d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle"></i> New Complaint
          </Link>
        )}
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

      {/* DASHBOARD STATS - CLEAN GRID */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border shadow-sm h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-secondary text-uppercase small ls-1 mb-1">Total Filed</h6>
                <h3 className="fw-bold text-dark mb-0">{complaints.length}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 text-primary rounded p-3">
                <i className="bi bi-folder2-open fs-4"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border shadow-sm h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-secondary text-uppercase small ls-1 mb-1">Pending</h6>
                <h3 className="fw-bold text-warning mb-0">{complaints.filter(c => c.status === 'Pending').length}</h3>
              </div>
              <div className="bg-warning bg-opacity-10 text-warning rounded p-3">
                <i className="bi bi-hourglass-split fs-4"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border shadow-sm h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-secondary text-uppercase small ls-1 mb-1">Resolved</h6>
                <h3 className="fw-bold text-success mb-0">{complaints.filter(c => c.status === 'Resolved').length}</h3>
              </div>
              <div className="bg-success bg-opacity-10 text-success rounded p-3">
                <i className="bi bi-check-circle fs-4"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* COMPLAINTS TABLE */}
      <Card className="border shadow-sm">
        <Card.Header className="bg-white py-3">
          <h5 className="mb-0 fw-bold">Complaint History</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {complaints.length === 0 ? (
            <div className="text-center py-5 text-muted">No complaints found.</div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="bg-light text-secondary small text-uppercase">
                <tr>
                  <th className="ps-4">Ticket ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th className="text-end pe-4">{user?.role === 'department' ? 'Action' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td className="ps-4 fw-medium text-dark">#{c._id.slice(-6).toUpperCase()}</td>
                    <td className="fw-bold text-primary">{c.title}</td>
                    <td><Badge bg="light" text="dark" className="border">{c.category}</Badge></td>
                    <td className="small text-secondary">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="text-end pe-4">
                      {user?.role === 'department' ? (
                        <Button variant="light" size="sm" className="border fw-bold px-3 text-primary" onClick={() => handleUpdate(c)}>
                          Take Action
                        </Button>
                      ) : (
                        <Badge bg={getStatusVariant(c.status)}>{c.status}</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* UPDATE STATUS MODAL FOR DEPARTMENT USERS */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="h5 fw-bold">Update Complaint Status</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            {selectedComplaint && (
              <div className="mb-4">
                <div className="small text-muted text-uppercase fw-bold ls-1 mb-1">Complaint</div>
                <div className="fw-bold text-primary mb-2">{selectedComplaint.title}</div>
                <p className="small text-secondary mb-0">{selectedComplaint.description}</p>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="bg-light"
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Details of action taken..."
                value={formData.adminRemarks}
                className="bg-light"
                onChange={(e) => setFormData({ ...formData, adminRemarks: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light border-top">
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" className="fw-bold px-4">Update Status</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Complaints;
