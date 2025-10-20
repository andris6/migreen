'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Logo } from '@/components/layout/Logo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  showDialog: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    showDialog: false,
  };

  public static getDerivedStateFromError(_: Error): Partial<State> {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    setTimeout(() => {
      this.setState({ showDialog: true });
    }, 5000);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Dialog open={this.state.showDialog}>
          <DialogContent className="sm:max-w-[425px]" hideCloseButton={true}>
            <DialogHeader>
              <DialogTitle className="flex flex-col items-center justify-center text-center">
                <Logo className="mb-6 text-5xl justify-center" />
                Something went wrong.
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
