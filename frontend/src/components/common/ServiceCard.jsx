import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ServiceCard = ({ title, icon, description, link }) => {
    return (
        <Card className="h-100 p-4 card-hover text-center border-0">
            <Card.Body className="d-flex flex-column align-items-center">
                <div
                    className="mb-4 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary"
                    style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
                >
                    {icon}
                </div>

                <Card.Title className="fw-bold mb-3 h5 text-dark">{title}</Card.Title>

                <Card.Text className="text-secondary small mb-4 flex-grow-1" style={{ maxWidth: '260px' }}>
                    {description}
                </Card.Text>

                <Link to={link} className="btn btn-link text-decoration-none fw-bold p-0 stretched-link">
                    Access Service <i className="bi bi-arrow-right ms-1"></i>
                </Link>
            </Card.Body>
        </Card>
    );
};

export default ServiceCard;
