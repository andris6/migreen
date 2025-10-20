'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Logo } from '@/components/layout/Logo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

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
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Dialog open={this.state.hasError} onOpenChange={() => this.setState({ hasError: false })}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex flex-col items-center justify-center text-center">
                <Logo className="mb-6 text-5xl justify-center" />
                Something went wrong.
              </DialogTitle>
              <DialogDescription className="text-center">
                An unexpected error occurred. Please reload the page to continue.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={this.handleReload} className="w-full">Reload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
