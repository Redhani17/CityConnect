import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Bills = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get(`${API_URL}/bills/my-bills`);
      setBills(response.data.data.bills);
    } catch (error) {
      console.error('Failed to fetch bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const confirmPayment = async () => {
    setPaymentLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`${API_URL}/bills/${selectedBill._id}/pay`);
      setMessage({ type: 'success', text: 'APPROVED: Transaction processed successfully.' });
      setShowModal(false);
      fetchBills();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Transaction Declined',
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    if (type.toLowerCase().includes('water')) return 'bi-droplet-half';
    if (type.toLowerCase().includes('electric')) return 'bi-lightning-charge';
    if (type.toLowerCase().includes('tax')) return 'bi-house';
    return 'bi-receipt';
  }

  if (loading) return <div className="p-5 text-center font-mono text-muted">SYNCING LEDGERS...</div>;

  return (
    <Container className="py-5" style={{ maxWidth: '1000px' }}>

      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center border px-3 py-1 rounded-pill mb-3 bg-zinc-50">
          <span className="dot bg-success rounded-circle me-2" style={{ width: '8px', height: '8px' }}></span>
          <small className="font-mono text-uppercase fw-bold">{t('bills.secure_gateway')}</small>
        </div>
        <h2 className="display-5 fw-bold tracking-tight">{t('bills.title')}</h2>
        <p className="text-secondary">{t('bills.subtitle')}</p>
      </div>

      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })} className="shadow-sm border-0 mb-4">
          <div className="d-flex align-items-center">
            <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-3 fs-4`}></i>
            <div>
              <strong>{message.type === 'success' ? 'Payment Successful' : 'Error'}</strong><br />
              <span className="small">{message.text}</span>
            </div>
          </div>
        </Alert>
      )}

      {bills.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-dashed">
          <i className="bi bi-wallet2 fs-1 text-muted opacity-50 mb-3"></i>
          <p className="text-muted">{t('bills.no_invoices')}</p>
        </div>
      ) : (
        <Row className="g-4">
          {bills.map((bill, idx) => (
            <Col md={12} key={bill._id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border rounded-4 p-4 shadow-sm hover-lift transition-all d-flex flex-column flex-md-row align-items-center justify-content-between gap-4"
              >
                {/* LEFT: INFO */}
                <div className="d-flex align-items-center gap-4 w-100">
                  <div className={`p-3 rounded-circle bg-light d-flex align-items-center justify-content-center text-dark border`} style={{ width: '60px', height: '60px' }}>
                    <i className={`bi ${getTypeIcon(bill.billType)} fs-4`}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">{bill.billType}</h5>
                    <div className="font-mono small text-muted text-uppercase mb-1">{t('bills.period')}: {bill.period}</div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-light text-dark border fw-normal">{t('bills.due')}: {new Date(bill.dueDate).toLocaleDateString()}</span>
                      {bill.status === 'Paid' && <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25"><i className="bi bi-check2"></i> {t('bills.paid')}</span>}
                    </div>
                  </div>
                </div>

                {/* RIGHT: ACTION */}
                <div className="text-end d-flex flex-column flex-md-row align-items-center gap-4 min-w-max">
                  <div className="text-end">
                    <small className="text-muted d-block text-uppercase font-mono" style={{ fontSize: '0.65rem' }}>{t('bills.amount')}</small>
                    <div className="fs-3 fw-bold font-mono tracking-tight">₹{bill.amount}</div>
                  </div>

                  {bill.status === 'Pending' ? (
                    <Button
                      variant="dark"
                      className="px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2"
                      onClick={() => handlePay(bill)}
                    >
                      {t('bills.pay_now')} <i className="bi bi-arrow-right"></i>
                    </Button>
                  ) : (
                    <Button variant="outline-secondary" disabled className="px-4 py-2 rounded-pill opacity-50">
                      {t('bills.receipt')}
                    </Button>
                  )}
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}

      {/* PAYMENT MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="rounded-4 border-0 shadow-lg">
        <div className="p-4">
          <div className="text-center mb-4">
            <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 d-inline-block mb-3">
              <i className="bi bi-shield-lock-fill fs-3"></i>
            </div>
            <h4 className="fw-bold">{t('bills.secure_payment')}</h4>
            <p className="text-muted small">{t('bills.verify_txn')}</p>
          </div>

          {selectedBill && (
            <div className="bg-light rounded-3 p-3 mb-4 font-mono small">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">{t('bills.service')}</span>
                <span className="fw-bold">{selectedBill.billType}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">BILL_ID</span>
                <span>#{selectedBill._id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="border-top my-2"></div>
              <div className="d-flex justify-content-between fs-6">
                <span className="fw-bold">TOTAL</span>
                <span className="fw-bold text-black">₹{selectedBill.amount}</span>
              </div>
            </div>
          )}

          <div className="d-grid gap-2">
            <Button variant="primary" size="lg" onClick={confirmPayment} disabled={paymentLoading} className="fw-bold">
              {paymentLoading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <>{t('bills.confirm_pay', { amount: selectedBill?.amount })}</>
              )}
            </Button>
            <Button variant="link" className="text-muted text-decoration-none" onClick={() => setShowModal(false)}>{t('navbar.logout').toLowerCase() === 'logout' ? 'Cancel Transaction' : 'Cancel Transaction'}</Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default Bills;
