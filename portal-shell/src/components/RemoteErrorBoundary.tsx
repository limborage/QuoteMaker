import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; }

export default class RemoteErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Shell] Intercepted a remote MFE loading failure:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: '20px', background: '#7f1d1d', color: '#fca5a5', borderRadius: '8px' }}>
          ⚠️ The Quote Service is temporarily unavailable. Our engineers have been notified.
        </div>
      );
    }
    return this.props.children;
  }
}