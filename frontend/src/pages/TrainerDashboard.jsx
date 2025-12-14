import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Modal, Table,Container,Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import './TrainerDashboard.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate,Link } from 'react-router-dom';
const TrainerDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlans: 0,
    totalSubscribers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullContent: '',
    price: '',
    duration: '',
    durationUnit: 'days',
    category: 'fat-loss',
    difficulty: 'beginner'
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      // Mock data for demonstration
      const mockPlans = [
        {
          _id: '1',
          title: 'Fat Loss Beginner Plan',
          description: 'Perfect for beginners looking to lose weight with guided workouts',
          fullContent: 'Full workout plan details...',
          price: 500,
          duration: 30,
          durationUnit: 'days',
          category: 'fat-loss',
          difficulty: 'beginner',
          subscribers: [1, 2, 3],
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20'
        },
        {
          _id: '2',
          title: 'Advanced Strength Training',
          description: 'Intense strength program for experienced lifters',
          fullContent: 'Full workout plan details...',
          price: 800,
          duration: 12,
          durationUnit: 'weeks',
          category: 'muscle-gain',
          difficulty: 'advanced',
          subscribers: [1, 2, 3, 4, 5],
          createdAt: '2024-02-01',
          updatedAt: '2024-02-05'
        }
      ];

      setPlans(mockPlans);
      
      // Calculate stats
      const totalSubscribers = mockPlans.reduce((acc, plan) => acc + (plan.subscribers?.length || 0), 0);
      const totalRevenue = mockPlans.reduce((acc, plan) => acc + (plan.price * (plan.subscribers?.length || 0)), 0);
      
      setStats({
        totalPlans: mockPlans.length,
        totalSubscribers,
        totalRevenue,
        activeSubscriptions: totalSubscribers
      });
      
      setLoading(false);

      // Uncomment for real API call
      // const res = await axios.get('/api/plans');
      // const myPlans = res.data.filter(plan => plan.trainer?._id === user._id);
      // setPlans(myPlans);
      // calculateStats(myPlans);
      // setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load plans');
      setLoading(false);
    }
  };

  const calculateStats = (plansArray) => {
    const totalSubscribers = plansArray.reduce((acc, plan) => acc + (plan.subscribers?.length || 0), 0);
    const totalRevenue = plansArray.reduce((acc, plan) => acc + (plan.price * (plan.subscribers?.length || 0)), 0);
    
    setStats({
      totalPlans: plansArray.length,
      totalSubscribers,
      totalRevenue,
      activeSubscriptions: totalSubscribers
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        // Update plan
        await axios.put(`/api/plans/${editingPlan._id}`, formData);
        toast.success('Plan updated successfully!');
      } else {
        // Create new plan
        await axios.post('/api/plans', formData);
        toast.success('Plan created successfully!');
      }
      setShowModal(false);
      setEditingPlan(null);
      resetForm();
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving plan');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      fullContent: plan.fullContent,
      price: plan.price,
      duration: plan.duration,
      durationUnit: plan.durationUnit,
      category: plan.category,
      difficulty: plan.difficulty
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await axios.delete(`/api/plans/${id}`);
        toast.success('Plan deleted successfully');
        fetchPlans();
      } catch (err) {
        toast.error('Error deleting plan');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fullContent: '',
      price: '',
      duration: '',
      durationUnit: 'days',
      category: 'fat-loss',
      difficulty: 'beginner'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'fat-loss': 'fire',
      'muscle-gain': 'dumbbell',
      'beginner': 'person',
      'advanced': 'trophy',
      'custom': 'stars',
      'yoga': 'flower1',
      'cardio': 'heart-pulse'
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
      'cardio': 'info'
    };
    return colors[category] || 'secondary';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'success',
      'intermediate': 'warning',
      'advanced': 'danger'
    };
    return colors[difficulty] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="trainer-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="header-content"
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="display-6 fw-bold text-white mb-2">
                  <i className="bi bi-speedometer2 me-3"></i>
                  Trainer Dashboard
                </h1>
                <p className="text-light mb-0">Manage your fitness plans and track performance</p>
              </div>
              <Button 
                variant="warning" 
                size="lg"
                onClick={() => {
                  setEditingPlan(null);
                  resetForm();
                  setShowModal(true);
                }}
                className="px-4 py-3"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Create New Plan
              </Button>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-5">
        {/* Stats Overview */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <Card className="stat-card border-0 shadow">
              <Card.Body className="text-center">
                <div className="stat-icon bg-primary-gradient mb-3">
                  <i className="bi bi-card-checklist text-white"></i>
                </div>
                <h3 className="fw-bold mb-1">{stats.totalPlans}</h3>
                <p className="text-muted mb-0">Total Plans</p>
                <div className="progress mt-2" style={{ height: '4px' }}>
                  <div className="progress-bar" style={{ width: '75%' }}></div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="stat-card border-0 shadow">
              <Card.Body className="text-center">
                <div className="stat-icon bg-success-gradient mb-3">
                  <i className="bi bi-people text-white"></i>
                </div>
                <h3 className="fw-bold mb-1">{stats.totalSubscribers}</h3>
                <p className="text-muted mb-0">Total Subscribers</p>
                <div className="progress mt-2" style={{ height: '4px' }}>
                  <div className="progress-bar bg-success" style={{ width: '60%' }}></div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="stat-card border-0 shadow">
              <Card.Body className="text-center">
                <div className="stat-icon bg-warning-gradient mb-3">
                  <i className="bi bi-currency-dollar text-white"></i>
                </div>
                <h3 className="fw-bold mb-1">${stats.totalRevenue}</h3>
                <p className="text-muted mb-0">Total Revenue</p>
                <div className="progress mt-2" style={{ height: '4px' }}>
                  <div className="progress-bar bg-warning" style={{ width: '85%' }}></div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="stat-card border-0 shadow">
              <Card.Body className="text-center">
                <div className="stat-icon bg-info-gradient mb-3">
                  <i className="bi bi-graph-up text-white"></i>
                </div>
                <h3 className="fw-bold mb-1">{stats.activeSubscriptions}</h3>
                <p className="text-muted mb-0">Active Subscriptions</p>
                <div className="progress mt-2" style={{ height: '4px' }}>
                  <div className="progress-bar bg-info" style={{ width: '90%' }}></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Plans Section */}
        <Card className="border-0 shadow-lg mb-5">
          <Card.Header className="bg-white border-0 py-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="fw-bold mb-0">
                  <i className="bi bi-list-check text-primary me-2"></i>
                  My Fitness Plans
                </h3>
                <p className="text-muted mb-0 mt-1">Manage and edit your created fitness plans</p>
              </div>
              <Badge bg="primary" pill className="px-3 py-2">
                {plans.length} Plans
              </Badge>
            </div>
          </Card.Header>
          
          <Card.Body className="p-4">
            <AnimatePresence>
              {plans.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert variant="info" className="text-center border-0 shadow-sm">
                    <div className="py-5">
                      <div className="empty-state-icon mb-3">
                        <i className="bi bi-card-checklist" style={{ fontSize: '4rem' }}></i>
                      </div>
                      <h4 className="mb-3">No fitness plans created yet</h4>
                      <p className="text-muted mb-4">
                        Start creating your first fitness plan to help users achieve their goals!
                      </p>
                      <Button 
                        variant="primary" 
                        size="lg"
                        onClick={() => {
                          setEditingPlan(null);
                          resetForm();
                          setShowModal(true);
                        }}
                        className="px-5"
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Your First Plan
                      </Button>
                    </div>
                  </Alert>
                </motion.div>
              ) : (
                <Row>
                  {plans.map((plan, index) => (
                    <Col key={plan._id} lg={6} className="mb-4">
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
                                  bg={getCategoryColor(plan.category)} 
                                  className="mb-2 px-3 py-2"
                                >
                                  <i className={`bi bi-${getCategoryIcon(plan.category)} me-2`}></i>
                                  {plan.category.replace('-', ' ').toUpperCase()}
                                </Badge>
                                <h5 className="fw-bold mb-1">{plan.title}</h5>
                                <div className="d-flex align-items-center">
                                  <Badge bg={getDifficultyColor(plan.difficulty)} className="me-2">
                                    {plan.difficulty}
                                  </Badge>
                                  <small className="text-muted">
                                    <i className="bi bi-calendar me-1"></i>
                                    {plan.duration} {plan.durationUnit}
                                  </small>
                                </div>
                              </div>
                              <div className="text-end">
                                <h4 className="text-primary fw-bold mb-1">${plan.price}</h4>
                                <small className="text-muted">one-time</small>
                              </div>
                            </div>

                            {/* Plan Description */}
                            <p className="text-muted mb-4">
                              {plan.description}
                            </p>

                            {/* Plan Stats */}
                            <div className="plan-stats mb-4">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <div className="d-flex align-items-center">
                                    <div className="subscriber-icon me-2">
                                      <i className="bi bi-people"></i>
                                    </div>
                                    <div>
                                      <div className="fw-bold">{plan.subscribers?.length || 0}</div>
                                      <small className="text-muted">Subscribers</small>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="d-flex align-items-center">
                                    <div className="revenue-icon me-2">
                                      <i className="bi bi-currency-dollar"></i>
                                    </div>
                                    <div>
                                      <div className="fw-bold">${(plan.price * (plan.subscribers?.length || 0)).toLocaleString()}</div>
                                      <small className="text-muted">Revenue</small>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="d-flex align-items-center">
                                    <div className="rating-icon me-2">
                                      <i className="bi bi-star-fill"></i>
                                    </div>
                                    <div>
                                      <div className="fw-bold">{((Math.random() * 2) + 3).toFixed(1)}</div>
                                      <small className="text-muted">Rating</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEdit(plan)}
                                className="flex-fill"
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Edit Plan
                              </Button>
                              <Button
                                variant="outline-success"
                                size="sm"
                                as={Link}
                                to={`/plan/${plan._id}`}
                                className="flex-fill"
                              >
                                <i className="bi bi-eye me-1"></i>
                                Preview
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(plan._id)}
                                className="flex-fill"
                              >
                                <i className="bi bi-trash me-1"></i>
                                Delete
                              </Button>
                            </div>
                          </Card.Body>
                          
                          <Card.Footer className="bg-transparent border-0 pt-0">
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                Updated {new Date(plan.updatedAt).toLocaleDateString()}
                              </small>
                              <Link 
                                to={`/plan/${plan._id}`}
                                className="text-decoration-none text-primary small fw-medium"
                              >
                                View Details <i className="bi bi-arrow-right ms-1"></i>
                              </Link>
                            </div>
                          </Card.Footer>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              )}
            </AnimatePresence>
          </Card.Body>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <Card.Header className="bg-white border-0 py-4">
            <h3 className="fw-bold mb-0">
              <i className="bi bi-activity text-primary me-2"></i>
              Recent Activity
            </h3>
          </Card.Header>
          <Card.Body className="p-0">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Activity</th>
                  <th>Plan</th>
                  <th>User</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Today</td>
                  <td>New subscription</td>
                  <td>Fat Loss Beginner Plan</td>
                  <td>John Doe</td>
                  <td><Badge bg="success">Active</Badge></td>
                </tr>
                <tr>
                  <td>Yesterday</td>
                  <td>Plan updated</td>
                  <td>Advanced Strength Training</td>
                  <td>-</td>
                  <td><Badge bg="info">Updated</Badge></td>
                </tr>
                <tr>
                  <td>2 days ago</td>
                  <td>New review</td>
                  <td>Fat Loss Beginner Plan</td>
                  <td>Jane Smith</td>
                  <td><Badge bg="warning">4.8 ★</Badge></td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Create/Edit Plan Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">
            <i className="bi bi-card-checklist text-primary me-2"></i>
            {editingPlan ? 'Edit Fitness Plan' : 'Create New Fitness Plan'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="py-4">
            <Row>
              <Col md={8}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-card-heading text-primary me-2"></i>
                    Plan Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Fat Loss Beginner Plan"
                    required
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-currency-dollar text-primary me-2"></i>
                    Price ($)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                <i className="bi bi-text-paragraph text-primary me-2"></i>
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your fitness plan..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                <i className="bi bi-journal-text text-primary me-2"></i>
                Full Content
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={formData.fullContent}
                onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
                placeholder="Detailed workout routines, meal plans, tips..."
                required
              />
              <Form.Text className="text-muted">
                This content will only be visible to subscribers
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-calendar text-primary me-2"></i>
                    Duration
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                    <Form.Select
                      value={formData.durationUnit}
                      onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-tags text-primary me-2"></i>
                    Category
                  </Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="fat-loss">Fat Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="beginner">Beginner</option>
                    <option value="advanced">Advanced</option>
                    <option value="yoga">Yoga</option>
                    <option value="cardio">Cardio</option>
                    <option value="custom">Custom</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                <i className="bi bi-speedometer2 text-primary me-2"></i>
                Difficulty Level
              </Form.Label>
              <div className="d-flex gap-3">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <Form.Check
                    key={level}
                    type="radio"
                    id={`difficulty-${level}`}
                    label={level.charAt(0).toUpperCase() + level.slice(1)}
                    name="difficulty"
                    value={level}
                    checked={formData.difficulty === level}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className={`difficulty-radio difficulty-${level}`}
                  />
                ))}
              </div>
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              className="px-4"
            >
              {editingPlan ? (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Update Plan
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Plan
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainerDashboard;

