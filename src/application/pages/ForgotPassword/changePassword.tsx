import { App, Button, Form, Input } from 'antd'

import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axiosClient from '~/utils/api/axiosClient'

const ChangePassword: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { notification, message } = App.useApp()
  const userId = searchParams.get('userId')
  const token = searchParams.get('token')
  const onFinish = (values: any) => {
    setLoading(true)
    axiosClient
      .put(`/auth/setpassword?userId=${userId}&token=${token}`, values)
      .then((response) => {
        setLoading(false)
        if (response) {
          notification.success({ message: `Mật khẩu đã được thay đổi` })
          navigate('/login')
        }
      })
      .catch((err) => {
        setLoading(false)
        notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
      })
  }
  const onFinishFailed = async (errorInfo: any) => {
    for (let i = 0; i < errorInfo.errorFields.length; i++) {
      message.error(errorInfo.errorFields[i].errors[0])
      return
    }
  }
  return (
    <div style={{ width: '400px', height: 'calc(100vh - 205px)', margin: '0 auto' }}>
      <Form
        form={form}
        style={{ paddingTop: '200px' }}
        initialValues={{ remember: true }}
        name='forgot-password-form'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu!'
            }
          ]}
        >
          <Input.Password placeholder='Mật khẩu' size='large' />
        </Form.Item>
        <Form.Item
          name='confirmedPassword'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu!'
            }
          ]}
        >
          <Input.Password placeholder='Xác thực mật khẩu' size='large' />
        </Form.Item>

        <Form.Item>
          <Button htmlType='submit' type='primary' size='large' block loading={loading} disabled={loading}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ChangePassword
