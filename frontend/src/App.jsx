import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ToastNotification from './components/ToastNotification.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import TrainerDashboard from './pages/TrainerDashboard.jsx';
import PlanDetails from './pages/PlanDetails.jsx';
import UserFeed from './pages/UserFeed.jsx';
import TrainerProfile from './pages/TrainerProfile.jsx';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Navbar />

          {/* NO container here */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['trainer']}>
                  <TrainerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/plan/:id"
              element={
                <ProtectedRoute>
                  <PlanDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <UserFeed />
                </ProtectedRoute>
              }
            />

            <Route
              path="/trainer/:id"
              element={
                <ProtectedRoute>
                  <TrainerProfile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <ToastNotification />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}


export default App;