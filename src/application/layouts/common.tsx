import React from 'react'
import { Layout } from 'antd'
import Footer from './footer'
import Header from './header'
import { Outlet } from 'react-router-dom'
const { Content } = Layout

const CommonLayout: React.FC = () => {
  return (
    <Layout>
      <Header />
      <Content className='!bg-[#D9EEE1]' style={{ minHeight: 'calc(100vh - 134px)' }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}

export default CommonLayout
