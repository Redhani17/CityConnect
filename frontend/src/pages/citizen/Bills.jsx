import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Bills = () => {
  const { user } = useAuth();
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
      const response = await axios.post(
        `${API_URL}/bills/${selectedBill._id}/pay`
      );
      setMessage({ type: 'success', text: 'Payment successful (Mock)' });
      setShowModal(false);
      fetchBills();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Payment failed',
      });
    } finally {
      setPaymentLoading(false);
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
      <h2 className="mb-4">My Bills</h2>
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      {bills.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p>No bills found.</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Bill Type</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.billType}</td>
                    <td>₹{bill.amount}</td>
                    <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                    <td>{bill.period}</td>
                    <td>
                      <Badge bg={bill.status === 'Paid' ? 'success' : 'warning'}>
                        {bill.status}
                      </Badge>
                    </td>
                    <td>
                      {bill.status === 'Pending' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handlePay(bill)}
                        >
                          Pay Now
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBill && (
            <div>
              <p>
                <strong>Bill Type:</strong> {selectedBill.billType}
              </p>
              <p>
                <strong>Amount:</strong> ₹{selectedBill.amount}
              </p>
              <p>
                <strong>Period:</strong> {selectedBill.period}
              </p>
              <Alert variant="info" className="mt-3">
                This is a mock payment. No actual transaction will occur.
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmPayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Bills;
