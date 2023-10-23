import React from 'react'
import './styles.css'
import { FloatButton, Layout } from 'antd'
import List from './listBird'
import Category from './category'
import { MessageOutlined, PhoneOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
type HomeProps = object

const ProductList: React.FC<HomeProps> = () => {
  const navigate = useNavigate()

  const click = () => {
    navigate('/')
  }

  // const [toggle, setToggle] = useState(false);

  // const toggleSidebar = () => {
  //   setToggle(!toggle);
  // }

  return (
    <Layout hasSider style={{ background: '#bdd4cd' }}>
      <FloatButton
        type='primary'
        style={{ right: 24, bottom: 100 }}
        shape='circle'
        onClick={click}
        icon={<MessageOutlined />}
      />
      <FloatButton type='primary' style={{ right: 24 }} shape='circle' onClick={click} icon={<PhoneOutlined />} />
      {/*Filter */}
      {/* <Button
          type='primary'
          onClick={toggleSidebar}
          className='lg:w-none'
        /> */}
      <Sider width={250} className='overflow-auto !max-h-fit !fixed left-0 top-[62px] bottom-0'>
        <Category />
      </Sider>
      <Layout className='lg:ml-[250px]'>
        <Content>
          {/*List */}
          <div className='w-full'>
            <List />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default ProductList
