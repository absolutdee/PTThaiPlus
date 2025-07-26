// src/components/common/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
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
    
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You can also log the error to an error reporting service
    // errorReportingService.captureException(error, { extra: errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
          <div className="text-center" style={{ maxWidth: '600px' }}>
            <div className="mb-4">
              <i 
                className="fas fa-exclamation-triangle text-warning" 
                style={{ fontSize: '4rem' }}
              />
            </div>
            
            <h2 className="mb-3" style={{ color: '#232956' }}>
              เกิดข้อผิดพลาดที่ไม่คาดคิด
            </h2>
            
            <p className="text-muted mb-4">
              ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้งหรือติดต่อทีมงานหากปัญหายังคงมีอยู่
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-light p-3 rounded mb-4 text-start">
                <h6 className="text-danger mb-2">Error Details:</h6>
                <pre style={{ fontSize: '0.75rem', color: '#dc3545' }}>
                  {this.state.error && this.state.error.toString()}
                </pre>
                {this.state.errorInfo.componentStack && (
                  <pre style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
            
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button 
                className="btn btn-primary"
                onClick={this.handleReset}
              >
                ลองใหม่
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={this.handleReload}
              >
                โหลดหน้าใหม่
              </button>
              <a 
                href="/" 
                className="btn btn-outline-secondary"
              >
                กลับหน้าหลัก
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
