import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    complaints: 0,
    pendingBills: 0,
    announcements: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ rating: 0, suggestion: '' });
  const [feedbackStatus, setFeedbackStatus] = useState({ type: '', text: '' });
  const [hoverRating, setHoverRating] = useState(0);
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

      const complaints = complaintsRes.data.data.complaints;
      const bills = billsRes.data.data.bills;

      setStats({
        complaints: complaints.length,
        pendingBills: bills.filter((b) => b.status === 'Pending').length,
        announcements: announcementsRes.data.data.announcements.length,
      });

      // MOCK UP RECENT ACTIVITY FROM REAL DATA
      const activity = [
        ...complaints.map(c => ({
          type: 'Complaint',
          desc: `${t('dashboard.description')}: ${c.title}`,
          date: c.createdAt,
          status: c.status,
          link: '/complaints'
        })),
        ...bills.map(b => ({
          type: 'Bill',
          desc: `Bill #${b._id.slice(-6).toUpperCase()}`,
          date: b.dueDate,
          status: b.status,
          link: '/bills'
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      setRecentActivity(activity);

    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'resolved': return 'success';
      case 'paid': return 'success';
      case 'rejected': return 'danger';
      case 'open': return 'primary';
      default: return 'secondary';
    }
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (feedbackData.rating === 0) {
      setFeedbackStatus({ type: 'danger', text: 'Please select a star rating.' });
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/feedback`, feedbackData);
      setFeedbackStatus({ type: 'success', text: 'Thank you for your feedback!' });
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackData({ rating: 0, suggestion: '' });
        setFeedbackStatus({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setFeedbackStatus({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to submit feedback. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-5 text-center text-muted">Loading Dashboard...</div>;

  return (
    <Container className="py-4">
      {/* WELCOME BANNER */}
      <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 className="h4 fw-bold text-primary mb-1">
            {user?.role === 'department' ? `${user.department} Department Portal` : t('dashboard.welcome', { name: user?.name })}
          </h2>
          <p className="text-secondary mb-0 small">
            {user?.role === 'department'
              ? `Official access for ${user.name}`
              : t('dashboard.citizen_id', { id: user?._id?.slice(-8).toUpperCase() || 'N/A' })} &bull; {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="d-flex gap-2">
          {user?.role !== 'department' && (
            <>
              <Button as={Link} to="/complaints/submit" variant="primary" size="sm" className="fw-bold px-3">
                <i className="bi bi-plus-circle me-2"></i>{t('dashboard.new_complaint')}
              </Button>
              <Button as={Link} to="/bills" variant="outline-primary" size="sm" className="fw-bold px-3">
                <i className="bi bi-credit-card me-2"></i>{t('dashboard.pay_bills')}
              </Button>
            </>
          )}
        </div>
      </div>

      <Row className="g-4 mb-4">
        {/* STATS CARDS */}
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm bg-primary text-white">
            <Card.Body className="d-flex align-items-center justify-content-between p-4">
              <div>
                <h6 className="opacity-75 text-uppercase small ls-1 mb-2">{t('dashboard.active_complaints')}</h6>
                <h2 className="display-5 fw-bold mb-0">{stats.complaints}</h2>
              </div>
              <div className="bg-white bg-opacity-25 rounded-circle p-3">
                <i className="bi bi-exclamation-octagon fs-3 text-white"></i>
              </div>
            </Card.Body>
            <Card.Footer className="bg-primary bg-opacity-75 border-0 text-center py-2">
              <Link to="/complaints" className="text-white text-decoration-none small fw-bold">{t('dashboard.view_details')} &rarr;</Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between p-4">
              <div>
                <h6 className="text-secondary text-uppercase small ls-1 mb-2">{t('dashboard.pending_bills')}</h6>
                <h2 className="display-5 fw-bold mb-0 text-dark">{stats.pendingBills}</h2>
              </div>
              <div className="bg-success bg-opacity-10 rounded-circle p-3">
                <i className="bi bi-receipt fs-3 text-success"></i>
              </div>
            </Card.Body>
            <Card.Footer className="bg-light border-top text-center py-2">
              <Link to="/bills" className="text-primary text-decoration-none small fw-bold">{t('dashboard.review_payments')} &rarr;</Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between p-4">
              <div>
                <h6 className="text-secondary text-uppercase small ls-1 mb-2">{t('dashboard.city_updates')}</h6>
                <h2 className="display-5 fw-bold mb-0 text-dark">{stats.announcements}</h2>
              </div>
              <div className="bg-info bg-opacity-10 rounded-circle p-3">
                <i className="bi bi-bell fs-3 text-info"></i>
              </div>
            </Card.Body>
            <Card.Footer className="bg-light border-top text-center py-2">
              <Link to="/announcements" className="text-primary text-decoration-none small fw-bold">{t('dashboard.read_news')} &rarr;</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* RECENT ACTIVITY TABLE */}
        <Col lg={8}>
          <Card className="border shadow-sm mb-4">
            <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h6 className="fw-bold m-0 text-dark">{t('dashboard.recent_activity')}</h6>
              <Link to="/profile" className="small text-decoration-none">{t('dashboard.view_all')}</Link>
            </Card.Header>
            <Card.Body className="p-0">
              {recentActivity.length === 0 ? (
                <div className="p-4 text-center text-muted small">No recent activity found.</div>
              ) : (
                <Table responsive hover className="m-0 align-middle user-select-none">
                  <thead className="bg-light text-secondary small text-uppercase">
                    <tr>
                      <th className="ps-4 fw-bold">{t('dashboard.type')}</th>
                      <th className="fw-bold">{t('dashboard.description')}</th>
                      <th className="fw-bold">{t('dashboard.date')}</th>
                      <th className="fw-bold text-end pe-4">{t('dashboard.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((item, idx) => (
                      <tr key={idx} style={{ cursor: 'pointer' }} onClick={() => window.location.href = item.link}>
                        <td className="ps-4">
                          <span className={`badge ${item.type === 'Bill' ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-${item.type === 'Bill' ? 'success' : 'dark'} border`}>{item.type}</span>
                        </td>
                        <td className="fw-medium text-dark">{item.desc}</td>
                        <td className="small text-muted font-mono">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="text-end pe-4">
                          <Badge bg={getStatusBadge(item.status)}>{item.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* SIDEBAR WIDGETS */}
        <Col lg={4}>
          <Card className="border shadow-sm mb-4">
            <Card.Body>
              <h6 className="fw-bold text-dark mb-3">{t('dashboard.quick_nav')}</h6>
              <div className="d-grid gap-2">
                <Button as={Link} to="/emergency" variant="outline-danger" className="text-start d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-shield-fill-exclamation me-2"></i>{t('navbar.emergency')} SOS</span>
                  <i className="bi bi-chevron-right small"></i>
                </Button>
                <Button as={Link} to="/chatbot" variant="outline-secondary" className="text-start d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-robot me-2"></i>{t('navbar.chatbot')}</span>
                  <i className="bi bi-chevron-right small"></i>
                </Button>
                <Button as={Link} to="/jobs" variant="outline-dark" className="text-start d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-briefcase me-2"></i>{t('navbar.jobs')}</span>
                  <i className="bi bi-chevron-right small"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="bg-primary text-white border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <i className="bi bi-chat-heart text-white-50 display-4 mb-3 d-block"></i>
              <h5 className="fw-bold">{t('dashboard.feedback_title')}</h5>
              <p className="small text-white-50 mb-3">{t('dashboard.feedback_desc')}</p>
              <Button
                variant="light"
                size="sm"
                className="fw-bold text-primary px-4"
                onClick={() => setShowFeedbackModal(true)}
              >
                {t('dashboard.share_feedback')}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FEEDBACK MODAL */}
      <Modal show={showFeedbackModal} onHide={() => !loading && setShowFeedbackModal(false)} centered>
        <Modal.Header closeButton={!loading} className="border-0 pb-0">
          <Modal.Title className="fw-bold text-dark w-100 text-center mt-3">
            {t('dashboard.feedback_title')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <p className="text-secondary text-center small mb-4">{t('dashboard.feedback_desc')}</p>

          {feedbackStatus.text && (
            <Alert variant={feedbackStatus.type} className="py-2 small text-center border-0 shadow-sm mb-3">
              {feedbackStatus.text}
            </Alert>
          )}

          <Form onSubmit={handleFeedbackSubmit}>
            <div className="text-center mb-4">
              <div className="d-flex justify-content-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`bi bi-star${(hoverRating || feedbackData.rating) >= star ? '-fill' : ''} fs-2 cursor-pointer transition-all ${((hoverRating || feedbackData.rating) >= star) ? 'text-warning' : 'text-light border-secondary'}`}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                  ></i>
                ))}
              </div>
              <div className="small text-muted mt-2">
                {feedbackData.rating > 0 ? `${feedbackData.rating} ${t('dashboard.stars')}` : 'Tap to rate'}
              </div>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">How can we improve?</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Share your suggestions or appreciation..."
                value={feedbackData.suggestion}
                onChange={(e) => setFeedbackData({ ...feedbackData, suggestion: e.target.value })}
                required
                className="bg-light border-0 py-3"
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 py-3 fw-bold shadow-sm"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Send Feedback'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CitizenDashboard;
