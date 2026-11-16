import { Component, type ErrorInfo, type ReactNode } from "react";

const RELOAD_AFTER_MS = 10000;

interface State {
  failed: boolean;
}

/**
 * The dashboard runs unattended on a wall display. If any render throws, React
 * unmounts the whole tree and leaves a blank screen forever, so show a short
 * notice and reload the page to recover on its own.
 */
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  state: State = { failed: false };
  private timer: ReturnType<typeof setTimeout> | null = null;

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Dashboard render failed:", error, info.componentStack);
    this.timer = setTimeout(() => window.location.reload(), RELOAD_AFTER_MS);
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-screen w-screen items-center justify-center p-6">
          <p className="text-3xl font-semibold text-(--color-fg-muted)">
            Anzeigefehler – Seite wird neu geladen …
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
