// client/src/app/error-boundary.tsx

import { Component, type ErrorInfo, type ReactNode } from "react";

import { logger } from "../lib/logger";
import { ErrorBoundaryFallback } from "../components/feedback/ErrorBoundaryFallback";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error("Unhandled React rendering error", error, {
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}
