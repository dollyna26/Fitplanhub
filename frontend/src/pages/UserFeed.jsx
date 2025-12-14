import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, Tab, Nav ,Container,ProgressBar,Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './UserFeed.css';
import { useAuth } from "../context/AuthContext.jsx";

const UserFeed = () => {
  const [feed, setFeed] = useState({
    followedPlans: [],
    subscribedPlans: [],
    followingCount: 0,
    stats: {
      totalWorkouts: 0,
      caloriesBurned: 0,
      streak: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('followed');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      // Mock data for demonstration
      const mockFeed = {
        followedPlans: [
          {
            _id: '1',
            title: 'Fat Loss Beginner Plan',
            description: 'A beginner-friendly fat loss plan designed to help you lose weight safely and effectively.',
            price: 500,
            duration: 30,
            durationUnit: 'days',
            category: 'fat-loss',
            difficulty: 'beginner',
            isSubscribed: true,
            subscribers: 125,
            trainer: { 
              _id: '101',
              name: 'John Doe',
              email: 'john@example.com',
              bio: 'Certified personal trainer with 10+ years experience'
            },
            createdAt: '2024-01-15'
          },
          {
            _id: '2',
            title: 'Muscle Building Intensive',
            description: 'Advanced strength training program for serious muscle growth.',
            price: 800,
            duration: 12,
            durationUnit: 'weeks',
            category: 'muscle-gain',
            difficulty: 'advanced',
            isSubscribed: false,
            subscribers: 89,
            trainer: { 
              _id: '102',
              name: 'Alex Strong',
              email: 'alex@example.com'
            },
            createdAt: '2024-02-01'
          }
        ],
        subscribedPlans: [
          {
            _id: '1',
            title: 'Fat Loss Beginner Plan',
            description: 'A beginner-friendly fat loss plan designed to help you lose weight safely and effectively.',
            price: 500,
            duration: 30,
            durationUnit: 'days',
            category: 'fat-loss',
            difficulty: 'beginner',
            trainer: { 
              _id: '101',
              name: 'John Doe',
              email: 'john@example.com'
            }
          }
        ],
        followingCount: 1,
        stats: {
          totalWorkouts: 45,
          caloriesBurned: 35600,
          streak: 14
        }
      };
      
      setFeed(mockFeed);
      setLoading(false);
      
      // Uncomment for real API call
      // const res = await axios.get('/api/users/feed');
      // setFeed({
      //   ...res.data,
      //   stats: {
      //     totalWorkouts: Math.floor(Math.random() * 100) + 50,
      //     caloriesBurned: Math.floor(Math.random() * 50000) + 10000,
      //     streak: Math.floor(Math.random() * 30) + 1
      //   }
      // });
      // setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load feed');
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId, planTitle) => {
    try {
      await axios.post(`/api/plans/${planId}/subscribe`);
      toast.success(`🎉 Successfully subscribed to "${planTitle}"!`);
      fetchFeed();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'fat-loss': 'fire',
      'muscle-gain': 'dumbbell',
      'beginner': 'person',
      'advanced': 'trophy',
      'custom': 'stars'
    };
    return icons[category] || 'heart';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'success',
      'intermediate': 'warning',
      'advanced': 'danger'
    };
    return colors[difficulty] || 'secondary';
  };

  const filteredPlans = () => {
    const plans = activeTab === 'followed' ? feed.followedPlans : feed.subscribedPlans;
    
    return plans.filter(plan => {
      const matchesSearch = searchQuery === '' || 
        plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.trainer?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filter === 'all' || plan.category === filter || 
        (filter === 'subscribed' && plan.isSubscribed);
      
      return matchesSearch && matchesFilter;
    });
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your personalized feed...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="user-feed-container">
      {/* Hero Header */}
      <div className="feed-hero">
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content"
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h1 className="display-6 fw-bold text-white mb-2">
                  Your <span className="text-warning">Personalized</span> Fitness Hub
                </h1>
                <p className="lead text-light mb-0">
                  Following {feed.followingCount} trainers • {feed.subscribedPlans.length} subscribed plans
                </p>
              </div>
              <div className="text-end">
                <div className="streak-badge bg-warning text-dark px-3 py-2 rounded-pill d-inline-flex align-items-center">
                  <i className="bi bi-fire me-2"></i>
                  <span className="fw-bold">{feed.stats.streak} Day Streak!</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <Row className="g-4 mb-4">
              <Col md={4}>
                <Card className="stat-card border-0 shadow">
                  <Card.Body className="text-center">
                    <div className="stat-icon bg-primary-gradient mb-3">
                      <i className="bi bi-people text-white"></i>
                    </div>
                    <h3 className="fw-bold">{feed.followingCount}</h3>
                    <p className="text-muted mb-0">Trainers Following</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className="stat-card border-0 shadow">
                  <Card.Body className="text-center">
                    <div className="stat-icon bg-warning-gradient mb-3">
                      <i className="bi bi-card-checklist text-white"></i>
                    </div>
                    <h3 className="fw-bold">{feed.subscribedPlans.length}</h3>
                    <p className="text-muted mb-0">Active Subscriptions</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className="stat-card border-0 shadow">
                  <Card.Body className="text-center">
                    <div className="stat-icon bg-success-gradient mb-3">
                      <i className="bi bi-lightning-charge text-white"></i>
                    </div>
                    <h3 className="fw-bold">{feed.stats.streak}</h3>
                    <p className="text-muted mb-0">Day Streak</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </div>

      <Container className="py-5">
        {/* Search and Filter Bar */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-3">
            <Row className="align-items-center">
              <Col md={4} className="mb-3 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Search plans or trainers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </Col>
              
              <Col md={6} className="mb-3 mb-md-0">
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant={filter === 'all' ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All Plans
                  </Button>
                  <Button
                    variant={filter === 'fat-loss' ? 'danger' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setFilter('fat-loss')}
                  >
                    <i className="bi bi-fire me-1"></i>
                    Fat Loss
                  </Button>
                  <Button
                    variant={filter === 'muscle-gain' ? 'warning' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setFilter('muscle-gain')}
                  >
                    <i className="bi bi-dumbbell me-1"></i>
                    Muscle Gain
                  </Button>
                  <Button
                    variant={filter === 'beginner' ? 'success' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setFilter('beginner')}
                  >
                    <i className="bi bi-person me-1"></i>
                    Beginner
                  </Button>
                </div>
              </Col>
              
              <Col md={2} className="text-md-end">
                <Button 
                  variant="primary" 
                  as={Link} 
                  to="/"
                  className="w-100"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Browse More
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Main Content Tabs */}
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Card className="border-0 shadow">
            <Card.Header className="bg-white border-0">
              <Nav variant="pills" className="nav-pills-custom">
                <Nav.Item>
                  <Nav.Link eventKey="followed" className="d-flex align-items-center">
                    <i className="bi bi-person-heart me-2"></i>
                    Plans from Followed Trainers
                    <Badge bg="primary" className="ms-2">{feed.followedPlans.length}</Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="subscribed" className="d-flex align-items-center">
                    <i className="bi bi-star me-2"></i>
                    My Subscriptions
                    <Badge bg="success" className="ms-2">{feed.subscribedPlans.length}</Badge>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            
            <Card.Body className="p-4">
              <Tab.Content>
                <Tab.Pane eventKey="followed">
                  <AnimatePresence>
                    {filteredPlans().length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Alert variant="info" className="text-center border-0 shadow-sm">
                          <div className="py-5">
                            <div className="empty-state-icon mb-3">
                              <i className="bi bi-person-plus" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h4 className="mb-3">No plans from followed trainers</h4>
                            <p className="text-muted mb-4">
                              Follow some amazing trainers to see their fitness plans here!
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                              <Button 
                                variant="primary" 
                                as={Link} 
                                to="/"
                                size="lg"
                              >
                                <i className="bi bi-compass me-2"></i>
                                Discover Trainers
                              </Button>
                              <Button 
                                variant="outline-primary" 
                                as={Link} 
                                to="/trainers"
                                size="lg"
                              >
                                <i className="bi bi-award me-2"></i>
                                Top Trainers
                              </Button>
                            </div>
                          </div>
                        </Alert>
                      </motion.div>
                    ) : (
                      <Row>
                        {filteredPlans().map((plan, index) => (
                          <Col key={plan._id} lg={4} md={6} className="mb-4">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="motion-card"
                            >
                              <Card className="h-100 plan-card border-0 shadow-sm">
                                <Card.Body>
                                  {/* Plan Header */}
                                  <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                      <Badge 
                                        bg={getDifficultyColor(plan.difficulty)} 
                                        className="mb-2"
                                      >
                                        {plan.difficulty}
                                      </Badge>
                                      <h5 className="fw-bold mb-1">{plan.title}</h5>
                                      <div className="d-flex align-items-center">
                                        <div className="avatar-sm me-2">
                                          <i className="bi bi-person-circle text-primary"></i>
                                        </div>
                                        <div>
                                          <small className="text-muted">by</small>
                                          <Link 
                                            to={`/trainer/${plan.trainer?._id}`}
                                            className="text-decoration-none fw-medium ms-1"
                                          >
                                            {plan.trainer?.name}
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="category-icon">
                                      <i className={`bi bi-${getCategoryIcon(plan.category)} text-primary`}></i>
                                    </div>
                                  </div>

                                  {/* Category Badges */}
                                  <div className="mb-3">
                                    <Badge bg="danger" className="me-2">
                                      <i className="bi bi-fire me-1"></i>
                                      FAT-LOSS
                                    </Badge>
                                    <Badge bg="secondary">BEGINNER</Badge>
                                  </div>

                                  {/* Plan Description */}
                                  <p className="text-muted mb-4">
                                    {plan.description}
                                  </p>

                                  {/* Plan Stats */}
                                  <div className="plan-stats mb-4">
                                    <div className="d-flex justify-content-between small mb-2">
                                      <span className="text-muted">
                                        <i className="bi bi-calendar me-1"></i>
                                        Duration
                                      </span>
                                      <span className="fw-semibold">
                                        {plan.duration} {plan.durationUnit}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between small mb-2">
                                      <span className="text-muted">
                                        <i className="bi bi-people me-1"></i>
                                        Subscribers
                                      </span>
                                      <span className="fw-semibold">
                                        {plan.subscribers || 0}
                                      </span>
                                    </div>
                                    <div className="d-flex justify-content-between small">
                                      <span className="text-muted">
                                        <i className="bi bi-bar-chart me-1"></i>
                                        Rating
                                      </span>
                                      <span className="fw-semibold">
                                        {((Math.random() * 2) + 3).toFixed(1)} ★
                                      </span>
                                    </div>
                                  </div>

                                  {/* Price and Action */}
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <h4 className="text-primary fw-bold mb-0">${plan.price}</h4>
                                      <small className="text-muted">one-time payment</small>
                                    </div>
                                    <div>
                                      {plan.isSubscribed ? (
                                        <Badge bg="success" className="px-3 py-2">
                                          <i className="bi bi-check-circle me-1"></i>
                                          Subscribed
                                        </Badge>
                                      ) : (
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handleSubscribe(plan._id, plan.title)}
                                        >
                                          <i className="bi bi-cart-plus me-1"></i>
                                          Subscribe
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </Card.Body>
                                
                                <Card.Footer className="bg-transparent border-0 pt-0">
                                  <Link 
                                    to={`/plan/${plan._id}`}
                                    className="text-decoration-none text-primary small fw-medium d-flex align-items-center"
                                  >
                                    View Full Details <i className="bi bi-arrow-right ms-2"></i>
                                  </Link>
                                </Card.Footer>
                              </Card>
                            </motion.div>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </AnimatePresence>
                </Tab.Pane>

                <Tab.Pane eventKey="subscribed">
                  <AnimatePresence>
                    {filteredPlans().length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Alert variant="info" className="text-center border-0 shadow-sm">
                          <div className="py-5">
                            <div className="empty-state-icon mb-3">
                              <i className="bi bi-stars" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h4 className="mb-3">No subscribed plans yet</h4>
                            <p className="text-muted mb-4">
                              Subscribe to amazing fitness plans to access exclusive content and workouts!
                            </p>
                            <Button 
                              variant="primary" 
                              as={Link} 
                              to="/"
                              size="lg"
                              className="px-5"
                            >
                              <i className="bi bi-compass me-2"></i>
                              Browse All Plans
                            </Button>
                          </div>
                        </Alert>
                      </motion.div>
                    ) : (
                      <>
                        {/* Progress Overview */}
                        <Card className="border-0 bg-light mb-4">
                          <Card.Body>
                            <h6 className="fw-bold mb-3">
                              <i className="bi bi-graph-up me-2 text-primary"></i>
                              Your Progress Overview
                            </h6>
                            <Row>
                              <Col md={4} className="mb-3">
                                <div className="progress-item">
                                  <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">Workouts Completed</small>
                                    <small className="fw-bold">{feed.stats.totalWorkouts}</small>
                                  </div>
                                  <ProgressBar now={75} variant="primary" />
                                </div>
                              </Col>
                              <Col md={4} className="mb-3">
                                <div className="progress-item">
                                  <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">Calories Burned</small>
                                    <small className="fw-bold">{feed.stats.caloriesBurned.toLocaleString()}</small>
                                  </div>
                                  <ProgressBar now={60} variant="warning" />
                                </div>
                              </Col>
                              <Col md={4} className="mb-3">
                                <div className="progress-item">
                                  <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">Current Streak</small>
                                    <small className="fw-bold">{feed.stats.streak} days</small>
                                  </div>
                                  <ProgressBar now={90} variant="success" />
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>

                        <Row>
                          {filteredPlans().map((plan, index) => (
                            <Col key={plan._id} lg={4} md={6} className="mb-4">
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="motion-card"
                              >
                                <Card className="h-100 subscribed-card border-0 shadow-sm">
                                  <div className="subscribed-badge">
                                    <i className="bi bi-check-circle-fill"></i>
                                    Active Subscription
                                  </div>
                                  <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                      <div>
                                        <h5 className="fw-bold mb-1">{plan.title}</h5>
                                        <div className="d-flex align-items-center">
                                          <div className="avatar-sm me-2">
                                            <i className="bi bi-person-circle text-warning"></i>
                                          </div>
                                          <div>
                                            <small className="text-muted">Trainer</small>
                                            <Link 
                                              to={`/trainer/${plan.trainer?._id}`}
                                              className="text-decoration-none fw-medium ms-1"
                                            >
                                              {plan.trainer?.name}
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                      <Badge bg="success">
                                        <i className="bi bi-unlock me-1"></i>
                                        Full Access
                                      </Badge>
                                    </div>

                                    {/* Category Badges */}
                                    <div className="mb-3">
                                      <Badge bg="danger" className="me-2">
                                        <i className="bi bi-fire me-1"></i>
                                        FAT-LOSS
                                      </Badge>
                                      <Badge bg="success">BEGINNER</Badge>
                                    </div>

                                    <p className="text-muted small mb-4">
                                      {plan.description}
                                    </p>

                                    <div className="subscribed-features mb-4">
                                      <div className="feature-item">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span>Full workout videos</span>
                                      </div>
                                      <div className="feature-item">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span>Meal plans & recipes</span>
                                      </div>
                                      <div className="feature-item">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span>Progress tracking</span>
                                      </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                      <div>
                                        <small className="text-muted d-block">Access until</small>
                                        <span className="fw-semibold">
                                          {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="d-flex gap-2">
                                        <Button
                                          variant="outline-primary"
                                          size="sm"
                                          as={Link}
                                          to={`/plan/${plan._id}`}
                                        >
                                          <i className="bi bi-play-circle me-1"></i>
                                          Continue
                                        </Button>
                                        <Button
                                          variant="outline-success"
                                          size="sm"
                                          as={Link}
                                          to={`/workout/${plan._id}`}
                                        >
                                          <i className="bi bi-activity me-1"></i>
                                          Track
                                        </Button>
                                      </div>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </motion.div>
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}
                  </AnimatePresence>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm mt-4">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-lightning-charge text-warning me-2"></i>
              Quick Actions
            </h5>
            <Row>
              <Col md={3} className="mb-3">
                <Button variant="outline-primary" className="w-100 h-100 py-3 d-flex flex-column align-items-center">
                  <i className="bi bi-calendar-plus display-6 mb-2"></i>
                  <div>Schedule Workout</div>
                </Button>
              </Col>
              <Col md={3} className="mb-3">
                <Button variant="outline-success" className="w-100 h-100 py-3 d-flex flex-column align-items-center">
                  <i className="bi bi-bar-chart display-6 mb-2"></i>
                  <div>View Analytics</div>
                </Button>
              </Col>
              <Col md={3} className="mb-3">
                <Button variant="outline-warning" className="w-100 h-100 py-3 d-flex flex-column align-items-center">
                  <i className="bi bi-trophy display-6 mb-2"></i>
                  <div>Challenges</div>
                </Button>
              </Col>
              <Col md={3} className="mb-3">
                <Button variant="outline-info" className="w-100 h-100 py-3 d-flex flex-column align-items-center" as={Link} to="/">
                  <i className="bi bi-compass display-6 mb-2"></i>
                  <div>Discover More</div>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UserFeed;

