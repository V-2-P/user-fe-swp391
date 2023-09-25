import { Result } from 'antd'
import React from 'react'
interface ErrorProps {
  error?: string
}

const ErrorPage: React.FC<ErrorProps> = ({ error }) => (
  <Result status='500' title='500' subTitle={error ? error : 'Sorry, something went wrong.'} />
)

export default ErrorPage
