import React from 'react'
import { Layout, Image, Avatar, Dropdown } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import Menu from './menu'
import type { MenuProps } from 'antd'
const items: MenuProps['items'] = [
  {
    label: <a href='https://www.antgroup.com'>1st menu item</a>,
    key: '0'
  },
  {
    label: <a href='https://www.aliyun.com'>2nd menu item</a>,
    key: '1'
  },
  {
    type: 'divider'
  },
  {
    label: '3rd menu item',
    key: '3'
  }
]
const Header: React.FC = () => {
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
        <div className='w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center text-sky-800 font-bold text-lg'>
          <Image src='/Logo.png' preview={false} />
        </div>
        <div className='min-w-[23rem] custom-ant-menu custome.ant-button'>
          <Menu />
        </div>
        <div className='absolute right-0 cursor-pointer'>
          <Dropdown menu={{ items }} trigger={['click']}>
            <Avatar size='large' icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </div>
    </Layout.Header>
  )
}

export default Header
