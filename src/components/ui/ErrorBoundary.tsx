import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Optional error reporter — 프로덕션에서는 Sentry 등에 연결 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

const MAX_RETRIES = 3;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);

    // Report to external service if handler provided
    this.props.onError?.(error, info);
  }

  private handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const canRetry = this.state.retryCount < MAX_RETRIES;

      return (
        <div role="alert" className="flex flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl border glass-panel" aria-hidden="true">
            <svg className="size-5 text-danger/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="font-medium text-ink">문제가 발생했습니다</p>
          <p className="text-sm text-ink-muted max-w-[260px]">
            {this.state.error?.message ?? "알 수 없는 오류"}
          </p>
          {canRetry ? (
            <button
              type="button"
              onClick={this.handleRetry}
              className="text-sm text-brand hover:underline active:opacity-70 min-h-[44px] px-4"
            >
              다시 시도 ({MAX_RETRIES - this.state.retryCount}회 남음)
            </button>
          ) : (
            <p className="text-xs text-ink-muted/60">
              문제가 지속됩니다. 앱을 다시 시작해주세요.
            </p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
