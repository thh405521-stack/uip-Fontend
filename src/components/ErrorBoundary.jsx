import { Component } from 'react';
import Icon from './Icon';

/**
 * Wraps <Routes> in App.jsx. React error boundaries must be class
 * components (no hook equivalent). Any uncaught render error anywhere in
 * the tree shows a simple inline fallback instead of a blank screen.
 * Trimmed down from the full platform's ErrorBoundary: this standalone
 * build skips the full styled 500/404/403 ErrorPage system since it only
 * has two real screens (Login + Dashboard).
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 'var(--space-4)', padding: 'var(--space-6)', textAlign: 'center' }}>
          <Icon name="alert-triangle" size={40} />
          <h1 className="text-h2">Something broke on our end.</h1>
          <p className="text-small" style={{ color: 'var(--text-secondary)', maxWidth: 420 }}>
            This isn't something you did. Try again in a moment.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            <Icon name="refresh" size={16} /> Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
