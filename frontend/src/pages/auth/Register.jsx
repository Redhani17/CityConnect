import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Name Validation (No numbers)
    if (/\d/.test(formData.name)) {
      return setError('Full Name should not contain numbers.');
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const localPart = formData.email.split('@')[0];
    if (!emailRegex.test(formData.email)) {
      return setError('Please enter a valid email address.');
    }
    if (/^\d+$/.test(localPart)) {
      return setError('Email username cannot be purely numeric.');
    }

    // 3. Password Validation
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    if (!passwordRegex.test(formData.password)) {
      return setError('Password must contain at least one letter, one digit, and one special character.');
    }

    setLoading(true);

    // If role is department, we default to 'Roads' to make the filtering work as per previous requirements
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      formData.role === 'department' ? 'Roads' : ''
    );
    setLoading(false);

    if (result.success) {
      navigate('/citizen');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <Container style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary mb-1">Create Account</h2>
          <p className="text-secondary small">Join thousands of citizens connected digitally.</p>
        </div>

        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4 p-md-5">
            {error && (
              <Alert variant="danger" className="d-flex align-items-center py-2 text-sm border-0 bg-danger bg-opacity-10 text-danger fw-semibold mb-4">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                  className="bg-light shadow-none"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="bg-light shadow-none"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="bg-light shadow-none"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">I am a</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="bg-light shadow-none"
                  required
                >
                  <option value="citizen">Citizen</option>
                  <option value="department">Department</option>
                </Form.Select>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-3 mb-3 shadow-sm fw-bold"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Account'}
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className="bg-light border-top p-3 text-center">
            <p className="small text-secondary mb-0">
              Already have an account? <Link to="/login" className="fw-semibold text-primary text-decoration-none">Sign In</Link>
            </p>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
};

export default Register;
