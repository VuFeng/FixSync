import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { ROUTES } from "../constants";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="bg-surface border-border p-8 max-w-2xl w-full">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-red-500/20 p-3 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  Something went wrong
                </h1>
                <p className="text-text-secondary mb-4">
                  An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                </p>
                {this.state.error && (
                  <div className="bg-surface-secondary p-4 rounded-lg border border-border mb-4">
                    <p className="text-sm font-mono text-danger mb-2">
                      {this.state.error.toString()}
                    </p>
                    {import.meta.env.DEV && this.state.errorInfo && (
                      <details className="mt-2">
                        <summary className="text-xs text-text-tertiary cursor-pointer">
                          Stack trace
                        </summary>
                        <pre className="text-xs text-text-tertiary mt-2 overflow-auto max-h-48">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleReset}
                className="bg-primary hover:bg-primary-dark"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                className="border-border"
                onClick={() => (window.location.href = ROUTES.DASHBOARD)}
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

