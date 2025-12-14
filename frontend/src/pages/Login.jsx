import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";

import './Login.css';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Welcome back! Login successful!', {
          icon: '🏋️‍♂️'
        });
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role) => {
    const demoCredentials = {
      trainer: { email: 'trainer@demo.com', password: 'demo123' },
      user: { email: 'user@demo.com', password: 'demo123' }
    };
    
    setFormData(demoCredentials[role]);
    setLoading(true);
    
    try {
      const result = await login(demoCredentials[role].email, demoCredentials[role].password);
      if (result.success) {
        toast.success(`Demo ${role} login successful!`);
        navigate('/');
      }
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="login-container">
      <Row className="h-100">
        {/* Left Side - Decorative/Image Section */}
        <Col lg={6} className="d-none d-lg-block left-side p-0">
          <div className="left-overlay">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="left-content"
            >
              <h1 className="display-4 fw-bold text-white mb-4">
                Transform Your <span className="text-warning">Fitness</span> Journey
              </h1>
              <p className="lead text-light mb-5">
                Join thousands of users achieving their fitness goals with certified trainers. 
                Get personalized plans, track progress, and stay motivated.
              </p>
              
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="bi bi-person-badge text-warning"></i>
                  </div>
                  <div>
                    <h5 className="text-white">Certified Trainers</h5>
                    <p className="text-light mb-0">Learn from the best fitness professionals</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="bi bi-graph-up text-warning"></i>
                  </div>
                  <div>
                    <h5 className="text-white">Track Progress</h5>
                    <p className="text-light mb-0">Monitor your fitness journey with analytics</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="bi bi-people text-warning"></i>
                  </div>
                  <div>
                    <h5 className="text-white">Community Support</h5>
                    <p className="text-light mb-0">Connect with like-minded fitness enthusiasts</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Col>

        {/* Right Side - Login Form */}
        <Col lg={6} className="right-side d-flex align-items-center justify-content-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-100"
            style={{ maxWidth: '450px' }}
          >
            <Card className="login-card border-0 shadow-lg">
              <Card.Body className="p-4 p-md-5">
                {/* Logo */}
                <div className="text-center mb-4">
                  <div className="logo-container mb-3">
                    <div className="logo-circle bg-primary-gradient d-flex align-items-center justify-content-center">
                      <i className="bi bi-lightning-charge text-white" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-2">
                    <span className="text-primary">FitPlan</span>
                    <span className="text-dark">Hub</span>
                  </h2>
                  <p className="text-muted">Welcome back! Sign in to continue your fitness journey</p>
                </div>

                {error && (
                  <Alert 
                    variant="danger" 
                    className="text-center border-0 shadow-sm"
                    dismissible
                    onClose={() => setError('')}
                  >
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark">
                      <i className="bi bi-envelope me-2 text-primary"></i>
                      Email Address
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="border-start-0 ps-0"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Form.Label className="fw-bold text-dark">
                        <i className="bi bi-lock me-2 text-primary"></i>
                        Password
                      </Form.Label>
                      <Link 
                        to="#" 
                        className="text-decoration-none text-primary small fw-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info('Password reset feature coming soon!');
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-key text-muted"></i>
                      </span>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="border-start-0 ps-0 border-end-0"
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''} text-muted`}></i>
                      </button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Remember me"
                      className="text-muted"
                    />
                  </Form.Group>

                  <Button 
                    variant="primary-gradient" 
                    type="submit" 
                    className="w-100 mb-3 py-3 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mb-4">
                  <div className="divider my-4 position-relative">
                    <span className="bg-white px-3 text-muted small">Or continue with</span>
                  </div>
                  
                  <div className="d-grid gap-2 mb-3">
                    <Button 
                      variant="outline-dark" 
                      className="d-flex align-items-center justify-content-center"
                      onClick={() => demoLogin('user')}
                      disabled={loading}
                    >
                      <i className="bi bi-person-circle me-2"></i>
                      Demo User Login
                    </Button>
                    
                    <Button 
                      variant="outline-warning" 
                      className="d-flex align-items-center justify-content-center"
                      onClick={() => demoLogin('trainer')}
                      disabled={loading}
                    >
                      <i className="bi bi-award me-2"></i>
                      Demo Trainer Login
                    </Button>
                  </div>
                </div>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted mb-2">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="text-decoration-none fw-bold text-primary"
                    >
                      Create Account
                    </Link>
                  </p>
                  <Link 
                    to="/" 
                    className="text-decoration-none text-muted small"
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to home
                  </Link>
                </div>
              </Card.Body>
            </Card>
            
            {/* Stats footer */}
            <div className="text-center mt-4">
              <div className="d-flex justify-content-center gap-5">
                <div className="text-center">
                  <h5 className="fw-bold text-primary mb-0">10K+</h5>
                  <small className="text-muted">Active Users</small>
                </div>
                <div className="text-center">
                  <h5 className="fw-bold text-warning mb-0">500+</h5>
                  <small className="text-muted">Certified Trainers</small>
                </div>
                <div className="text-center">
                  <h5 className="fw-bold text-success mb-0">50K+</h5>
                  <small className="text-muted">Workouts Completed</small>
                </div>
              </div>
            </div>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

