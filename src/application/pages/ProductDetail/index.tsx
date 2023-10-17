import React, { useState } from 'react'
import Information from './information'
import 'react-multi-carousel/lib/styles.css'
import { Button, Rate, Tabs } from 'antd'
import { Products } from '~/application/components/shared/ListOfBird'
import { useNavigate } from 'react-router-dom'
import Carousel from 'react-multi-carousel'
import { PlusOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import TextArea from 'antd/es/input/TextArea'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

type HomeProps = object

const ProductDetail: React.FC<HomeProps> = () => {
  const imageList = [
    {
      id: 1,
      img: 'src/application/assets/images/chim.jpg'
    },
    {
      id: 2,
      img: 'src/application/assets/images/chim2.jpg'
    },
    {
      id: 3,
      img: 'src/application/assets/images/background.png'
    }
  ]
  const [image, setImage] = useState(imageList[0])

  const changeImage = (key1: number) => {
    setImage(imageList[key1 - 1])
  }

  const navigate = useNavigate()

  const click = () => {
    navigate('/productdetail')
  }

  return (
    <div className='object-fill my-0 lg:p-[1%] px-[2%] lg:px-[10%]' style={{ background: '#038777' }}>
      <div className='border-solid border-4 border-gray-100 rounded-t-lg bg-gray-200 '>
        <div className='flex lg:flex-row flex-col'>
          <div className='my-[5%] w-full lg:w-[50%] flex flex-col justify-center px-[10%]'>
            <img src={image.img} className='w-[100%] rounded-lg shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)]' />
            <div className='flex'>
              {imageList.map((e) => (
                <button className='w-[33%] p-5' key={e.id} onClick={() => changeImage(e.id)}>
                  <img className='w-[100%]' key={e.id} src={e.img} />
                </button>
              ))}
            </div>
          </div>

          <div className='my-[5%] object-cover lg:p-10'>
            <Information />
          </div>
        </div>
      </div>
      <div className='bg-gray-200 mt-5 p-5 rounded-xl'>
        <Tabs>
          <Tabs.TabPane tab='Mô tả sản phẩm' key='tab1'>
            <div>
              <div>
                <h1 className='font-semibold text-xl'>Chi tiết</h1>
                <div>
                  <p>Bổ sung thông tin</p>
                </div>
              </div>
              <div>
                <h1 className='font-semibold text-xl'>Mô tả</h1>
                <div>
                  <p>Thông tin</p>
                </div>
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane id='rating' tab='Đánh giá sản phẩm' key='tab2'>
            <div>
              <div className='flex flex-col'>
                <div className='flex'>
                  <div className='my-auto'>
                    <Avatar size={55} icon={<UserOutlined />} />
                  </div>
                  <div className='ml-2'>
                    <p className='text-sm'>Tên người dùng</p>
                    <Rate allowHalf disabled className='w-full !text-xs' />
                    <p className='text-sm'>Ngày đăng</p>
                  </div>
                </div>
                <div className='mt-5'>
                  <TextArea disabled placeholder='Comment' autoSize={{ minRows: 3, maxRows: 5 }} />
                </div>
              </div>
              <div className='flex flex-col mt-5'>
                <div className='flex'>
                  <div className='my-auto'>
                    <Avatar size={55} icon={<UserOutlined />} />
                  </div>
                  <div className='ml-2'>
                    <p className='text-sm'>Tên người dùng</p>
                    <Rate allowHalf disabled className='w-full !text-xs' />
                    <p className='text-sm'>Ngày đăng</p>
                  </div>
                </div>
                <div className='mt-5'>
                  <TextArea disabled placeholder='Comment' autoSize={{ minRows: 3, maxRows: 5 }} />
                </div>
              </div>
              <div className='flex flex-col mt-5'>
                <div className='flex'>
                  <div className='my-auto'>
                    <Avatar size={55} icon={<UserOutlined />} />
                  </div>
                  <div className='ml-2'>
                    <p className='text-sm'>Tên người dùng</p>
                    <Rate allowHalf disabled className='w-full !text-xs' />
                    <p className='text-sm'>Ngày đăng</p>
                  </div>
                </div>
                <div className='mt-5'>
                  <TextArea disabled placeholder='Comment' autoSize={{ minRows: 3, maxRows: 5 }} />
                </div>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div className='bg-gray-200 mt-5 rounded-xl'>
        <p className='text-2xl p-5 mx-[7%] font-bold'>Sản phẩm tương tự</p>
        <div className='lg:mb-0 p-5 w-[85%] mx-auto'>
          <Carousel responsive={responsive}>
            {Products.map((list) => (
              <div key={list.id} className='flex flex-col lg:mr-5 rounded-md overflow-hidden bg-white'>
                <button className='relative w-[100%]' onClick={click}>
                  <img src={list.srcImage} className='text-center w-[100%] object-cover' />
                </button>
                <div className='w-[100%] flex flex-col p-2 lg:p-3 space-y-3'>
                  <p className='break-words w-[full] justify-start text-sm'>{list.name}</p>
                  <div className=' w-full mb-[2%] '>
                    <div className='flex flex-col text-xs space-y-3'>
                      <div className='flex !my-auto w-full'>
                        <Rate allowHalf className='!text-sm lg:!text-xs w-full' />
                        <div className='flex my-auto justify-center w-[30%]'>
                          <p className='break-words w-[full] justify-end text-sm text-red-500'>${list.price}</p>
                        </div>
                      </div>
                      <div className='flex w-full '>
                        <Button
                          size='middle'
                          icon={<PlusOutlined />}
                          className='!w-[100%] !border-green-700 lg:w-[50%] text-center !p-0 !text-xs !text-green-700'
                        >
                          Compare
                        </Button>
                        <Button
                          size='middle'
                          icon={<ShoppingCartOutlined />}
                          className='!w-[100%] lg:mt-0 lg:w-[50%] text-center !p-0 m-0 lg:mr-1 lg:ml-2 !text-xs !bg-green-700 !text-white'
                        >
                          Add to cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
