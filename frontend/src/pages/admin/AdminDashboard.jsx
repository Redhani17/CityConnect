import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    announcements: 0,
    jobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [complaintsRes, announcementsRes, jobsRes] = await Promise.all([
        axios.get(`${API_URL}/complaints/all`),
        axios.get(`${API_URL}/announcements`),
        axios.get(`${API_URL}/jobs`),
      ]);

      const complaints = complaintsRes.data.data.complaints;
      setStats({
        totalComplaints: complaints.length,
        pendingComplaints: complaints.filter((c) => c.status === 'Pending').length,
        announcements: announcementsRes.data.data.announcements.length,
        jobs: jobsRes.data.data.jobs.length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Container className="py-5 text-center">
      <div className="spinner-border text-primary mb-3"></div>
      <p className="text-secondary fw-medium">Initializing Administration Terminal...</p>
    </Container>
  );

  return (
    <Container className="py-4" style={{ maxWidth: '1400px' }}>
      {/* WELCOME BANNER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border rounded-3 p-4 mb-5 shadow-sm d-flex justify-content-between align-items-center"
      >
        <div>
          <Badge bg="dark" className="mb-2 text-uppercase ls-1 px-3 py-2">Administrator Access</Badge>
          <h2 className="h3 fw-bold text-dark mb-1">Government Management Portal</h2>
          <p className="text-secondary small mb-0">System Overview & Command Center for Official {user?.name}</p>
        </div>
        <div className="text-end d-none d-md-block">
          <div className="text-muted small fw-bold text-uppercase ls-1 mb-1">Server Status</div>
          <Badge bg="success" className="rounded-pill px-3">ACTIVE / ENCRYPTED</Badge>
        </div>
      </motion.div>

      {/* METRICS GRID */}
      <Row className="g-4 mb-5">
        <Col lg={3} md={6}>
          <Card className="h-100 border-0 shadow-sm overflow-hidden">
            <div className="bg-primary py-1"></div>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-primary bg-opacity-10 p-2 rounded text-primary">
                  <i className="bi bi-file-earmark-text fs-4"></i>
                </div>
                <Badge bg="light" text="primary" className="border">LIFETIME</Badge>
              </div>
              <h6 className="text-muted small fw-bold text-uppercase ls-1">Total Grievances</h6>
              <h2 className="fw-bold text-dark mb-3">{stats.totalComplaints}</h2>
              <Button as={Link} to="/admin/complaints" variant="link" className="p-0 text-primary fw-bold text-decoration-none small">
                View Registry <i className="bi bi-arrow-right small"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="h-100 border-0 shadow-sm overflow-hidden">
            <div className="bg-warning py-1"></div>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-warning bg-opacity-10 p-2 rounded text-warning">
                  <i className="bi bi-clock-history fs-4"></i>
                </div>
                <Badge bg="warning-subtle" text="warning" className="border border-warning border-opacity-25">ACTION REQUIRED</Badge>
              </div>
              <h6 className="text-muted small fw-bold text-uppercase ls-1">Pending Review</h6>
              <h2 className="fw-bold text-dark mb-3">{stats.pendingComplaints}</h2>
              <Button as={Link} to="/admin/complaints" variant="link" className="p-0 text-warning fw-bold text-decoration-none small">
                Resolve Now <i className="bi bi-arrow-right small"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="h-100 border-0 shadow-sm overflow-hidden">
            <div className="bg-info py-1"></div>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-info bg-opacity-10 p-2 rounded text-info">
                  <i className="bi bi-megaphone fs-4"></i>
                </div>
                <Badge bg="light" text="info" className="border">PUBLIC</Badge>
              </div>
              <h6 className="text-muted small fw-bold text-uppercase ls-1">Active Broadcasts</h6>
              <h2 className="fw-bold text-dark mb-3">{stats.announcements}</h2>
              <Button as={Link} to="/admin/announcements" variant="link" className="p-0 text-info fw-bold text-decoration-none small">
                Post Update <i className="bi bi-arrow-right small"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="h-100 border-0 shadow-sm overflow-hidden">
            <div className="bg-success py-1"></div>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-success bg-opacity-10 p-2 rounded text-success">
                  <i className="bi bi-briefcase fs-4"></i>
                </div>
                <Badge bg="light" text="success" className="border">TENDER OPS</Badge>
              </div>
              <h6 className="text-muted small fw-bold text-uppercase ls-1">Job Postings</h6>
              <h2 className="fw-bold text-dark mb-3">{stats.jobs}</h2>
              <Button as={Link} to="/admin/jobs" variant="link" className="p-0 text-success fw-bold text-decoration-none small">
                Create Listing <i className="bi bi-arrow-right small"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ADMINISTRATIVE QUICK ACTIONS */}
      <Row className="g-4">
        <Col lg={12}>
          <Card className="border shadow-sm">
            <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold"><i className="bi bi-grid-fill me-2 text-primary"></i>Management Console</h5>
              <span className="small text-muted font-mono">AUTHORIZED PERSONNEL ONLY</span>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-3">
                <Col md={4}>
                  <Button as={Link} to="/admin/complaints" variant="light" className="w-100 py-3 border text-start d-flex align-items-center">
                    <i className="bi bi-chat-left-dots fs-4 me-3 text-primary"></i>
                    <div>
                      <div className="fw-bold small">Complaints Dept.</div>
                      <div className="text-muted small" style={{ fontSize: '0.7rem' }}>Review & Assign Tickets</div>
                    </div>
                  </Button>
                </Col>
                <Col md={4}>
                  <Button as={Link} to="/admin/announcements" variant="light" className="w-100 py-3 border text-start d-flex align-items-center">
                    <i className="bi bi-megaphone fs-4 me-3 text-info"></i>
                    <div>
                      <div className="fw-bold small">Public Notices</div>
                      <div className="text-muted small" style={{ fontSize: '0.7rem' }}>Broadcast Portal</div>
                    </div>
                  </Button>
                </Col>
                <Col md={4}>
                  <Button as={Link} to="/admin/jobs" variant="light" className="w-100 py-3 border text-start d-flex align-items-center">
                    <i className="bi bi-people fs-4 me-3 text-success"></i>
                    <div>
                      <div className="fw-bold small">Jobs & Tenders</div>
                      <div className="text-muted small" style={{ fontSize: '0.7rem' }}>Employment Board</div>
                    </div>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
