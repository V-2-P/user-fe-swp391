import { Layout, Spin } from 'antd'
import React from 'react'
import Header from '~/application/layouts/header'
import Footer from '~/application/layouts/footer'

const { Content } = Layout

const Loading: React.FC = () => {
  return (
    <Layout>
      <Header />
      <Content style={{ minHeight: 'calc(100vh - 134px)' }}>
        <div style={{ minHeight: 'calc(100vh - 134px)' }} className='h-full flex items-center justify-center'>
          <Spin size='large' tip='Loading...' />
        </div>
      </Content>
      <Footer />
    </Layout>
  )
}

export default Loading
