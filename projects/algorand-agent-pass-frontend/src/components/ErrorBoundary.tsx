import React, { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="app-shell">
          <div className="page-wrap">
            <div className="error-state neo-card">
              <p className="section-kicker">Environment issue</p>
              <h1 className="error-state__title">AgentPass hit a frontend error</h1>
              <p className="error-state__copy">
                {this.state.error?.message.includes('Attempt to get default algod configuration')
                  ? 'Please make sure to set up your environment variables correctly. Create a .env file based on .env.template and fill in the required values. This controls the network and credentials for connections with Algod and Indexer.'
                  : this.state.error?.message}
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
