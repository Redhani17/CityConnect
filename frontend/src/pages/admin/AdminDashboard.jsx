import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

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
      <h2 className="mb-4">Admin Dashboard - Welcome, {user?.name}!</h2>
      <Row>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Complaints</Card.Title>
              <h2>{stats.totalComplaints}</h2>
              <Link to="/admin/complaints" className="btn btn-primary">
                Manage
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Pending Complaints</Card.Title>
              <h2 className="text-warning">{stats.pendingComplaints}</h2>
              <Link to="/admin/complaints" className="btn btn-warning">
                Review
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Announcements</Card.Title>
              <h2>{stats.announcements}</h2>
              <Link to="/admin/announcements" className="btn btn-primary">
                Manage
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Job Postings</Card.Title>
              <h2>{stats.jobs}</h2>
              <Link to="/admin/jobs" className="btn btn-primary">
                Manage
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
