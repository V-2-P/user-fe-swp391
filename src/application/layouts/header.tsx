import React from 'react'
import { Layout, Image, Avatar, Dropdown, Space, Button, Flex, Grid } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import Menu from './menu'
import type { MenuProps } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '~/application/hooks/reduxHook'
import { logout } from '~/redux/slices'
import { useAuth } from '../hooks/useAuth'
import { getUserImage } from '~/utils/imageUtils'
const { useBreakpoint } = Grid
const Header: React.FC = () => {
  const screens = useBreakpoint()
  const { account } = useAuth()
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
        <Link className='flex justify-center items-center' to='/order'>
          Đơn hàng
        </Link>
      ),
      key: '/order'
    },
    {
      type: 'divider'
    },
    {
      label: (
        <Link className='flex justify-center items-center' to='/booking'>
          Đơn lai chim
        </Link>
      ),
      key: '/booking'
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
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
      className=' !bg-[#D9D9D9] !w-full'
    >
      <div className='w-1/3'></div>
      <Flex justify={screens.sm ? 'center' : 'flex-start'} align={'center'} className='w-full'>
        <Link to='/'>
          <div className='w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center text-sky-800 font-bold text-lg'>
            <Image src='/Logo.png' preview={false} />
          </div>
        </Link>
        <Menu />
      </Flex>
      <div className='w-1/3'>
        {!account.isLogin ? (
          <Space size='large'>
            <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
            {screens.md && <Button onClick={() => navigate('/register')}>Đăng kí</Button>}
          </Space>
        ) : (
          <Dropdown menu={{ items }} trigger={['click']} placement='bottomRight' className='cursor-pointer'>
            <Avatar
              size='large'
              src={getUserImage(account.imageUrl)}
              icon={<UserOutlined />}
              crossOrigin='anonymous'
              alt='user-image'
            />
          </Dropdown>
        )}
      </div>
    </Layout.Header>
  )
}

export default Header
