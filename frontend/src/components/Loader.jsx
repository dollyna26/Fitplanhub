import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  const loaderContent = (
    <div className="text-center py-5">
      <Spinner 
        animation="border" 
        role="status" 
        variant="primary"
        style={{ width: '3rem', height: '3rem' }}
      >
        <span className="visually-hidden">{message}</span>
      </Spinner>
      {message && (
        <p className="mt-3 text-muted">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        {loaderContent}
      </Container>
    );
  }

  return loaderContent;
};

export default Loader;