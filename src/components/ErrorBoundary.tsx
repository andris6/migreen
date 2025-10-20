
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>We are sorry for the inconvenience. Please try refreshing the page.</p>
          </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
