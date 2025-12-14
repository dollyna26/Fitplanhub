import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Button, Badge, 
  Alert, ListGroup, Modal, Form
} from 'react-bootstrap';
import { 
  ArrowLeft, StarFill, Star, People, 
  Clock, Calendar, Share, Bookmark,
  BookmarkFill, CheckCircle, Award
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const PlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  useEffect(() => {
    fetchPlanDetail();
  }, [id]);

  const fetchPlanDetail = async () => {
    try {
      const res = await axios.get(`/api/plans/${id}`);
      setPlan(res.data);
      setIsSubscribed(res.data.isSubscribed || false);
      setIsBookmarked(res.data.isBookmarked || false);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load plan details');
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await axios.post(`/api/plans/${id}/subscribe`);
      setIsSubscribed(true);
      toast.success('Successfully subscribed to plan!');
      setShowSubscribeModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      const res = await axios.post(`/api/plans/${id}/bookmark`);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Plan link copied to clipboard!');
  };

  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < Math.floor(rating) ? 
        <StarFill key={i} className="text-warning" size={16} /> : 
        <Star key={i} className="text-warning" size={16} />
    ));
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!plan) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Plan not found</Alert.Heading>
          <Button variant="outline-danger" onClick={() => navigate('/plans')}>
            Browse Plans
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Navigation */}
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none p-0">
          <ArrowLeft className="me-2" /> Back
        </Button>
        <div className="ms-auto d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={handleShare}>
            <Share />
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={handleBookmarkToggle}
          >
            {isBookmarked ? <BookmarkFill className="text-warning" /> : <Bookmark />}
          </Button>
        </div>
      </div>

      {/* Plan Header */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="p-4">
          {/* Plan Badges */}
          <div className="d-flex gap-2 mb-3">
            <Badge bg="info" className="px-3 py-2">
              {plan.category || 'Strength Training'}
            </Badge>
            <Badge bg={plan.difficulty === 'BEGINNER' ? 'success' : plan.difficulty === 'INTERMEDIATE' ? 'warning' : 'danger'} className="px-3 py-2">
              {plan.difficulty || 'INTERMEDIATE'}
            </Badge>
          </div>

          {/* Plan Title */}
          <h1 className="mb-3">{plan.title}</h1>
          
          {/* Plan Stats */}
          <div className="d-flex flex-wrap gap-4 mb-4">
            <div className="d-flex align-items-center text-muted">
              <Clock className="me-2" />
              <span>{plan.duration} days</span>
            </div>
            <div className="d-flex align-items-center text-muted">
              <People className="me-2" />
              <span>{plan.subscribers?.length || 0} subscribers</span>
            </div>
            <div className="d-flex align-items-center text-muted">
              <Calendar className="me-2" />
              <span>5 days/week</span>
            </div>
          </div>

          {/* Trainer Info */}
          <div className="d-flex align-items-center mb-4 p-3 bg-light rounded">
            <div 
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
              style={{ width: '50px', height: '50px', color: 'white' }}
            >
              {plan.trainer?.name?.charAt(0)?.toUpperCase() || 'T'}
            </div>
            <div>
              <h6 className="mb-0">By {plan.trainer?.name || 'trainer2'}</h6>
              <small className="text-muted">{plan.trainer?.email || 'trainer2@gmail.com'}</small>
            </div>
            <Button 
              variant="outline-primary" 
              size="sm"
              className="ms-auto"
              onClick={() => navigate(`/trainer/${plan.trainer?._id}`)}
            >
              View Profile
            </Button>
          </div>

          {/* Plan Description */}
          <div className="mb-4">
            <h5>About This Plan</h5>
            <p className="lead">{plan.description || 'Increase your strength by joining this comprehensive training program.'}</p>
          </div>

          {/* Full Content */}
          {plan.fullContent && (
            <Card className="border-start border-primary border-3">
              <Card.Body>
                <h5 className="mb-3">Full Content</h5>
                <p>{plan.fullContent}</p>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>

      {/* Pricing & Action Section */}
      <Row>
        <Col lg={8}>
          {/* What's Included */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">What's Included</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <CheckCircle className="text-success me-2" />
                  Full workout videos & guides
                </ListGroup.Item>
                <ListGroup.Item>
                  <CheckCircle className="text-success me-2" />
                  Daily workout schedules
                </ListGroup.Item>
                <ListGroup.Item>
                  <CheckCircle className="text-success me-2" />
                  Progress tracking
                </ListGroup.Item>
                <ListGroup.Item>
                  <CheckCircle className="text-success me-2" />
                  Email support
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Reviews */}
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Reviews</h5>
              {plan.rating ? (
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <h2 className="mb-0">{plan.rating}</h2>
                    <div>{renderStars(plan.rating)}</div>
                  </div>
                  <div>
                    <small className="text-muted">Based on {plan.reviews?.length || 0} reviews</small>
                  </div>
                </div>
              ) : (
                <Alert variant="info">
                  <Alert.Heading>No reviews yet</Alert.Heading>
                  <p>Be the first to review this plan!</p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Pricing Card */}
          <Card className="shadow-lg border-0 sticky-top" style={{ top: '20px' }}>
            <Card.Body className="p-4">
              <h4 className="mb-3">Subscribe to Plan</h4>
              
              {/* Price */}
              <div className="mb-4">
                <div className="d-flex align-items-baseline">
                  <span className="h2 fw-bold">${plan.price}</span>
                  <span className="text-muted ms-2">/month</span>
                </div>
                <small className="text-muted">Cancel anytime</small>
              </div>

              {/* Subscribe Button */}
              <Button 
                variant={isSubscribed ? "success" : "primary"}
                size="lg"
                className="w-100 mb-3"
                onClick={isSubscribed ? () => navigate('/dashboard/my-plans') : () => setShowSubscribeModal(true)}
              >
                {isSubscribed ? 'Go to My Plans' : 'Subscribe Now'}
              </Button>

              {/* Features */}
              <div className="text-center">
                <Badge bg="success" className="mb-3 px-3 py-2">
                  <Award className="me-1" />
                  7-day free trial
                </Badge>
              </div>

              {/* Quick Stats */}
              <ListGroup variant="flush" className="small">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Subscribers</span>
                  <span>{plan.subscribers?.length || 0}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Duration</span>
                  <span>{plan.duration} days</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="text-muted">Level</span>
                  <span>{plan.difficulty || 'Intermediate'}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Subscribe Modal */}
      <Modal show={showSubscribeModal} onHide={() => setShowSubscribeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <h4>{plan.title}</h4>
            <p className="text-muted">By {plan.trainer?.name || 'trainer2'}</p>
            <h2 className="text-primary">${plan.price}<small className="text-muted">/month</small></h2>
          </div>
          
          <div className="mb-4">
            <h6>You'll get access to:</h6>
            <ul className="mb-0">
              <li>Full workout program</li>
              <li>Exercise demonstrations</li>
              <li>Progress tracking</li>
              <li>Email support</li>
            </ul>
          </div>

          {!user && (
            <Alert variant="warning">
              You need to be logged in to subscribe to a plan.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubscribeModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubscribe}
            disabled={!user}
          >
            Confirm Subscription
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PlanDetail;