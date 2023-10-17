import React from 'react'
import { Button, DatePicker, Form, Input } from 'antd'

type HomeProps = object

const Register: React.FC<HomeProps> = () => {
  return (
    <div className="min-h-screen md:min-h-[80vh] lg:min-h-0 flex lg:justify-center lg:p-8 lg:py-[4%] bg-[url('src/application/assets/images/background.jpg')] bg-[30%] bg-cover bg-no-repeat lg:bg-center">
      <div className='lg:w-[60%]'></div>
      <div className='lg:w-[30%] w-full bg-white bg-opacity-80 p-6 my-9 lg:my-auto h-fit lg:rounded-xl lg:py-5'>
        <h1 className='text-center text-3xl mb-5 font-bold'>Đăng ký</h1>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          layout='horizontal'
          style={{ maxWidth: '100%' }}
          className='space-y-5 '
        >
          <Form.Item
            label='Họ và tên '
            name='userName'
            rules={[{ required: true, message: 'Xin hãy điền họ và tên!' }]}
          >
            <Input type='text' />
          </Form.Item>
          <Form.Item
            label='Điện thoại'
            name='phoneNumber'
            rules={[{ required: true, message: 'Xin hãy điền số điện thoại' }]}
          >
            <Input type='number' />
          </Form.Item>
          <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Xin hãy điền email!' }]}>
            <Input type='text' />
          </Form.Item>
          <Form.Item label='Địa chỉ' name='address' rules={[{ required: true, message: 'Xin hãy điền địa chỉ!' }]}>
            <Input type='text' />
          </Form.Item>
          <Form.Item
            label='Ngày sinh'
            name='dateOfBirth'
            rules={[{ required: true, message: 'Xin hãy điền ngày sinh!' }]}
          >
            <DatePicker />
          </Form.Item>
          <div className='border-solid border-white border-t-2 w-[90%] m-auto'></div>
          <Form.Item label='Mật khẩu' name='password' rules={[{ required: true, message: 'Xin hãy điền mật khẩu!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label='Xác nhận mật khẩu'
            name='acptPassword'
            rules={[{ required: true, message: 'Xin hãy xác nhận mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 100 }} className='md:w-full'>
            <Button htmlType='submit' className='!w-[70%] m-auto !bg-green-700 !text-white !flex !justify-center'>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className='lg:w-[10%]'></div>
    </div>
  )
}

export default Register
