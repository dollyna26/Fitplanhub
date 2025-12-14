import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import './Register.css';
import { motion } from "framer-motion";
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    bio: '',
    certifications: '',
    profileImage: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profileImage') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value
    });
    
    if (step === 1) {
      setStep(2);
      setProgress(50);
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (step === 2 && formData.role === 'trainer') {
      if (!formData.bio.trim()) {
        newErrors.bio = 'Bio is required for trainers';
      } else if (formData.bio.length < 50) {
        newErrors.bio = 'Bio should be at least 50 characters';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
        setProgress(progress + 25);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 25);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }
    
    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'trainer' && {
          bio: formData.bio,
          certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c)
        })
      };

      const result = await register(userData);
      
      if (result.success) {
        toast.success('🎉 Account created successfully! Welcome to FitPlanHub!', {
          position: "top-center",
          autoClose: 3000,
        });
        
        // Show welcome message before redirect
        setTimeout(() => {
          navigate(formData.role === 'trainer' ? '/dashboard' : '/feed');
        }, 1500);
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (err) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h4 className="text-center mb-4 fw-bold">Create Your Account</h4>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                <i className="bi bi-person-circle text-primary me-2"></i>
                Full Name
              </Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-person text-muted"></i>
                </span>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.name ? 'is-invalid' : ''}
                  required
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                <i className="bi bi-envelope text-primary me-2"></i>
                Email Address
              </Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-at text-muted"></i>
                </span>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={errors.email ? 'is-invalid' : ''}
                  required
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-lock text-primary me-2"></i>
                    Password
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-key text-muted"></i>
                    </span>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className={errors.password ? 'is-invalid' : ''}
                      required
                    />
                  </div>
                  {errors.password && (
                    <div className="text-danger small mt-1">{errors.password}</div>
                  )}
                  <Form.Text className="text-muted small">
                    Must be at least 6 characters long
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-shield-lock text-primary me-2"></i>
                    Confirm Password
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-key-fill text-muted"></i>
                    </span>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={errors.confirmPassword ? 'is-invalid' : ''}
                      required
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-danger small mt-1">{errors.confirmPassword}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="password-strength mt-3">
              <div className="strength-bar">
                <div 
                  className={`strength-level ${formData.password.length >= 6 ? 'active' : ''}`}
                  style={{ width: formData.password.length >= 6 ? '100%' : `${(formData.password.length / 6) * 100}%` }}
                ></div>
              </div>
              <small className="text-muted">
                Password strength: {formData.password.length >= 6 ? 'Strong' : 'Weak'}
              </small>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h4 className="text-center mb-4 fw-bold">Select Your Role</h4>
            <p className="text-center text-muted mb-4">
              Choose how you want to use FitPlanHub
            </p>

            <div className="role-selection mb-5">
              <ToggleButtonGroup
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                className="d-flex flex-column flex-md-row gap-3"
              >
                <ToggleButton
                  id="role-user"
                  value="user"
                  variant={formData.role === 'user' ? "primary-gradient" : "outline-secondary"}
                  className="role-card py-4 px-4 border-0"
                >
                  <div className="text-center">
                    <div className="role-icon mb-3">
                      <i className="bi bi-person-circle" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <h5 className="fw-bold mb-2">Fitness Enthusiast</h5>
                    <p className="small text-muted mb-0">
                      Follow trainers, purchase plans, track your fitness journey
                    </p>
                    <div className="mt-3">
                      <span className="badge bg-light text-dark">
                        <i className="bi bi-check-circle me-1"></i>
                        Browse Plans
                      </span>
                      <span className="badge bg-light text-dark ms-2">
                        <i className="bi bi-check-circle me-1"></i>
                        Follow Trainers
                      </span>
                    </div>
                  </div>
                </ToggleButton>

                <ToggleButton
                  id="role-trainer"
                  value="trainer"
                  variant={formData.role === 'trainer' ? "warning-gradient" : "outline-secondary"}
                  className="role-card py-4 px-4 border-0"
                >
                  <div className="text-center">
                    <div className="role-icon mb-3">
                      <i className="bi bi-award" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <h5 className="fw-bold mb-2">Certified Trainer</h5>
                    <p className="small text-muted mb-0">
                      Create fitness plans, earn money, build your brand
                    </p>
                    <div className="mt-3">
                      <span className="badge bg-light text-dark">
                        <i className="bi bi-check-circle me-1"></i>
                        Create Plans
                      </span>
                      <span className="badge bg-light text-dark ms-2">
                        <i className="bi bi-check-circle me-1"></i>
                        Earn Money
                      </span>
                    </div>
                  </div>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            {formData.role === 'trainer' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-pencil text-warning me-2"></i>
                    Professional Bio
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about your fitness background, expertise, and approach..."
                    className={errors.bio ? 'is-invalid' : ''}
                  />
                  {errors.bio && (
                    <div className="invalid-feedback">{errors.bio}</div>
                  )}
                  <Form.Text className="text-muted small">
                    Minimum 50 characters. This helps build trust with potential clients.
                    <span className="float-end">{formData.bio.length}/500</span>
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-patch-check text-warning me-2"></i>
                    Certifications
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="e.g., NASM-CPT, ACE Certified, CrossFit Level 1"
                  />
                  <Form.Text className="text-muted small">
                    Separate multiple certifications with commas
                  </Form.Text>
                </Form.Group>
              </motion.div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-4">
              <div className="success-icon mb-3">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <h4 className="fw-bold">Complete Your Registration</h4>
              <p className="text-muted">Review your information before creating your account</p>
            </div>

            <div className="review-card p-4 mb-4 border rounded">
              <div className="review-item mb-3">
                <small className="text-muted">Full Name</small>
                <div className="fw-semibold">{formData.name}</div>
              </div>
              <div className="review-item mb-3">
                <small className="text-muted">Email</small>
                <div className="fw-semibold">{formData.email}</div>
              </div>
              <div className="review-item mb-3">
                <small className="text-muted">Account Type</small>
                <div>
                  <span className={`badge ${formData.role === 'trainer' ? 'bg-warning' : 'bg-primary'}`}>
                    {formData.role === 'trainer' ? 'Certified Trainer' : 'Fitness Enthusiast'}
                  </span>
                </div>
              </div>
              {formData.role === 'trainer' && formData.bio && (
                <div className="review-item">
                  <small className="text-muted">Bio Preview</small>
                  <div className="text-muted small">{formData.bio.substring(0, 100)}...</div>
                </div>
              )}
            </div>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                id="terms"
                label={
                  <span>
                    I agree to the{' '}
                    <a href="#" className="text-primary text-decoration-none" onClick={(e) => {
                      e.preventDefault();
                      toast.info('Terms of Service will be shown here');
                    }}>
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="#" className="text-primary text-decoration-none" onClick={(e) => {
                      e.preventDefault();
                      toast.info('Privacy Policy will be shown here');
                    }}>
                      Privacy Policy
                    </a>
                  </span>
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                id="newsletter"
                label="Send me fitness tips, updates, and special offers"
                defaultChecked
              />
            </Form.Group>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Container fluid className="register-container">
      <Row className="h-100">
        {/* Left Side - Decorative Section */}
        <Col lg={6} className="d-none d-lg-block left-side p-0">
          <div className="left-overlay">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="left-content"
            >
              <h1 className="display-5 fw-bold text-white mb-4">
                Start Your <span className="text-warning">Fitness</span> Journey Today
              </h1>
              <p className="lead text-light mb-5">
                Join our community of fitness enthusiasts and certified trainers. 
                Achieve your goals, share your expertise, and transform lives.
              </p>
              
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="bi bi-trophy text-warning"></i>
                  </div>
                  <div>
                    <h5 className="text-white">Personalized Plans</h5>
                    <p className="text-light small mb-0">Tailored workouts and nutrition guidance</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="bi bi-graph-up-arrow text-warning"></i>
                  </div>
                  <div>
                    <h5 className="text-white">Track Progress</h5>
                    <p className="text-light small mb-0">Monitor improvements with analytics</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="bi bi-currency-dollar text-warning"></i>
                  </div>
                  <div>
                    <h5 className="text-white">Earn as Trainer</h5>
                    <p className="text-light small mb-0">Monetize your fitness expertise</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="bi bi-people text-warning"></i>
                  </div>
                  <div>
                    <h5 className="text-white">Community</h5>
                    <p className="text-light small mb-0">Connect with fitness enthusiasts</p>
                  </div>
                </div>
              </div>
              
              <div className="testimonial mt-5">
                <div className="testimonial-content">
                  <p className="text-light fst-italic">
                    "FitPlanHub transformed how I approach fitness. As a trainer, I've reached 500+ clients!"
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="testimonial-avatar me-3">
                      <i className="bi bi-person-circle text-warning"></i>
                    </div>
                    <div>
                      <h6 className="text-white mb-0">Alex Johnson</h6>
                      <small className="text-light">Certified Personal Trainer</small>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Col>

        {/* Right Side - Registration Form */}
        <Col lg={6} className="right-side d-flex align-items-center justify-content-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-100"
            style={{ maxWidth: '550px' }}
          >
            <Card className="register-card border-0 shadow-lg">
              <Card.Body className="p-4 p-md-5">
                {/* Progress Bar */}
                <div className="progress-container mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">Step {step} of 3</small>
                    <small className="text-primary fw-semibold">{progress}% Complete</small>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-primary-gradient" 
                      role="progressbar" 
                      style={{ width: `${progress}%` }}
                      aria-valuenow={progress} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>

                {/* Logo */}
                <div className="text-center mb-4">
                  <div className="logo-container mb-3">
                    <div className="logo-circle bg-primary-gradient d-flex align-items-center justify-content-center">
                      <i className="bi bi-lightning-charge text-white" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-2">
                    <span className="text-primary">Join </span>
                    <span className="text-dark">FitPlan</span>
                    <span className="text-warning">Hub</span>
                  </h2>
                </div>

                {/* Form Steps */}
                {renderStep()}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-5">
                  {step > 1 ? (
                    <Button 
                      variant="outline-secondary" 
                      onClick={prevStep}
                      className="px-4"
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  {step < 3 ? (
                    <Button 
                      variant="primary-gradient" 
                      onClick={nextStep}
                      className="px-4"
                    >
                      Continue
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                  ) : (
                    <Button 
                      variant="success" 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-4"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Create Account
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Login Link */}
                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-bold text-primary">
                      Sign In
                    </Link>
                  </p>
                  <Link to="/" className="text-decoration-none text-muted small">
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to home
                  </Link>
                </div>
              </Card.Body>
            </Card>
            
            {/* Security Badge */}
            <div className="text-center mt-4">
              <div className="security-badge d-inline-flex align-items-center p-3 rounded bg-light">
                <i className="bi bi-shield-check text-success me-2"></i>
                <div className="text-start">
                  <small className="fw-semibold d-block">Secure Registration</small>
                  <small className="text-muted">Your data is protected with 256-bit encryption</small>
                </div>
              </div>
            </div>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};



export default Register;