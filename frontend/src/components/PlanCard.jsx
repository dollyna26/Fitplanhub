import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PlanCard = ({ plan, showTrainer = true, showSubscribe = false, isSubscribed = false, onSubscribe }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'fat-loss': 'danger',
      'muscle-gain': 'success',
      'beginner': 'info',
      'advanced': 'warning',
      'custom': 'secondary'
    };
    return colors[category] || 'secondary';
  };

  return (
    <Card className="h-100 shadow-sm hover-shadow transition-all">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="mb-1">{plan.title}</Card.Title>
            {showTrainer && plan.trainer && (
              <Card.Subtitle className="text-muted small mb-2">
                By {plan.trainer.name}
              </Card.Subtitle>
            )}
          </div>
          <Badge bg={getCategoryColor(plan.category)}>
            {plan.category}
          </Badge>
        </div>

        <Card.Text className="flex-grow-1 mb-3 text-muted small">
          {plan.description?.length > 100 
            ? `${plan.description.substring(0, 100)}...`
            : plan.description}
        </Card.Text>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="text-primary mb-0">${plan.price}</h5>
              <small className="text-muted">
                {plan.duration} {plan.durationUnit}
              </small>
            </div>
            <Badge bg="light" text="dark" className="px-3 py-2">
              {plan.difficulty}
            </Badge>
          </div>

          <div className="d-grid gap-2">
            <Link to={`/plan/${plan._id}`} className="w-100">
              <Button variant="outline-primary" size="sm" className="w-100">
                View Details
              </Button>
            </Link>
            
            {showSubscribe && !isSubscribed && onSubscribe && (
              <Button 
                variant="success" 
                size="sm" 
                className="w-100"
                onClick={() => onSubscribe(plan._id)}
              >
                Subscribe Now
              </Button>
            )}
            
            {isSubscribed && (
              <Badge bg="success" className="w-100 py-2">
                <i className="bi bi-check-circle me-2"></i>
                Subscribed
              </Badge>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

PlanCard.propTypes = {
  plan: PropTypes.object.isRequired,
  showTrainer: PropTypes.bool,
  showSubscribe: PropTypes.bool,
  isSubscribed: PropTypes.bool,
  onSubscribe: PropTypes.func
};

export default PlanCard;