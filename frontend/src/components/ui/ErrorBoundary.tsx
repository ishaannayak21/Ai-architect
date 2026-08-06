import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error cleanly in production
    console.error("Uncaught Error Boundary Exception:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center shadow-sm">
          <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <AlertTriangle className="size-6" />
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Something went wrong rendering this section
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">
            An unexpected application error occurred. Click below to reset the interface.
          </p>
          <Button
            variant="secondary"
            onClick={this.handleReset}
            className="mt-5"
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
