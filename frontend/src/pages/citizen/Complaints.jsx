import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
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
    fetchComplaints();
  }, []);

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
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
        <Link to="/complaints/submit" className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-plus-circle"></i> New Complaint
        </Link>
      </div>

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
                  <th className="text-end pe-4">Status</th>
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
                      <Badge bg={getStatusVariant(c.status)}>{c.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Complaints;
