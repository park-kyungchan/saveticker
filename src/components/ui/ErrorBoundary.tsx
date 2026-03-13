import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div role="alert" className="flex flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="font-medium text-ink">문제가 발생했습니다</p>
          <p className="text-sm text-ink-muted">{this.state.error?.message ?? "알 수 없는 오류"}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-sm text-brand hover:underline active:opacity-70 min-h-[44px] px-4"
          >
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
