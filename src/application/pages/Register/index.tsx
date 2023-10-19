import React, { useState } from 'react'
import { Button, DatePicker, Form, Input, App } from 'antd'
import axiosClient from '~/utils/api/AxiosClient'
import { useNavigate } from 'react-router-dom'

type HomeProps = object

const Register: React.FC<HomeProps> = () => {
  const [loading, setLoading] = useState(false)
  const { notification, message } = App.useApp()
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    setLoading(true)
    const dateOfBirth = new Date(values.dateOfBirth)

    const day = dateOfBirth.getDate().toString().padStart(2, '0') // Lấy ngày và định dạng thành 2 chữ số
    const month = (dateOfBirth.getMonth() + 1).toString().padStart(2, '0') // Lấy tháng và định dạng thành 2 chữ số (cộng thêm 1 vì tháng trong JavaScript bắt đầu từ 0)
    const year = dateOfBirth.getFullYear()
    const formattedDate = `${year}-${month}-${day}`
    const payload = {
      fullName: values.userName,
      email: values.email,
      phone: values.phoneNumber,
      dob: formattedDate,
      address: values.address,
      confirmPassword: values.acptPassword,
      password: values.password
    }
    console.log(payload)
    axiosClient
      .post('/auth/signup', payload)
      .then((response) => {
        setLoading(false)
        if (response) {
          notification.success({ message: 'Your registration successful' })
          form.resetFields()
          navigate('/login')
        } else {
          notification.error({ message: 'Sorry! Something went wrong. App server error' })
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
    <div
      id='register'
      className="min-h-screen md:min-h-[80vh] lg:min-h-screen flex lg:justify-center lg:p-8 lg:py-[4%] bg-[url('src/application/assets/images/background.jpg')] bg-[30%] bg-cover bg-no-repeat lg:bg-center"
    >
      <div className='lg:w-[60%]'></div>
      <div className='lg:w-[30%] w-full bg-white bg-opacity-80 p-6 my-9 lg:my-auto h-fit lg:rounded-xl lg:py-5'>
        <h1 className='text-center text-3xl mb-5 font-bold'>Đăng ký</h1>
        <Form
          form={form}
          name='registerForm'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          layout='horizontal'
          style={{ maxWidth: '100%' }}
          className='space-y-5 '
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
            <Button
              htmlType='submit'
              loading={loading}
              className='!w-[70%] m-auto !bg-green-700 !text-white !flex !justify-center'
            >
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
