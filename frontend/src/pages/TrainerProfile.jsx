import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Button, Badge, Row, Col, ListGroup, Alert, Container,
  ProgressBar, Tabs, Tab, Modal, Form
} from 'react-bootstrap';
import { 
  Star, StarFill, PersonPlus, PersonDash, Envelope, Telephone, 
  GeoAlt, Trophy, CheckCircle, Share, ChatDots, Calendar,
  Lightning, Fire, Clock, People, Award, GraphUp, ShieldCheck,
  Instagram, Youtube
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const TrainerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('plans');

  useEffect(() => {
    fetchTrainerProfile();
  }, [id]);

  const fetchTrainerProfile = async () => {
    try {
      const res = await axios.get(`/api/users/trainer/${id}`);
      const data = {
        ...res.data,
        stats: {
          ...res.data.stats,
          completionRate: 92,
          avgRating: 4.8,
          totalReviews: 128
        },
        socialLinks: {
          instagram: 'https://instagram.com/trainer2',
          youtube: 'https://youtube.com/trainer2',
          tiktok: 'https://tiktok.com/@trainer2',
          website: 'https://trainer2fitness.com'
        },
        skills: [
          { name: 'Strength Training', level: 90 },
          { name: 'Weight Loss', level: 85 },
          { name: 'Athletic Performance', level: 95 },
          { name: 'Nutrition Coaching', level: 80 }
        ],
        achievements: [
          { title: '5+ Years Experience', icon: 'experience' },
          { title: '500+ Clients Trained', icon: 'clients' },
          { title: 'Championship Wrestler', icon: 'trophy' },
          { title: 'Certified Nutritionist', icon: 'nutrition' }
        ]
      };
      setTrainerData(data);
      setIsFollowing(data.isFollowing);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load trainer profile');
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const res = await axios.post(`/api/users/${id}/follow`);
      setIsFollowing(res.data.following);
      toast.success(res.data.message);
      fetchTrainerProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleSendMessage = async () => {
    try {
      await axios.post(`/api/messages/send/${id}`, { message });
      toast.success('Message sent successfully!');
      setShowContactModal(false);
      setMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handleBookSession = () => {
    navigate(`/booking/${id}`);
  };

  const handleShareProfile = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trainerData.trainer.name}'s Profile`,
          text: `Check out ${trainerData.trainer.name} on FirePanHub`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Profile link copied to clipboard!');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < Math.floor(rating) ? 
        <StarFill key={i} className="text-warning" size={16} /> : 
        <Star key={i} className="text-warning" size={16} />
    ));
  };

  const renderSkillBar = (skill) => (
    <div key={skill.name} className="mb-3">
      <div className="d-flex justify-content-between mb-1">
        <span className="text-muted">{skill.name}</span>
        <span className="fw-bold">{skill.level}%</span>
      </div>
      <ProgressBar 
        now={skill.level} 
        variant="primary"
        className="rounded-pill"
        style={{ height: '8px' }}
      />
    </div>
  );

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading trainer profile...</p>
      </Container>
    );
  }

  if (!trainerData) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Trainer not found</Alert.Heading>
          <p>The trainer profile you're looking for doesn't exist.</p>
          <Button variant="outline-danger" onClick={() => navigate('/')}>
            Go Back Home
          </Button>
        </Alert>
      </Container>
    );
  }

  const { trainer, plans, stats, socialLinks, skills, achievements } = trainerData;
  const isOwnProfile = user?._id === trainer._id;

  return (
    <Container className="py-4">
      {/* Profile Header */}
      <Card className="mb-4 shadow-lg border-0">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            {/* Profile Picture */}
            <Col lg={3} className="text-center mb-4 mb-lg-0">
              <div className="position-relative d-inline-block">
                <div 
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center mb-3 shadow"
                  style={{ 
                    width: '140px', 
                    height: '140px', 
                    fontSize: '48px', 
                    color: 'white',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  {trainer.name.charAt(0).toUpperCase()}
                </div>
                <Badge 
                  bg="success" 
                  className="position-absolute top-0 end-0 rounded-circle p-2"
                  style={{ transform: 'translate(25%, -25%)' }}
                >
                  <ShieldCheck size={20} />
                </Badge>
              </div>
              
              {/* Social Links */}
              <div className="d-flex justify-content-center gap-3 mt-3">
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-danger">
                    <Instagram size={24} />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-danger">
                    <Youtube size={24} />
                  </a>
                )}
             
               
              </div>
            </Col>
            
            {/* Profile Info */}
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="d-flex align-items-center mb-2">
                <h1 className="mb-0 me-3">{trainer.name}</h1>
                <Badge bg="gradient-primary" className="fs-6 px-3 py-1">
                  <Trophy className="me-1" /> PRO
                </Badge>
              </div>
              
              <p className="text-muted mb-3">
                <i className="bi bi-briefcase me-2"></i>
                Professional Wrestler & Fitness Influencer
              </p>
              
              {/* Rating */}
              <div className="d-flex align-items-center mb-3">
                <div className="me-2">
                  {renderStars(stats.avgRating)}
                </div>
                <span className="fw-bold me-2">{stats.avgRating}</span>
                <span className="text-muted">({stats.totalReviews} reviews)</span>
              </div>
              
              {/* Contact Info */}
              <Row className="g-3 mb-4">
                <Col xs={12} md={6}>
                  <div className="d-flex align-items-center text-muted">
                    <Envelope className="me-2" />
                    <span>{trainer.email}</span>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="d-flex align-items-center text-muted">
                    <GeoAlt className="me-2" />
                    <span>Los Angeles, CA</span>
                  </div>
                </Col>
              </Row>
              
              {/* Bio */}
              <Card className="border-start border-primary border-4 bg-light">
                <Card.Body className="py-2">
                  <p className="mb-0">
                    <Fire className="me-2 text-warning" />
                    {trainer.bio || "🏆 Championship wrestler with 5+ years experience. Specialized in strength training and athletic performance."}
                  </p>
                </Card.Body>
              </Card>
              
              {/* Achievements */}
              <div className="mt-4">
                <h6 className="text-muted mb-3">Achievements</h6>
                <Row className="g-2">
                  {achievements.map((ach, idx) => (
                    <Col key={idx} xs={6} md={3}>
                      <div className="bg-light rounded p-2 text-center border">
                        <small className="d-block fw-bold">{ach.title}</small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
            
            {/* Stats & Actions */}
            <Col lg={3}>
              {/* Stats Cards */}
              <Card className="mb-3 border-0 bg-primary bg-opacity-10">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h3 className="mb-0">{stats.followers}</h3>
                      <small className="text-muted">Followers</small>
                    </div>
                    <Badge bg="success" className="fs-6">
                      <GraphUp className="me-1" /> +12%
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="mb-3 border-0 bg-success bg-opacity-10">
                <Card.Body className="p-3">
                  <h3 className="mb-0">{stats.totalSubscribers}</h3>
                  <small className="text-muted">Active Subscribers</small>
                </Card.Body>
              </Card>
              
              <Card className="mb-4 border-0 bg-warning bg-opacity-10">
                <Card.Body className="p-3">
                  <h3 className="mb-0">{stats.completionRate}%</h3>
                  <small className="text-muted">Completion Rate</small>
                </Card.Body>
              </Card>
              
              {/* Action Buttons */}
              {!isOwnProfile && (
                <>
                  <Button
                    variant={isFollowing ? "outline-secondary" : "primary"}
                    onClick={handleFollowToggle}
                    className="w-100 mb-2 d-flex align-items-center justify-content-center"
                    size="lg"
                  >
                    {isFollowing ? (
                      <>
                        <PersonDash className="me-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <PersonPlus className="me-2" />
                        Follow Trainer
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline-primary"
                    onClick={() => setShowContactModal(true)}
                    className="w-100 mb-2 d-flex align-items-center justify-content-center"
                  >
                    <ChatDots className="me-2" />
                    Message
                  </Button>
                  
                  <Button
                    variant="success"
                    onClick={handleBookSession}
                    className="w-100 mb-2 d-flex align-items-center justify-content-center"
                  >
                    <Calendar className="me-2" />
                    Book Session
                  </Button>
                  
                  <Button
                    variant="outline-dark"
                    onClick={handleShareProfile}
                    className="w-100 d-flex align-items-center justify-content-center"
                  >
                    <Share className="me-2" />
                    Share Profile
                  </Button>
                </>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Skills & Certifications Row */}
      <Row className="mb-4 g-4">
        {/* Skills */}
        <Col lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0 d-flex align-items-center">
                <Lightning className="me-2 text-warning" />
                Specializations
              </h5>
            </Card.Header>
            <Card.Body>
              {skills.map(renderSkillBar)}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Certifications */}
        <Col lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0 d-flex align-items-center">
                <Award className="me-2 text-primary" />
                Certifications
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {trainer.certifications?.map((cert, idx) => (
                  <Col key={idx} xs={12} md={6}>
                    <Card className="border-primary border-start border-3">
                      <Card.Body className="py-2">
                        <div className="d-flex align-items-center">
                          <CheckCircle className="text-success me-2" />
                          <div>
                            <h6 className="mb-0">{cert}</h6>
                            <small className="text-muted">Certified Trainer</small>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs Section */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        fill
      >
        <Tab eventKey="plans" title="Fitness Plans">
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Available Plans</h3>
              {isOwnProfile && (
                <Button variant="primary" onClick={() => navigate('/dashboard/plans/create')}>
                  <i className="bi bi-plus-lg me-2"></i>
                  Create New Plan
                </Button>
              )}
            </div>
            
            {plans.length === 0 ? (
              <Alert variant="info" className="text-center">
                <Alert.Heading>No plans available</Alert.Heading>
                <p>
                  {isOwnProfile 
                    ? "Start creating fitness plans to help users achieve their goals!" 
                    : "This trainer hasn't created any fitness plans yet."}
                </p>
                {isOwnProfile && (
                  <Button variant="primary" onClick={() => navigate('/dashboard')}>
                    Create Your First Plan
                  </Button>
                )}
              </Alert>
            ) : (
              <Row>
                {plans.map((plan) => (
                  <Col key={plan._id} lg={4} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm hover-shadow border-0">
                      {plan.featured && (
                        <div className="position-absolute top-0 start-0 m-3">
                          <Badge bg="warning" className="px-3 py-2">
                            🔥 Featured
                          </Badge>
                        </div>
                      )}
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="mb-1">{plan.title}</h5>
                            <p className="text-muted small mb-2">{plan.description}</p>
                          </div>
                          <Badge bg={plan.difficulty === 'BEGINNER' ? 'success' : plan.difficulty === 'INTERMEDIATE' ? 'warning' : 'danger'}>
                            {plan.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <Clock size={16} className="me-2 text-muted" />
                            <small className="text-muted">{plan.duration} days program</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <People size={16} className="me-2 text-muted" />
                            <small className="text-muted">{plan.subscribers?.length || 0} subscribers</small>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <span className="h4 mb-0">${plan.price}</span>
                            <small className="text-muted">/month</small>
                          </div>
                          <div className="d-flex align-items-center">
                            {renderStars(plan.rating || 4.5)}
                            <small className="ms-1">({plan.reviews || 24})</small>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline-primary"
                          onClick={() => navigate(`/plan/${plan._id}`)}
                          className="w-100"
                        >
                          View Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Tab>
        
        <Tab eventKey="testimonials" title="Testimonials">
          <div className="mt-4">
            <h4>Client Reviews</h4>
            {/* Add testimonials content here */}
          </div>
        </Tab>
        
        <Tab eventKey="followers" title="Followers">
          <div className="mt-4">
            <h4>Followers ({trainer.followers?.length || 0})</h4>
            {trainer.followers && trainer.followers.length > 0 ? (
              <Row className="g-3 mt-3">
                {trainer.followers.map((follower) => (
                  <Col key={follower._id} md={4} sm={6}>
                    <Card className="border-0 shadow-sm hover-shadow">
                      <Card.Body className="d-flex align-items-center p-3">
                        <div 
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                          style={{ width: '50px', height: '50px', color: 'white' }}
                        >
                          {follower.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h6 className="mb-0">{follower.name}</h6>
                          <small className="text-muted">{follower.email}</small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="info">
                <Alert.Heading>No followers yet</Alert.Heading>
                <p>Be the first to follow this trainer!</p>
              </Alert>
            )}
          </div>
        </Tab>
      </Tabs>

      {/* Contact Modal */}
      <Modal show={showContactModal} onHide={() => setShowContactModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Contact {trainer.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Your Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowContactModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSendMessage}>
            Send Message
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TrainerProfile;