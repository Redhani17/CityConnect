import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    complaints: 0,
    pendingBills: 0,
    announcements: 0,
  });
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [complaintsRes, billsRes, announcementsRes] = await Promise.all([
        axios.get(`${API_URL}/complaints/my-complaints`),
        axios.get(`${API_URL}/bills/my-bills`),
        axios.get(`${API_URL}/announcements`),
      ]);

      setStats({
        complaints: complaintsRes.data.data.complaints.length,
        pendingBills: billsRes.data.data.bills.filter((b) => b.status === 'Pending').length,
        announcements: announcementsRes.data.data.announcements.length,
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
      <h2 className="mb-4">Welcome, {user?.name}!</h2>
      <Row>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>My Complaints</Card.Title>
              <h2>{stats.complaints}</h2>
              <Link to="/complaints" className="btn btn-primary">
                View Complaints
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Pending Bills</Card.Title>
              <h2>{stats.pendingBills}</h2>
              <Link to="/bills" className="btn btn-primary">
                View Bills
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Announcements</Card.Title>
              <h2>{stats.announcements}</h2>
              <Link to="/announcements" className="btn btn-primary">
                View Announcements
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <Link to="/complaints/submit" className="btn btn-success me-2 mb-2">
                Submit Complaint
              </Link>
              <Link to="/emergency" className="btn btn-danger me-2 mb-2">
                Emergency SOS
              </Link>
              <Link to="/chatbot" className="btn btn-info me-2 mb-2">
                Ask Chatbot
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Services</Card.Title>
              <Link to="/jobs" className="btn btn-outline-primary me-2 mb-2">
                Job Opportunities
              </Link>
              <Link to="/announcements" className="btn btn-outline-primary me-2 mb-2">
                City Events
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CitizenDashboard;
