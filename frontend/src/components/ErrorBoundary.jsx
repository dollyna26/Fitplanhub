import React, { Component } from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Something went wrong!</Alert.Heading>
            <p>
              We apologize for the inconvenience. Please try refreshing the page 
              or contact support if the problem persists.
            </p>
            <hr />
            <div className="d-flex justify-content-between">
              <Button variant="outline-danger" onClick={this.handleReset}>
                Refresh Page
              </Button>
              <Button variant="danger" href="/">
                Go to Homepage
              </Button>
            </div>
          </Alert>
          
          {process.env.NODE_ENV === 'development' && (
            <Alert variant="secondary" className="mt-3">
              <Alert.Heading>Error Details (Development Only):</Alert.Heading>
              <pre className="mt-3" style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                {this.state.error && this.state.error.toString()}
                <br /><br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </Alert>
          )}
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;