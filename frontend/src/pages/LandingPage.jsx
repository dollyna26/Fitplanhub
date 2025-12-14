import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, InputGroup,Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { Container } from "react-bootstrap";


import { motion } from 'framer-motion';
import './Landing.css';
const LandingPage = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const { isAuthenticated, user } = useAuth();

  const categories = [
    { id: 'all', name: 'All Categories', icon: 'grid' },
    { id: 'fat-loss', name: 'Fat Loss', icon: 'fire' },
    { id: 'muscle-gain', name: 'Muscle Gain', icon: 'dumbbell' },
    { id: 'beginner', name: 'Beginner', icon: 'person' },
    { id: 'advanced', name: 'Advanced', icon: 'trophy' },
    { id: 'yoga', name: 'Yoga', icon: 'flower1' },
    { id: 'cardio', name: 'Cardio', icon: 'heart-pulse' }
  ];

  const priceRanges = [
    { id: 'all', name: 'Any Price', range: 'All' },
    { id: '0-100', name: 'Under $100', range: '0-100' },
    { id: '100-300', name: '$100 - $300', range: '100-300' },
    { id: '300-500', name: '$300 - $500', range: '300-500' },
    { id: '500+', name: '$500+', range: '500+' }
  ];

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    filterPlans();
  }, [plans, searchTerm, selectedCategory, selectedPrice]);

  const fetchPlans = async () => {
    try {
      const res = await axios.get('/api/plans');
      setPlans(res.data);
      setFilteredPlans(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      // Mock data for demo
      const mockPlans = [
        {
          _id: '1',
          title: 'Fat Loss Beginner Plan',
          description: 'Perfect for beginners looking to lose weight with guided workouts',
          price: 500,
          duration: 30,
          durationUnit: 'days',
          category: 'fat-loss',
          difficulty: 'beginner',
          trainer: { name: 'John Doe', email: 'john@example.com' }
        },
        {
          _id: '2',
          title: 'Zumba Fitness Program',
          description: 'High-energy dance workouts for cardio and fun',
          price: 600,
          duration: 5,
          durationUnit: 'weeks',
          category: 'cardio',
          difficulty: 'intermediate',
          trainer: { name: 'fitnesswarrior', email: 'warrior@example.com' }
        },
        {
          _id: '3',
          title: 'Muscle Building Intensive',
          description: 'Advanced strength training for muscle growth',
          price: 800,
          duration: 12,
          durationUnit: 'weeks',
          category: 'muscle-gain',
          difficulty: 'advanced',
          trainer: { name: 'Alex Strong', email: 'alex@example.com' }
        },
        {
          _id: '4',
          title: 'Yoga for Beginners',
          description: 'Gentle yoga sessions for flexibility and stress relief',
          price: 300,
          duration: 30,
          durationUnit: 'days',
          category: 'yoga',
          difficulty: 'beginner',
          trainer: { name: 'Yoga Master', email: 'yoga@example.com' }
        },
        {
          _id: '5',
          title: 'HIIT Fat Burner',
          description: 'High Intensity Interval Training for maximum fat burn',
          price: 450,
          duration: 8,
          durationUnit: 'weeks',
          category: 'fat-loss',
          difficulty: 'intermediate',
          trainer: { name: 'HIIT Queen', email: 'hiit@example.com' }
        },
        {
          _id: '6',
          title: 'Marathon Training',
          description: 'Complete program for running your first marathon',
          price: 750,
          duration: 16,
          durationUnit: 'weeks',
          category: 'cardio',
          difficulty: 'advanced',
          trainer: { name: 'Runner Pro', email: 'run@example.com' }
        }
      ];
      setPlans(mockPlans);
      setFilteredPlans(mockPlans);
      setLoading(false);
    }
  };

  const filterPlans = () => {
    let filtered = [...plans];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.trainer?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plan => plan.category === selectedCategory);
    }

    // Price filter
    if (selectedPrice !== 'all') {
      const [min, max] = selectedPrice.split('-').map(Number);
      if (selectedPrice === '500+') {
        filtered = filtered.filter(plan => plan.price >= 500);
      } else if (selectedPrice === '0-100') {
        filtered = filtered.filter(plan => plan.price <= 100);
      } else {
        filtered = filtered.filter(plan => plan.price >= min && plan.price <= max);
      }
    }

    setFilteredPlans(filtered);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'fat-loss': 'fire',
      'muscle-gain': 'dumbbell',
      'beginner': 'person',
      'advanced': 'trophy',
      'yoga': 'flower1',
      'cardio': 'heart-pulse',
      'custom': 'stars'
    };
    return icons[category] || 'heart';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'fat-loss': 'danger',
      'muscle-gain': 'warning',
      'beginner': 'primary',
      'advanced': 'dark',
      'yoga': 'success',
      'cardio': 'info',
      'custom': 'secondary'
    };
    return colors[category] || 'secondary';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-content"
            >
              <h1 className="hero-title">
                Find Your <span className="text-warning">Perfect</span> Fitness Plan
              </h1>
              <p className="hero-subtitle">
                Join thousands of users achieving their fitness goals with certified trainers
              </p>
              
              {/* Search Bar */}
              <div className="search-container mt-4">
                <InputGroup className="search-bar">
                  <InputGroup.Text className="search-icon">
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search plans, trainers, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <Button variant="primary" className="search-button">
                    <i className="bi bi-arrow-right"></i>
                  </Button>
                </InputGroup>
              </div>

              {/* Stats */}
              <Row className="stats-row mt-5">
                <Col md={4} className="text-center">
                  <h3 className="stat-number">500+</h3>
                  <p className="stat-label">Certified Trainers</p>
                </Col>
                <Col md={4} className="text-center">
                  <h3 className="stat-number">10,000+</h3>
                  <p className="stat-label">Active Users</p>
                </Col>
                <Col md={4} className="text-center">
                  <h3 className="stat-number">95%</h3>
                  <p className="stat-label">Success Rate</p>
                </Col>
              </Row>
            </motion.div>
          </Container>
        </div>
      </section>

      {/* Categories Section */}
      <Container className="categories-section py-5">
        <h2 className="section-title text-center mb-4">Browse by Category</h2>
        <Row className="g-3 mb-5">
          {categories.map((category) => (
            <Col key={category.id} xs={6} sm={4} md={3} lg={2}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedCategory === category.id ? 'primary' : 'outline-primary'}
                  className={`category-btn w-100 py-3 ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <i className={`bi bi-${category.icon} mb-2`} style={{ fontSize: '1.5rem' }}></i>
                  <div className="category-name">{category.name}</div>
                </Button>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Price Filter */}
        <h3 className="section-subtitle mb-3">Filter by Price</h3>
        <div className="price-filter mb-5">
          <div className="d-flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <Button
                key={range.id}
                variant={selectedPrice === range.id ? 'warning' : 'outline-secondary'}
                size="sm"
                onClick={() => setSelectedPrice(range.id)}
                className="px-3"
              >
                {range.name}
              </Button>
            ))}
          </div>
        </div>
      </Container>

      {/* Plans Grid */}
      <Container className="plans-section py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">
            {selectedCategory === 'all' ? 'All Fitness Plans' : `${selectedCategory.replace('-', ' ')} Plans`}
            <Badge bg="primary" className="ms-2">{filteredPlans.length}</Badge>
          </h2>
          <Button variant="outline-primary">
            <i className="bi bi-filter me-2"></i>
            Sort by: Popular
          </Button>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="text-center py-5">
            <div className="empty-state-icon mb-4">
              <i className="bi bi-search" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
            </div>
            <h3 className="mb-3">No plans found</h3>
            <p className="text-muted mb-4">Try adjusting your search or filter criteria</p>
            <Button 
              variant="primary" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedPrice('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <Row>
            {filteredPlans.map((plan, index) => (
              <Col key={plan._id} lg={4} md={6} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="plan-card h-100 border-0 shadow-lg">
                    {/* Plan Header */}
                    <div className="plan-header position-relative">
                      <div className="plan-category">
                        <Badge bg={getCategoryColor(plan.category)} className="px-3 py-2">
                          <i className={`bi bi-${getCategoryIcon(plan.category)} me-2`}></i>
                          {plan.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="plan-difficulty">
                        <Badge bg={plan.difficulty === 'beginner' ? 'success' : plan.difficulty === 'intermediate' ? 'warning' : 'danger'}>
                          {plan.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <Card.Body className="p-4">
                      <Card.Title className="plan-title mb-3">{plan.title}</Card.Title>
                      
                      <div className="trainer-info d-flex align-items-center mb-3">
                        <div className="trainer-avatar me-3">
                          <i className="bi bi-person-circle text-primary"></i>
                        </div>
                        <div>
                          <div className="text-muted small">By</div>
                          <div className="trainer-name fw-semibold">{plan.trainer?.name}</div>
                        </div>
                      </div>

                      <Card.Text className="plan-description text-muted mb-4">
                        {plan.description}
                      </Card.Text>

                      <div className="plan-stats d-flex justify-content-between mb-4">
                        <div className="stat-item text-center">
                          <div className="stat-value text-primary fw-bold">${plan.price}</div>
                          <div className="stat-label small text-muted">One-time</div>
                        </div>
                        <div className="stat-item text-center">
                          <div className="stat-value fw-bold">{plan.duration}</div>
                          <div className="stat-label small text-muted">{plan.durationUnit}</div>
                        </div>
                        <div className="stat-item text-center">
                          <div className="stat-value fw-bold">
                            <i className="bi bi-star-fill text-warning"></i>
                            {((Math.random() * 2) + 3).toFixed(1)}
                          </div>
                          <div className="stat-label small text-muted">Rating</div>
                        </div>
                      </div>

                      <div className="plan-actions">
                        <Link to={isAuthenticated ? `/plan/${plan._id}` : '/login'} className="w-100">
                          <Button variant="primary" className="w-100 py-3 fw-bold">
                            <i className="bi bi-eye me-2"></i>
                            {isAuthenticated ? 'View Details' : 'Login to View'}
                          </Button>
                        </Link>
                        {isAuthenticated && !user?.isTrainer && (
                          <Button 
                            variant="outline-success" 
                            className="w-100 mt-2 py-2"
                            onClick={() => {
                              // Handle quick subscribe
                              toast.info(`Quick subscribe to ${plan.title} coming soon!`);
                            }}
                          >
                            <i className="bi bi-cart-plus me-2"></i>
                            Quick Subscribe
                          </Button>
                        )}
                      </div>
                    </Card.Body>

                    <Card.Footer className="bg-transparent border-0 pt-0">
                      <div className="plan-features">
                        <div className="d-flex justify-content-around text-center">
                          <div className="feature-item">
                            <i className="bi bi-camera-video text-primary"></i>
                            <small>Workout Videos</small>
                          </div>
                          <div className="feature-item">
                            <i className="bi bi-egg-fried text-warning"></i>
                            <small>Meal Plans</small>
                          </div>
                          <div className="feature-item">
                            <i className="bi bi-graph-up text-success"></i>
                            <small>Progress Tracking</small>
                          </div>
                        </div>
                      </div>
                    </Card.Footer>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <Container>
          <div className="cta-content text-center">
            <h2 className="cta-title mb-4">
              Ready to Transform Your Fitness Journey?
            </h2>
            <p className="cta-subtitle mb-4">
              Join thousands of users who have transformed their lives with personalized fitness plans
            </p>
            <div className="cta-buttons">
              {!isAuthenticated ? (
                <>
                  <Button variant="primary" size="lg" as={Link} to="/register" className="px-5 py-3 me-3">
                    <i className="bi bi-person-plus me-2"></i>
                    Get Started Free
                  </Button>
                  <Button variant="outline-light" size="lg" as={Link} to="/login" className="px-5 py-3">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Button>
                </>
              ) : user?.isTrainer ? (
                <Button variant="warning" size="lg" as={Link} to="/dashboard" className="px-5 py-3">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Go to Dashboard
                </Button>
              ) : (
                <Button variant="success" size="lg" as={Link} to="/feed" className="px-5 py-3">
                  <i className="bi bi-card-checklist me-2"></i>
                  View Your Feed
                </Button>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;

