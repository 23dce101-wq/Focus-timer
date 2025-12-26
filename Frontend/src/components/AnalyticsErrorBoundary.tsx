import { Component, ReactNode } from "react";

interface AnalyticsErrorBoundaryProps {
  children: ReactNode;
}

interface AnalyticsErrorBoundaryState {
  hasError: boolean;
}

/**
 * Simple error boundary around analytics/visualization components.
 * Prevents the entire page from crashing if a chart or worker-based
 * visualization throws, and logs details to the console.
 */
export class AnalyticsErrorBoundary extends Component<
  AnalyticsErrorBoundaryProps,
  AnalyticsErrorBoundaryState
> {
  state: AnalyticsErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: unknown): AnalyticsErrorBoundaryState {
    console.error("Analytics error boundary caught error:", error);
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("Analytics component stack:", info, "\nError:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="timer-card p-6">
          <h3 className="text-lg font-semibold mb-2">Analytics temporarily unavailable</h3>
          <p className="text-sm text-muted-foreground">
            Something went wrong while rendering your charts. Please refresh the
            page and try again. Your habit data is still safe.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
