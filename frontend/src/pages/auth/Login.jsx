import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/citizen');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <Container style={{ maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <div className="bg-white p-3 rounded shadow-sm d-inline-block mb-3 border">
            <i className="bi bi-bank2 fs-2 text-primary"></i>
          </div>
          <h2 className="fw-bold text-primary mb-1">{t('auth.login.title')}</h2>
          <p className="text-secondary small">{t('auth.login.subtitle')}</p>
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
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-secondary text-uppercase ls-1">{t('auth.login.email')}</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="bg-light"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Form.Label className="small fw-bold text-secondary text-uppercase ls-1 mb-0">{t('auth.login.password')}</Form.Label>
                  <a href="#" className="small text-decoration-none text-primary fw-semibold">{t('auth.login.forgot')}</a>
                </div>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                  className="bg-light"
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 mb-3 shadow-sm"
                disabled={loading}
              >
                {loading ? t('auth.login.loading') : t('auth.login.submit')}
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className="bg-light border-top p-3 text-center">
            <p className="small text-secondary mb-0">
              {t('auth.login.no_account')} <Link to="/register" className="fw-semibold text-primary text-decoration-none">{t('auth.login.register_link')}</Link>
            </p>
          </Card.Footer>
        </Card>

        <div className="text-center mt-4">
          <small className="text-muted d-block">&copy; {new Date().getFullYear()} CityConnect Government Portal</small>
          <div className="d-flex justify-content-center gap-3 mt-2">
            <a href="#" className="text-secondary small text-decoration-none">{t('footer.privacy')}</a>
            <a href="#" className="text-secondary small text-decoration-none">{t('footer.terms')}</a>
            <a href="#" className="text-secondary small text-decoration-none">{t('landing.help.ask')}</a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
