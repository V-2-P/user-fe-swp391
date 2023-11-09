import { MailOutlined } from '@ant-design/icons'
import { App, Button, Form, Input } from 'antd'
import { Link } from 'react-router-dom'

import React, { useState } from 'react'
import axiosClient from '~/utils/api/AxiosClient'

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const { notification } = App.useApp()
  const onFinish = (values: any) => {
    setLoading(true)
    axiosClient
      .put(`/auth/forgotpassword?email=${values.email}`)
      .then((response) => {
        setLoading(false)
        if (response) {
          notification.success({ message: `Vui lòng check mail` })
        }
      })
      .catch((err) => {
        setLoading(false)
        notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
      })
  }

  return (
    <div style={{ width: '400px', height: 'calc(100vh - 205px)', margin: '0 auto' }}>
      <Form
        form={form}
        style={{ paddingTop: '200px' }}
        initialValues={{ remember: true }}
        name='forgot-password-form'
        onFinish={onFinish}
      >
        <Form.Item
          name='email'
          rules={[
            {
              required: true,
              message: 'Please input your Email!'
            }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder='Email' size='large' />
        </Form.Item>

        <Form.Item>
          <Button htmlType='submit' type='primary' size='large' block loading={loading} disabled={loading}>
            Forgot Password
          </Button>
        </Form.Item>

        <Link className='!btn-login-registration' to='/login'>
          Or Login Here!
        </Link>
      </Form>
    </div>
  )
}

export default ForgotPasswordPage
