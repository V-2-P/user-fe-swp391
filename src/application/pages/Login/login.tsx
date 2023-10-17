import React from 'react'
import { Button, Form, Input } from 'antd'
import { Link } from 'react-router-dom'

const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

type FieldType = {
  username?: string
  password?: string
  remember?: string
}

const LoginPage: React.FC = () => {
  return (
    <div className='lg:m-0 w-full'>
      <h1 className='font-semibold text-3xl mb-5 text-center mt-3 lg:mt-0'>Đăng nhập</h1>
      <div className='flex flex-col mx-10'>
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 100 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
          className='space-y-5'
        >
          <Form.Item<FieldType> name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input placeholder='Username' className='!border-black !border-2 w-full' />
          </Form.Item>

          <Form.Item<FieldType> name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder='Password' className='!border-black !border-2' />
          </Form.Item>

          <div>
            <Link to={'/'}>Quên tài khoản/mật khẩu</Link>
          </div>

          <Form.Item wrapperCol={{ span: 100 }}>
            <Button type='primary' htmlType='submit' className='!w-full !bg-green-700'>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
