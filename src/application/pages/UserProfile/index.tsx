import { PlusOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input, Modal, Space } from 'antd'
import React, { useState } from 'react'

const Profile: React.FC = () => {
  const [file, setFile] = useState<any | null>(null)
  function handleChange(e: any) {
    setFile(URL.createObjectURL(e.target.files[0]))
  }
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false)
  const [isModalAdressOpen, setIsModalAddressOpen] = useState(false)

  const [form] = Form.useForm()

  const showModalPassword = () => {
    setIsModalPasswordOpen(true)
  }
  const showModalAddress = () => {
    setIsModalAddressOpen(true)
  }

  const handleOk = () => {
    setIsModalPasswordOpen(false)
  }

  const handleOkAddress = () => {
    setIsModalAddressOpen(false)
  }

  const handleCancel = () => {
    setIsModalPasswordOpen(false)
  }

  const handleCancleAddress = () => {
    setIsModalAddressOpen(false)
  }

  return (
    <div style={{ background: '#038777' }} className='flex flex-col-reverse space-y-10 lg:flex-row p-5 lg:p-10'>
      {/* View Chính */}
      <div className='lg:w-[10%]'></div>
      <div className='w-full md:w-[70%] lg:w-[60%] bg-white px-7 py-3 space-y-7'>
        <Form
          labelCol={{ span: 5, style: { marginRight: '0%', textAlign: 'left' } }}
          wrapperCol={{ span: 18 }}
          layout='horizontal'
          style={{ maxWidth: '100%' }}
          className='space-y-5'
        >
          <div>
            <Space direction='vertical' size={16}>
              <Space wrap size={16}>
                <Avatar src={file} size='large' icon={<UserOutlined />} />
                <p>Tên người dùng</p>
              </Space>
            </Space>
          </div>
          <div>
            <h1 className='text-2xl font-bold'>Thông tin hồ sơ</h1>
            <p>Quản lý thông tin để bảo mật tài khoản</p>
          </div>
          <div>
            <Form.Item label='Tên đăng nhập' name='userName'>
              <Input type='text' defaultValue='Tên đăng nhập của người dùng' readOnly />
            </Form.Item>
            <Form.Item label='Tên' name='fullName'>
              <Input type='text' defaultValue={'Họ và tên người dùng'} />
            </Form.Item>
            <Form.Item label='Email' name='email'>
              <Input type='text' defaultValue={'***' + '@' + 'gmail.com'} />
            </Form.Item>
            <Form.Item label='Số điện thoại' name='phoneNumber'>
              <Input type='number' maxLength={11} defaultValue={'0123456789'} />
            </Form.Item>
            <div className='w-[90%] mx-auto border border-solid border-t-black'></div>
            <Form.Item className='!mt-5' label='Thông tin địa chỉ' name='address'>
              <Button
                className='!bg-green-800 !rounded-none !text-white md:!ml-[55%] lg:!ml-[75%]'
                onClick={showModalAddress}
                icon={<PlusOutlined />}
              >
                Thêm địa chỉ mới
              </Button>
            </Form.Item>
            <div className='flex flex-col lg:flex-row'>
              <div className='w-[50%] flex-col'>
                <p>Tên người dùng | Số điện thoại</p>
                <p>Địa chỉ</p>
                <p>Địa chỉ</p>
              </div>
              <div className='w-[50%] flex space-x-5 mt-6'>
                <div className='w-[50%]'>
                  <Form.Item wrapperCol={{ span: 100 }}>
                    <Button
                      htmlType='submit'
                      className='!w-[100%] m-auto !bg-gray-500 !text-white !flex !justify-center'
                    >
                      Cập nhật
                    </Button>
                  </Form.Item>
                </div>
                <div className='w-[39%]'>
                  <Form.Item wrapperCol={{ span: 100 }}>
                    <Button
                      htmlType='submit'
                      className='!w-[100%] m-auto !bg-gray-500 !text-white !flex !justify-center'
                    >
                      Xóa
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className='w-[90%] mx-auto border border-solid border-t-black'></div>
            <div className='mt-5'>
              <Form.Item wrapperCol={{ span: 100 }}>
                <Button htmlType='submit' className='!w-[20%] m-auto !bg-green-800 !text-white !flex !justify-center'>
                  Lưu
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
      <div className='w-full lg:w-[30%] flex justify-center'>
        <div className='flex items-center'>
          <Space direction='vertical' size={64}>
            <Space className='flex !flex-col' wrap size={32}>
              <Avatar src={file} size={128} icon={<UserOutlined />} />
              <input type='file' onChange={handleChange} />
              <Button className='mb-2' onClick={showModalPassword}>
                Đổi mật khẩu
              </Button>
            </Space>
          </Space>
        </div>
      </div>

      {/* Đổi mật khẩu modal */}
      <Modal footer={null} title='Đổi mật khẩu' open={isModalPasswordOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} name='dependencies' autoComplete='off' style={{ maxWidth: 600 }} layout='vertical'>
          <Form.Item label='Mật khẩu cũ' name='oldPassword' rules={[{ required: true, message: 'Điền mật khẩu cũ' }]}>
            <Input type='password' />
          </Form.Item>

          <Form.Item label='Mật khẩu mới' name='newPassword' rules={[{ required: true, message: 'Điền mật khẩu mới' }]}>
            <Input type='password' />
          </Form.Item>

          {/* Field */}
          <Form.Item
            label='Xác nhận mật khẩu'
            name='password2'
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Xác nhận mật khẩu'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu không trùng'))
                }
              })
            ]}
          >
            <Input type='password' />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 100 }}>
            <Button type='primary' htmlType='submit' className='!w-full !bg-green-700'>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Thêm địa chỉ */}
      <Modal
        footer={null}
        title='Thêm địa chỉ'
        open={isModalAdressOpen}
        onOk={handleOkAddress}
        onCancel={handleCancleAddress}
      >
        <Form form={form} name='dependencies' autoComplete='off' style={{ maxWidth: 600 }} layout='vertical'>
          <Form.Item name={'number'} label={'Số nhà'} rules={[{ required: true, message: 'Hãy nhập số nhà' }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'ward'} label={'Phường/Xã'} rules={[{ required: true, message: 'Hãy nhập Phường/Xã' }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'district'} label={'Huyện'} rules={[{ required: true, message: 'Hãy nhập huyện' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={'province'}
            label={'Tỉnh/Thành phố'}
            rules={[{ required: true, message: 'Hãy nhập Tỉnh/Thành phố' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 100 }}>
            <Button type='primary' htmlType='submit' className='!w-full !bg-green-700'>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Profile
