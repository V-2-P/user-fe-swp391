import React from 'react'
import './styles.css'
import { Layout } from 'antd'
import ListBird from './listBird'
import Category from './category'
// import { useNavigate } from 'react-router-dom'
import { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
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
      <Layout hasSider style={{ background: '#bdd4cd' }}>
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
              <ListBird />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default ProductList
