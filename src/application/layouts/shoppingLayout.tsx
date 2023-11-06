import React from 'react'
import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import Header from '~/application/layouts/header'
import { Outlet } from 'react-router-dom'
import Search from './search'
const ShoppingLayout: React.FC = () => {
  return (
    <Layout>
      <Header />
      <Layout style={{ minHeight: 'calc(100vh - 70px)' }}>
        <Sider
          className='!bg-gray-300  customside'
          width={250}
          style={{
            overflow: 'auto',
            // height: 'calc(100vh - 70px)',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0
          }}
        >
          <Search />
        </Sider>
        <Layout style={{ marginLeft: 250 }}>
          <Content style={{ overflow: 'initial', background: '#bdd4cd', padding: 36 }}>
            <Outlet />
          </Content>
          <Layout.Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Layout.Footer>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default ShoppingLayout
