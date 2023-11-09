import { EditOutlined, UserOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Space,
  Tooltip,
  Upload,
  UploadFile,
  UploadProps,
  message,
  notification
} from 'antd'
import ImgCrop from 'antd-img-crop'
import { UploadChangeParam, RcFile } from 'antd/es/upload'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth } from '~/application/hooks/useAuth'
import useFetchData from '~/application/hooks/useFetchData'
import { reFetchData } from '~/redux/slices'
import axiosClient from '~/utils/api/AxiosClient'
import { convertToFormData } from '~/utils/formDataUtils'
import { getBase64, getUserImage } from '~/utils/imageUtils'

interface RoleEntity {
  id: number
  name: string
}

interface User {
  createdAt: string
  updatedAt: string
  id: number
  fullName: string
  phoneNumber: string
  email: string
  address: string
  imageUrl: string
  roleEntity: RoleEntity
  emailVerified: boolean
  dob: string
  isActive: number
}
const Profile: React.FC = () => {
  const { changeImage } = useAuth()
  const [imageUrl, setImageUrl] = useState<string>('error')
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false)
  const [loadingUser, errorUser, responseUser] = useFetchData(`user/me`)
  const [user, setUser] = useState<User>(responseUser?.data)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [form] = Form.useForm()
  const [formPassword] = Form.useForm()
  const dispatch = useDispatch()

  const showModalPassword = () => {
    setIsModalPasswordOpen(true)
  }

  const handleOk = () => {
    setIsModalPasswordOpen(false)
  }

  const handleCancel = () => {
    setIsModalPasswordOpen(false)
  }
  const onChangeAvatar: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    console.log(info)
    getBase64(info.file.originFileObj as RcFile, (url) => {
      setImageUrl(url)
    })
  }
  const props: UploadProps = {
    showUploadList: false,
    onChange: onChangeAvatar,
    customRequest: async (options: any) => {
      try {
        const data = {
          imageFile: options.file
        }
        const response = await axiosClient.post('/user/uploadavatar', convertToFormData(data), {
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        if (response) {
          notification.success({ message: 'Cập nhật thành công' })
          changeImage(response.data.imageUrl)
          dispatch(reFetchData())
        } else {
          notification.error({ message: 'Cập nhật thất bại' })
        }
      } catch (err) {
        notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
      }
    },
    beforeUpload: (file: RcFile) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    }
  }
  useEffect(() => {
    if (!loadingUser && !errorUser && responseUser) {
      setUser(responseUser?.data)
      form.setFieldsValue({
        fullName: responseUser.data.fullName,
        email: responseUser.data.email,
        phoneNumber: responseUser.data.phoneNumber,
        address: responseUser.data.address,
        dob: dayjs(responseUser.data.dob)
      })
      setImageUrl(getUserImage(responseUser.data.imageUrl))
    }
  }, [loadingUser, errorUser, responseUser, form])

  const onUpdate = (values: any) => {
    setLoadingUpdate(true)
    const dayjs = values.dob as Dayjs
    values.dob = dayjs.format('YYYY-MM-DD') as string
    const payload = {
      fullName: values.fullName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      address: values.address,
      dob: values.dob
    }
    console.log(payload)
    axiosClient
      .put('/user', payload)
      .then((response) => {
        setLoadingUpdate(false)
        if (response) {
          notification.success({ message: 'Cập nhật thành công' })
          dispatch(reFetchData())
        } else {
          notification.error({ message: 'Cập nhật thất bại' })
        }
      })
      .catch((err) => {
        setLoadingUpdate(false)
        notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
      })
  }

  const onUpdatePassword = (values: any) => {
    setLoadingUpdate(false)
    const payload = {
      currentPassword: values.currentPassword,
      password: values.password,
      confirmedPassword: values.confirmedPassword
    }
    console.log(payload)
    axiosClient
      .put('/user', payload)
      .then((response) => {
        setLoadingUpdate(false)
        if (response) {
          notification.success({ message: 'Đổi mật khẩu thành công' })
          dispatch(reFetchData())
        } else {
          notification.success({ message: 'Đổi mật khẩu thất bại' })
        }
      })
      .catch((err) => {
        setLoadingUpdate(false)
        notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
      })
  }

  return (
    <div style={{ background: '#038777' }} className='flex flex-col-reverse space-y-10 lg:flex-row p-5 lg:p-10'>
      {/* View Chính */}
      <div className='lg:w-[10%]'></div>
      <div className='w-full md:w-[70%] lg:w-[60%] bg-white px-7 py-3 space-y-7'>
        <Form
          form={form}
          onFinish={onUpdate}
          labelCol={{ span: 5, style: { marginRight: '0%', textAlign: 'left' } }}
          wrapperCol={{ span: 18 }}
          layout='horizontal'
          style={{ maxWidth: '100%' }}
          className='space-y-5'
        >
          <div>
            <Space direction='vertical' size={16}>
              <Space wrap size={16}>
                <Avatar src={getUserImage(user?.imageUrl)} size='large' icon={<UserOutlined />} />
                <p>{user?.fullName}</p>
              </Space>
            </Space>
          </div>
          <div>
            <h1 className='text-2xl font-bold'>Thông tin hồ sơ</h1>
            <p>Quản lý thông tin để bảo mật tài khoản</p>
          </div>
          <div>
            <Form.Item label='Tên' name='fullName'>
              <Input type='text' />
            </Form.Item>
            <Form.Item label='Email' name='email'>
              <Input type='text' readOnly />
            </Form.Item>
            <Form.Item label='Số điện thoại' name='phoneNumber'>
              <Input type='number' maxLength={11} />
            </Form.Item>
            <Form.Item label='Địa chỉ' name='address'>
              <Input />
            </Form.Item>
            <Form.Item label='Ngày sinh' name='dob'>
              <DatePicker />
            </Form.Item>
            <div className='w-[90%] mx-auto'></div>

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
              <div className='relative'>
                <Avatar size={100} src={imageUrl} icon={<UserOutlined />} crossOrigin='anonymous' alt='user-image' />
                {/* user avatar change */}
                <div style={{ position: 'absolute', marginTop: '-6rem', marginLeft: '5rem' }}>
                  <ImgCrop
                    showGrid
                    cropShape='round'
                    rotationSlider
                    beforeCrop={(file: RcFile) => {
                      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
                      if (!isJpgOrPng) {
                        message.error('You can only upload JPG/PNG file!')
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2
                      if (!isLt2M) {
                        message.error('Image must smaller than 2MB!')
                      }

                      return isJpgOrPng && isLt2M
                    }}
                  >
                    <Upload {...props}>
                      <Tooltip title='Click to change Avatar'>
                        <Button icon={<EditOutlined />} type='default' shape='circle' />
                      </Tooltip>
                    </Upload>
                  </ImgCrop>
                </div>
              </div>

              <Button className='mb-2' onClick={showModalPassword}>
                Đổi mật khẩu
              </Button>
            </Space>
          </Space>
        </div>
      </div>

      {/* Đổi mật khẩu modal */}
      <Modal footer={null} title='Đổi mật khẩu' open={isModalPasswordOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          onFinish={onUpdatePassword}
          form={formPassword}
          name='dependencies'
          autoComplete='off'
          style={{ maxWidth: 600 }}
          layout='vertical'
        >
          <Form.Item
            label='Mật khẩu cũ'
            name='currentPassword'
            rules={[{ required: true, message: 'Điền mật khẩu cũ' }]}
          >
            <Input type='password' />
          </Form.Item>

          <Form.Item label='Mật khẩu mới' name='password' rules={[{ required: true, message: 'Điền mật khẩu mới' }]}>
            <Input type='password' />
          </Form.Item>

          {/* Field */}
          <Form.Item
            label='Xác nhận mật khẩu'
            name='confirmedPassword'
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
            <Button type='primary' loading={loadingUpdate} htmlType='submit' className='!w-full !bg-green-700'>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Profile
