import { Component, ReactNode } from 'react'
import { Error } from '~/application/pages'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  errorText: string
}

class ErrorBoundary extends Component<Props, State> {
  state = {
    hasError: false,
    errorText: ''
  }

  static getDerivedStateFromError(error: any): State {
    return {
      hasError: true,
      errorText: error.toString()
    }
  }

  render() {
    const { hasError, errorText } = this.state

    if (hasError) {
      return <Error error={errorText} />
    }

    return this.props.children
  }
}

export default ErrorBoundary
