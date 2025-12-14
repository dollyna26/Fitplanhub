import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
  <Container fluid className="px-4">
    <Navbar.Brand as={Link} to="/">
      <span className="fw-bold text-warning">FitPlan</span>
      <span className="text-light">Hub</span>
    </Navbar.Brand>

    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link as={Link} to="/">Home</Nav.Link>

        {isAuthenticated && (
          <>
            {user?.isTrainer ? (
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/feed">My Feed</Nav.Link>
            )}
            <Nav.Link as={Link} to={`/trainer/${user?._id}`}>Profile</Nav.Link>
          </>
        )}
      </Nav>

      <Nav>
        {isAuthenticated ? (
          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-light">
              <i className="bi bi-person-circle me-2"></i>
              {user?.name}
              {user?.isTrainer && (
                <span className="badge bg-warning ms-2">Trainer</span>
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={`/trainer/${user?._id}`}>
                My Profile
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item onClick={handleLogout}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <>
            <Button variant="outline-light" className="me-2" as={Link} to="/login">
              Login
            </Button>
            <Button variant="warning" as={Link} to="/register">
              Sign Up
            </Button>
          </>
        )}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

  );
};

export default CustomNavbar;