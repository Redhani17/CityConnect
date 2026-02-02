import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(`${API_URL}/feedback/all`);
            setFeedbacks(response.data.data.feedback);
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRatingStars = (rating) => {
        return (
            <div className="text-warning">
                {[...Array(5)].map((_, i) => (
                    <i key={i} className={`bi bi-star${i < rating ? '-fill' : ''} me-1`}></i>
                ))}
            </div>
        );
    };

    if (loading) return (
        <Container className="py-5 text-center">
            <div className="spinner-border text-primary"></div>
            <p className="mt-3 text-secondary">Loading feedback logs...</p>
        </Container>
    );

    return (
        <Container className="py-4" style={{ maxWidth: '1200px' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
            >
                <h2 className="fw-bold text-dark mb-1">Civic Feedback Console</h2>
                <p className="text-secondary small text-uppercase ls-1">Direct feedback from citizens about their experience.</p>
            </motion.div>

            <Card className="border-0 shadow-sm overflow-hidden">
                <Card.Header className="bg-white py-3 border-bottom">
                    <h6 className="mb-0 fw-bold d-flex align-items-center">
                        <i className="bi bi-chat-heart-fill me-2 text-primary"></i>
                        Feedback Submissions
                        <Badge bg="light" text="dark" className="ms-auto border">{feedbacks.length} TOTAL</Badge>
                    </h6>
                </Card.Header>
                <Table responsive hover className="m-0 align-middle">
                    <thead className="bg-light text-secondary small text-uppercase ls-1">
                        <tr>
                            <th className="ps-4">Citizen</th>
                            <th>Rating</th>
                            <th style={{ minWidth: '300px' }}>Suggestion / Comment</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-muted">No feedback received yet.</td>
                            </tr>
                        ) : (
                            feedbacks.map((f, idx) => (
                                <tr key={idx}>
                                    <td className="ps-4">
                                        <div className="fw-bold text-dark">{f.userId?.name || 'Anonymous'}</div>
                                        <div className="small text-muted">{f.userId?.email || 'N/A'}</div>
                                    </td>
                                    <td>{getRatingStars(f.rating)}</td>
                                    <td className="text-dark small lh-sm py-3">
                                        <div style={{ maxWidth: '500px' }}>{f.suggestion}</div>
                                    </td>
                                    <td className="small text-muted font-mono">
                                        {new Date(f.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>
        </Container>
    );
};

export default AdminFeedback;
