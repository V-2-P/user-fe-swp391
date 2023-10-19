import React from 'react'
import { Layout, Image, Avatar, Dropdown, Space, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import Menu from './menu'
import type { MenuProps } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/application/hooks/reduxHook'
import { logout } from '~/redux/slices'

const Header: React.FC = () => {
  const { isLogin } = useAppSelector((state) => state.account)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const items: MenuProps['items'] = [
    {
      label: <Link to='/userprofile'>Thông tin cá nhân</Link>,
      key: '/userprofile'
    },
    {
      type: 'divider'
    },
    {
      label: (
        <Button type='link' className='w-full' onClick={() => dispatch(logout())}>
          Logout
        </Button>
      ),
      key: '3'
    }
  ]
  return (
    <Layout.Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        width: '100%'
      }}
      className='flex items-center justify-center gap-10 !bg-[#D9D9D9]'
    >
      <div className='w-full relative flex items-center justify-center'>
        <Link to='/'>
          <div className='w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center text-sky-800 font-bold text-lg'>
            <Image src='/Logo.png' preview={false} />
          </div>
        </Link>
        <div className='min-w-[23rem] custom-ant-menu custome.ant-button'>
          <Menu />
        </div>
        <div className='absolute right-0 cursor-pointer'>
          {!isLogin ? (
            <Space size='middle'>
              <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
              <Button onClick={() => navigate('/register')}>Đăng kí</Button>
            </Space>
          ) : (
            <Dropdown menu={{ items }} trigger={['click']}>
              <Avatar size='large' icon={<UserOutlined />} />
            </Dropdown>
          )}
        </div>
      </div>
    </Layout.Header>
  )
}

export default Header
