import React from 'react'
import { Menu as AntMenu, Button, ConfigProvider, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'

type MenuItem = Required<MenuProps>['items'][number]
const { Text } = Typography
function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, type?: 'group'): MenuItem {
  return {
    key,
    icon,
    label,
    type
  } as MenuItem
}
const items: MenuItem[] = [
  getItem(
    <Text strong className='strong-shadow !text-[#000]'>
      Trang chủ
    </Text>,
    '/'
  ),
  getItem(
    <Text strong className='strong-shadow !text-[#000]'>
      Shop
    </Text>,
    '/productlist'
  ),
  getItem(
    <Button type='link' className='!bg-[#213F36]'>
      <Text strong className='!text-[#FFF] strong-shadow'>
        Giỏ hàng / Thanh toán
      </Text>
    </Button>,
    '/shoppingcart'
  )
]

const Menu: React.FC = () => {
  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            colorPrimary: 'transparent'
          }
        }
      }}
    >
      <AntMenu mode='horizontal' selectedKeys={[]} onClick={onClick} items={items} className='!bg-[#D9D9D9]' />
    </ConfigProvider>
  )
}

export default Menu
