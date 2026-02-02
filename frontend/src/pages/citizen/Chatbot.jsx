import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I am your CityConnect AI Assistant. I can help with complaints, bills, or general queries. Type below!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchSuggestions();
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/chatbot/suggestions`);
      setSuggestions(response.data.data.suggestions);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chatbot/chat`, {
        message: input,
      });
      const botMessage = {
        type: 'bot',
        text: response.data.data.message,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        text: 'System Error: Unable to process request. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <Container className="py-5" style={{ maxWidth: '900px' }}>

      <div className="text-center mb-4">
        <div className="mx-auto rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-3 text-primary animate-pulse" style={{ width: '64px', height: '64px' }}>
          <i className="bi bi-robot fs-2"></i>
        </div>
        <h2 className="fw-bold display-6">AI City Assistant</h2>
        <p className="text-muted">Automated Support System v2.1</p>
      </div>

      <div className="bg-white rounded-4 shadow-lg border overflow-hidden d-flex flex-column" style={{ height: '70vh' }}>

        {/* CHAT WINDOW */}
        <div className="flex-grow-1 p-4 overflow-auto bg-zinc-50" style={{ backgroundColor: '#f8fafc' }}>
          {messages.map((msg, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={index}
              className={`d-flex mb-3 ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              {msg.type === 'bot' && (
                <div className="me-2 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px' }}>
                  <i className="bi bi-robot small"></i>
                </div>
              )}

              <div className={`p-3 rounded-4 shadow-sm ${msg.type === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-dark border rounded-tl-none'}`} style={{ maxWidth: '80%' }}>
                {msg.text}
              </div>

              {msg.type === 'user' && (
                <div className="ms-2 rounded-circle bg-dark text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px' }}>
                  <i className="bi bi-person small"></i>
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="d-flex align-items-center gap-2 text-muted font-mono small ms-5">
              <span className="spinner-border spinner-border-sm"></span> Processing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-white border-top">

          {/* SUGGESTIONS */}
          {suggestions.length > 0 && (
            <div className="mb-3 d-flex flex-wrap gap-2">
              {suggestions.map((s, idx) => (
                <button key={idx} onClick={() => handleSuggestionClick(s)} className="btn btn-sm btn-outline-secondary rounded-pill font-mono" style={{ fontSize: '0.75rem' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <Form onSubmit={handleSend} className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Ask about payments, schedules, or services..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="rounded-pill py-3 px-4 border-light bg-light shadow-inner"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
            />
            <Button type="submit" variant="primary" className="rounded-circle d-flex align-items-center justify-content-center shadow-md" style={{ width: '54px', height: '54px' }} disabled={loading || !input.trim()}>
              <i className="bi bi-send-fill"></i>
            </Button>
          </Form>
        </div>

      </div>

    </Container>
  );
};

export default Chatbot;
