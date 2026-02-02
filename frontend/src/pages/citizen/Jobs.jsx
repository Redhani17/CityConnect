import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Badge, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Jobs = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ department: '', location: '' });
  const [callMessage, setCallMessage] = useState({ type: '', text: '' });
  const [callingId, setCallingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.location) params.append('location', filters.location);

      const url = `${API_URL}/jobs${params.toString() ? '?' + params.toString() : ''}`;
      const response = await axios.get(url);
      setJobs(response.data.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleMakeCall = async (jobId, phoneNumber) => {
    if (!phoneNumber) {
      setCallMessage({ type: 'warning', text: 'No contact number available for this job.' });
      return;
    }

    setCallingId(jobId);
    setCallMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`${API_URL}/twilio/call`, { phoneNumber });
      if (response.data.success) {
        setCallMessage({ type: 'success', text: `Call initiated to ${phoneNumber}!` });
      }
    } catch (error) {
      setCallMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to connect call via Twilio.'
      });
    } finally {
      setCallingId(null);
      // Auto-hide message after 5 seconds
      setTimeout(() => setCallMessage({ type: '', text: '' }), 5000);
    }
  };

  // Helper to get a random color for the "Tag" based on string
  const getTagColor = (str) => {
    const colors = ['bg-info', 'bg-success', 'bg-warning', 'bg-danger', 'bg-primary'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Container className="py-4" style={{ maxWidth: '1400px' }}>

      <h2 className="mb-4 text-dark fw-normal opacity-75">{t('jobs.title')}</h2>

      {callMessage.text && (
        <Alert variant={callMessage.type} dismissible onClose={() => setCallMessage({ type: '', text: '' })}>
          {callMessage.text}
        </Alert>
      )}

      {/* FILTERS SECTION */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <Row className="g-3 align-items-end">
            <Col md={5}>
              <Form.Group>
                <Form.Label className="text-muted small mb-1">{t('jobs.department')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('jobs.department')}
                  className="py-2"
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label className="text-muted small mb-1">{t('jobs.location')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('jobs.location')}
                  className="py-2"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button
                variant="secondary"
                className="w-100 py-2 bg-secondary text-white border-0"
                onClick={() => setFilters({ department: '', location: '' })}
              >
                {t('jobs.clear_filters')}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* JOBS GRID */}
      <Row className="g-4">
        {jobs.map((job, idx) => (
          <Col md={6} key={job._id}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <Badge className={`${getTagColor(job.department || 'General')} rounded-1 fw-normal px-2 py-1`}>
                    {job.department ? job.department.slice(0, 2).toUpperCase() : 'GO'}
                  </Badge>
                  <small className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </small>
                </div>

                <h5 className="fw-normal mb-2 text-dark opacity-75">{job.title}</h5>
                <p className="text-muted mb-3 small">{job.description}</p>

                <div className="mb-3">
                  <div className="fw-bold text-dark small mb-1">
                    {t('jobs.location')}: <span className="fw-normal text-secondary">{job.location}</span>
                  </div>
                  <div className="fw-bold text-dark small mb-2">
                    {t('jobs.salary')}: <span className="fw-normal text-secondary">{job.salary}</span>
                  </div>
                  {job.requirements && (
                    <div className="fw-bold text-dark small">
                      {t('jobs.requirements')}: <span className="fw-normal text-secondary">{job.requirements}</span>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2 mt-4">
                  <Button
                    variant="primary"
                    size="sm"
                    className="px-3 py-1 rounded-1 text-white border-0"
                    style={{ backgroundColor: '#0d6efd' }}
                    href={`mailto:${job.contactEmail}`}
                  >
                    {t('jobs.contact')}: {job.contactEmail}
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="px-3 py-1 rounded-1 d-flex align-items-center"
                    disabled={callingId === job._id}
                    onClick={() => handleMakeCall(job._id, job.contactPhone)}
                  >
                    {callingId === job._id ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="bi bi-telephone-outbound me-2"></i>
                    )}
                    {t('jobs.call')}: {job.contactPhone || 'N/A'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {jobs.length === 0 && !loading && (
          <Col xs={12}>
            <div className="text-center py-5 text-muted">
              {t('jobs.no_jobs')}
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Jobs;
