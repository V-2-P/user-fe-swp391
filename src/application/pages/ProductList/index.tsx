import React from 'react'
import './styles.css'
import { Layout } from 'antd'
import ListBird from './listBird'
import Category from './category'
// import { useNavigate } from 'react-router-dom'
import { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import Header from '~/application/layouts/header'
type HomeProps = object

const ProductList: React.FC<HomeProps> = () => {
  // const navigate = useNavigate()
  // const click = () => {
  //   navigate('/')
  // }

  // const [toggle, setToggle] = useState(false);

  // const toggleSidebar = () => {
  //   setToggle(!toggle);
  // }

  return (
    <>
      <Layout style={{ minHeight: 'calc(100vh - 134px)' }}>
        <Header />
        <Layout>
          <Sider
            width={200}
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 64,
              bottom: 0,
              zIndex: 999999
            }}
          >
            <Category />
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            <Content style={{ overflow: 'initial' }}>
              {/*List */}
              <ListBird />
            </Content>
            <Layout.Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Layout.Footer>
          </Layout>
        </Layout>
      </Layout>
    </>
  )
}

export default ProductList
