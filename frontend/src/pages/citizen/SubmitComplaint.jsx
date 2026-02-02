import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('location', formData.location);
      if (image) {
        formDataToSend.append('image', image);
      }

      await axios.post(
        `${API_URL}/complaints`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Complaint submitted successfully!');
      setTimeout(() => {
        navigate('/complaints');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: '1000px' }}>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/citizen">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/complaints">Complaints</Link></li>
          <li className="breadcrumb-item active">New Submission</li>
        </ol>
      </nav>

      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">File a Formal Grievance</h2>
        <p className="text-secondary small">Your submission will be assigned to the relevant municipal department for resolution.</p>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="bg-primary py-1 w-100"></div>
        <Card.Body className="p-4 p-md-5">
          {error && <Alert variant="danger" className="border-0 shadow-sm mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </Alert>}

          {success && <Alert variant="success" className="border-0 shadow-sm mb-4">
            <i className="bi bi-check-circle-fill me-2"></i> {success}
          </Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-secondary ls-1">Complaint Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Briefly state the issue (e.g., Streetlight failure in Block 4)"
                    className="bg-light py-3 border-light shadow-inner"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-secondary ls-1">Category</Form.Label>
                  <Form.Select
                    name="category"
                    className="bg-light py-3 border-light shadow-inner"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Roads">Roads & Infrastructure</option>
                    <option value="Water Supply">Water & Sanitation</option>
                    <option value="Electricity">Public Lighting/Electricity</option>
                    <option value="Waste Management">Solid Waste Management</option>
                    <option value="Parks & Recreation">Parks & Greenery</option>
                    <option value="Public Safety">Public Safety & Surveillance</option>
                    <option value="Other">Other Miscellaneous</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-secondary ls-1">Specific Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Street name, landmark, or zone"
                    className="bg-light py-3 border-light shadow-inner"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-secondary ls-1">Detailed Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="description"
                    placeholder="Provide as much detail as possible to help departments understand the issue better."
                    className="bg-light py-3 border-light shadow-inner"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-2">
                  <Form.Label className="small fw-bold text-uppercase text-secondary ls-1">Supporting Image (Optional)</Form.Label>
                  <div className="border border-dashed rounded-3 p-4 bg-light text-center">
                    <i className="bi bi-cloud-upload fs-2 text-primary mb-2 d-inline-block"></i>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="form-control-sm"
                    />
                    <div className="mt-2 small text-muted">Upload an image of the concern (Max 5MB)</div>
                  </div>
                </Form.Group>
              </Col>

              <Col md={12} className="pt-3 border-top mt-5">
                <div className="d-flex gap-3">
                  <Button
                    variant="primary"
                    type="submit"
                    className="px-5 py-3 fw-bold shadow-sm"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Lodge Official Complaint'}
                  </Button>
                  <Button
                    as={Link}
                    to="/complaints"
                    variant="light"
                    className="px-4 py-3 text-secondary border fw-medium"
                  >
                    Cancel
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SubmitComplaint;
