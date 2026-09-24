import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
  errorStack?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
      errorStack: error.stack,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error({ error, errorInfo });
  }

  handleTryAgain = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="app-height flex items-center justify-center overflow-y-auto p-6">
        <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-serif text-xl font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            This is often a temporary connection problem. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={this.handleTryAgain}
            className="inline-flex h-10 w-fit items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Reload Grade.me
          </button>
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer">Error details for support</summary>
            <p className="mt-2 font-medium">{this.state.errorMessage}</p>
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-2">
              {this.state.errorStack}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
