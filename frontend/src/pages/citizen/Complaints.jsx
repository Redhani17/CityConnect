import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Complaints = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const BASE_URL = API_URL.replace('/api', '');

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
      case 'in progress': return 'info';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Roads': 'bi-cone-striped',
      'Water Supply': 'bi-droplet-fill',
      'Electricity': 'bi-lightning-fill',
      'Waste Management': 'bi-trash-fill',
      'Parks & Recreation': 'bi-tree-fill',
      'Public Safety': 'bi-shield-fill-check',
      'Other': 'bi-question-circle-fill'
    };
    return iconMap[category] || 'bi-exclamation-circle-fill';
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 sticky-top bg-white py-3 border-bottom z-1">
        <div>
          <h2 className="fw-bold text-dark mb-1">{t('complaints.title')}</h2>
          <p className="text-secondary small mb-0">{t('complaints.subtitle')}</p>
        </div>
        <Link to="/complaints/submit" className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold">
          <i className="bi bi-plus-lg me-2"></i> {t('complaints.new')}
        </Link>
      </div>

      <Row className="g-4 mb-4">
        <Col xs={4}>
          <div className="bg-light rounded p-2 text-center border">
            <div className="fw-bold fs-5">{complaints.length}</div>
            <div className="small text-secondary text-uppercase" style={{ fontSize: '0.7rem' }}>{t('complaints.total')}</div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="bg-warning bg-opacity-10 rounded p-2 text-center border border-warning">
            <div className="fw-bold fs-5 text-warning">{complaints.filter(c => c.status === 'Pending').length}</div>
            <div className="small text-warning text-uppercase" style={{ fontSize: '0.7rem' }}>{t('complaints.pending')}</div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="bg-success bg-opacity-10 rounded p-2 text-center border border-success">
            <div className="fw-bold fs-5 text-success">{complaints.filter(c => c.status === 'Resolved').length}</div>
            <div className="small text-success text-uppercase" style={{ fontSize: '0.7rem' }}>{t('complaints.resolved')}</div>
          </div>
        </Col>
      </Row>

      {complaints.length === 0 ? (
        <div className="text-center py-5 text-muted bg-light rounded-4 border border-dashed">
          <i className="bi bi-inbox fs-1 mb-3 d-block opacity-50"></i>
          <div>{t('complaints.no_complaints')}</div>
          <Link to="/complaints/submit" className="btn btn-link text-decoration-none">Start your first post</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {complaints.map((c) => (
            <Card key={c._id} className="border-0 shadow-sm rounded-4 overflow-hidden">
              <Card.Header className="bg-white border-0 px-4 pt-4 pb-0 d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-center gap-3">
                  <div className={`bg-light rounded-circle d-flex align-items-center justify-content-center text-primary`} style={{ width: '48px', height: '48px' }}>
                    <i className={`bi ${getCategoryIcon(c.category)} fs-4`}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{c.title}</h5>
                    <div className="text-secondary small">
                      {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      <span className="mx-1">•</span>
                      <span className="text-muted">{c.location}</span>
                    </div>
                  </div>
                </div>
                <Badge bg={getStatusVariant(c.status)} className="rounded-pill px-3 py-2 fw-normal">
                  {c.status}
                </Badge>
              </Card.Header>

              <Card.Body className="px-4 py-3">
                <p className="text-dark mb-3" style={{ whiteSpace: 'pre-wrap' }}>{c.description}</p>

                {c.imageUrl && (
                  <div className="rounded-3 overflow-hidden border mb-3">
                    <img
                      src={`${BASE_URL}${c.imageUrl}`}
                      alt="Complaint Evidence"
                      className="w-100 object-fit-cover"
                      style={{ maxHeight: '400px' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x400?text=Image+Load+Error'; }}
                    />
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <div className="text-secondary small">
                    <i className="bi bi-hash"></i> Ticket ID: {c._id.slice(-6).toUpperCase()}
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="light" size="sm" className="rounded-pill px-3 text-secondary">
                      <i className="bi bi-chat me-1"></i> Comments
                    </Button>
                    <Button variant="light" size="sm" className="rounded-pill px-3 text-secondary">
                      <i className="bi bi-share me-1"></i> Share
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Complaints;
