import React from 'react'
import { Button, Form, Input, App } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '~/application/hooks/reduxHook'
import { loginAsync } from '~/redux/slices'

type FieldType = {
  email?: string
  password?: string
}

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { notification, message } = App.useApp()
  const { isLoading } = useAppSelector((state) => state.account)
  const onFinish = async (values: FieldType) => {
    try {
      const payload = {
        email: values.email,
        password: values.password
      }
      await dispatch(loginAsync(payload)).unwrap()
      form.resetFields()
      notification.success({ message: `Chào mừng bạn đến với BFS` })
      navigate('/userprofile')
    } catch (err) {
      notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
    for (let i = 0; i < errorInfo.errorFields.length; i++) {
      message.error(errorInfo.errorFields[i].errors[0])
      return
    }
  }

  return (
    <div className='lg:m-0 w-full'>
      <h1 className='font-semibold text-3xl mb-5 text-center mt-3 lg:mt-0'>Đăng nhập</h1>
      <div className='flex flex-col mx-10'>
        <Form
          form={form}
          name='loginForm'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 100 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
          className='space-y-5'
        >
          <Form.Item<FieldType> name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input placeholder='Email' className='!border-black !border-2 w-full' />
          </Form.Item>

          <Form.Item<FieldType> name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder='Password' className='!border-black !border-2' />
          </Form.Item>

          <div>
            <Link to={'/'}>Quên tài khoản/mật khẩu</Link>
          </div>

          <Form.Item wrapperCol={{ span: 100 }}>
            <Button type='primary' htmlType='submit' loading={isLoading} className='!w-full !bg-green-700'>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
