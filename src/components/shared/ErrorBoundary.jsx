import { Component } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

/**
 * Error Boundary: Catches React component errors and prevents full app crash
 * Shows user-friendly error UI with recovery option
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in development
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)

    // Update state to show error UI
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }))
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h1 className="text-xl font-bold text-red-600">Something Went Wrong</h1>
            </div>

            <p className="text-gray-600 mb-4">
              An unexpected error occurred. Don't worry—we've logged this issue and will investigate.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 rounded p-3 mb-4 text-xs text-gray-700 overflow-auto max-h-40 border border-gray-300">
                <p className="font-mono font-semibold mb-2">Error Details:</p>
                <p className="font-mono">{this.state.error.toString()}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Go Home
              </button>
            </div>

            {this.state.errorCount > 2 && (
              <p className="text-xs text-gray-500 mt-4">
                This error has occurred multiple times. Try refreshing the page or clearing your browser cache.
              </p>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
