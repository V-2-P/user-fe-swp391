import React from 'react'
import './styles.css'
import { FloatButton } from 'antd'
import List from './listBird'
import Category from './category'
import { MessageOutlined, PhoneOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
type HomeProps = object

const ProductList: React.FC<HomeProps> = () => {
  const navigate = useNavigate()

  const click = () => {
    navigate('/')
  }

  return (
    <div className='relative p-5 min-h-screen' style={{ background: '#bdd4cd' }}>
      <FloatButton
        type='primary'
        style={{ right: 24, bottom: 100 }}
        shape='circle'
        onClick={click}
        icon={<MessageOutlined />}
      />
      <FloatButton type='primary' style={{ right: 24 }} shape='circle' onClick={click} icon={<PhoneOutlined />} />
      <div className='lg:h-fit lg:flex mx-[1%] lg:mx-[1%] my-[2%]'>
        <div className='w-[5%]'></div>
        {/*Filter */}
        <div className='w-full lg:fixed  lg:w-[20%] flex flex-col'>
          <div className=''>
            <Category />
          </div>
        </div>
        <div className='w-[1%]'></div>

        {/*List */}
        <div className='lg:w-[70%] lg:ml-[18%]'>
          <List />
        </div>
      </div>
    </div>
  )
}

export default ProductList
