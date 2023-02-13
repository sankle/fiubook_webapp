import { HttpError } from 'found';
import React from 'react';
import ErrorPage from './Pages/ErrorPage/ErrorPage';

interface Props {
  children: any;
}

interface State {
  hasError: boolean;
  error: Error | HttpError | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary');

    // Update state so the next render will show the fallback UI.
    return { error, hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
