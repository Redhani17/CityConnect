import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ department: '', location: '' });
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
      <h2 className="mb-4">Local Jobs & Opportunities</h2>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Filter by department"
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Filter by location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button
                variant="secondary"
                onClick={() => setFilters({ department: '', location: '' })}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {jobs.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p>No job opportunities available.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {jobs.map((job) => (
            <Col md={6} key={job._id} className="mb-3">
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Badge bg="info">{job.department}</Badge>
                  <small className="text-muted">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </small>
                </Card.Header>
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Text>{job.description}</Card.Text>
                  <div className="mb-2">
                    <strong>Location:</strong> {job.location}
                  </div>
                  {job.salary && (
                    <div className="mb-2">
                      <strong>Salary:</strong> {job.salary}
                    </div>
                  )}
                  {job.requirements && (
                    <div className="mb-2">
                      <strong>Requirements:</strong> {job.requirements}
                    </div>
                  )}
                  <div className="mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      href={`mailto:${job.contactEmail}`}
                      className="me-2"
                    >
                      Contact: {job.contactEmail}
                    </Button>
                    {job.contactPhone && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        href={`tel:${job.contactPhone}`}
                      >
                        Call: {job.contactPhone}
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Jobs;
