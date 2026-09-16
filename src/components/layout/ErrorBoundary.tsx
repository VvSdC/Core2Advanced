import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  /** When this value changes, the boundary resets (e.g. pass the lesson id). */
  resetKey?: string
  /** Optional custom fallback renderer. */
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface the error in the console for debugging.
    console.error('Lesson render error:', error, info.componentStack)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset the boundary when navigating to a different lesson/page.
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state

    if (error) {
      if (this.props.fallback) {
        return this.props.fallback(error, this.reset)
      }

      return (
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 md:p-8">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wider">
                This page hit an error
              </p>
            </div>
            <h1 className="mt-3 text-xl font-bold text-white md:text-2xl">
              Something went wrong while rendering this content
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              The link is valid, but this particular lesson failed to render. You can try again, or
              use the sidebar to open a different lesson.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-surface-600 bg-surface-900 p-3 font-mono text-xs text-slate-400">
              <code>{error.message}</code>
            </pre>
            <button
              type="button"
              onClick={this.reset}
              className="mt-5 inline-flex items-center rounded-lg border border-surface-600 bg-surface-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-accent-500/40 hover:bg-surface-700"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
