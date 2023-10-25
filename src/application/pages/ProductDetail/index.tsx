import React, { useState } from 'react'
import 'react-multi-carousel/lib/styles.css'
import { Button, Descriptions, Image, Rate, Skeleton, Tabs, Tag } from 'antd'
import { Products } from '~/application/components/shared/ListOfBird'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Carousel from 'react-multi-carousel'
import { PlusOutlined, ShoppingCartOutlined, UserOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import useFetchData from '~/application/hooks/useFetchData'
import { formatCurrencyVND } from '~/utils/numberUtils'
import { DescriptionsProps } from 'antd/lib'

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

type BirdImage = {
  id: number
  imageUrl: string
}

type BirdData = {
  id: number
  name: string
  categoryName: string
  birdType: string
  gender: string
  color: string
  price: number
  quantity: number
  thumbnail: string
  competitionAchievements: number
  purebredLevel: string
  description: string
  totalRating: number
  countRating: number
  sold: number
  bird_images: BirdImage[]
}

type BirdFeedback = {
  address: null | string // null hoặc string
  birdId: number
  birdName: string
  birdType: string
  comment: string
  fullName: null | string // null hoặc string
  id: number
  orderId: null | number // null hoặc number
  phoneNumber: null | string // null hoặc string
  rating: number
  status: boolean
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
  console.log(image)

  const changeImage = (key1: number) => {
    setImage(imageList[key1 - 1])
  }

  const { id } = useParams()

  const [loading, error, response] = useFetchData(`/birds/detail/${id}`)
  const [feedbackLoading, feedbackError, feedbackResponse] = useFetchData(`/feedbackbirds/bird/${id}`)

  const birdData: BirdData = response?.data
  const feedbackData: BirdFeedback[] = feedbackResponse?.data

  console.log(birdData)

  const navigate = useNavigate()

  const click = () => {
    navigate('/productdetail')
  }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Giới tính',
      children: `${birdData?.gender}`
    },
    {
      key: '2',
      label: 'Độ thuần chủng',
      children: `${birdData?.purebredLevel}`
    },
    {
      key: '3',
      label: 'Màu sắc',
      children: `${birdData?.color}`
    },
    {
      key: '4',
      label: 'Mô tả',
      span: 2,
      children: `${birdData?.description}`
    }
  ]

  return (
    <div className='object-fill my-0 lg:p-[1%] px-[2%] lg:px-[10%]' style={{ background: '#038777' }}>
      <div className='border-solid border-4 border-gray-100 rounded-t-lg bg-gray-200 '>
        <Skeleton loading={loading} active>
          {error ? (
            <p>Error</p>
          ) : (
            <div className='flex lg:flex-row flex-col'>
              {/* Ảnh */}

              <div className='my-[5%] w-full lg:w-[50%] flex flex-col justify-center px-[10%]'>
                <Image
                  src={`https://api.techx.id.vn/uploads/birds/${birdData?.bird_images[0]?.imageUrl}`}
                  className='text-center !w-[100%] object-cover'
                  preview={false}
                  fallback='data:image/png;base64,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'
                />
                <div className='flex'>
                  {imageList.map((e) => (
                    <button className='w-[33%] p-5' key={e.id} onClick={() => changeImage(e.id)}>
                      <img className='w-[100%]' key={e.id} src={e.img} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Thông tin chim */}

              <div className='flex flex-col w-full object-cover lg:p-10'>
                <div className='text-lg space-y-3'>
                  <div className='flex'>
                    <h1 className='text-2xl text-clip overflow-clip'>{birdData?.name}</h1>
                    <div className='my-auto'>
                      <Button
                        icon={<PlusOutlined />}
                        className='ml-10 !text-sm w-[25%] lg:w-full relative !text-green-800 !border-green-800'
                      >
                        <span className='!text-xs'>So sánh</span>
                      </Button>
                    </div>
                  </div>

                  <div className='flex text-sm'>
                    <div className='flex w-[45%] lg:w-[30%] space-x-2 border-r-2 border-black'>
                      <p className='w-[fit] my-auto border-b-2 border-red-500 text-base text-red-500'>
                        {birdData?.totalRating}
                      </p>
                      <Rate value={birdData?.totalRating} allowHalf disabled className='w-full !text-base' />
                    </div>
                    <Link to='/' className='w-[30%] lg:w-[20%] flex justify-center border-r-2 border-black ml-2'>
                      <span className='w-[fit] my-auto !text-black border-b-2 border-black mr-2'>
                        {birdData?.totalRating}
                      </span>
                      <p className='text-base mr-1'>Đánh giá</p>
                    </Link>
                    <p className='flex justify-center w-[25%]  lg:w-[20%] mr-1'>
                      <span className='w-[fit] my-auto !text-black border-b-2 border-black mr-2'>{birdData?.sold}</span>
                      <p className='text-base mr-1'>Đã mua</p>
                    </p>
                  </div>

                  <p className='w-[60%] !text-4xl text-red-500'>
                    <span>{formatCurrencyVND(birdData ? birdData.price : 0)}</span>
                  </p>

                  <div className='flex '>
                    <div className='grid grid-cols-3 lg:grid-cols-4  w-full'>
                      <Tag bordered={false} color='green' className='!text-center'>
                        {birdData?.birdType}
                      </Tag>
                      <Tag bordered={false} color='green' className='!text-center'>
                        {birdData?.categoryName}
                      </Tag>
                    </div>
                  </div>

                  <div className='h-full w-full text-sm flex'>
                    <div className='flex w-full'>
                      <Button
                        icon={<ShoppingCartOutlined />}
                        className='w-[48%] !border-green-700 !text-green-700 !bg-green-50'
                      >
                        Thêm giỏ hàng
                      </Button>
                      <div className='w-[2%]'></div>
                      <Button icon={<ShoppingOutlined />} className='w-[50%] !bg-green-700 !text-white'>
                        Mua ngay
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Skeleton>
      </div>

      {/* Thông tin Mô tả */}

      <div className='bg-gray-200 mt-5 p-5 rounded-xl'>
        <Tabs>
          <Tabs.TabPane tab='Mô tả sản phẩm' key='tab1'>
            <Skeleton loading={loading} active>
              {error ? <p>Error</p> : <Descriptions layout='vertical' items={items} />}
            </Skeleton>
          </Tabs.TabPane>
          <Tabs.TabPane id='rating' tab='Đánh giá sản phẩm' key='tab2'>
            <Skeleton loading={feedbackLoading} active>
              {feedbackError ? (
                <p>Error</p>
              ) : (
                <div>
                  {feedbackData &&
                    feedbackData.map((e) => (
                      <div className='flex flex-col mt-2'>
                        <div className='flex'>
                          <div className='my-auto'>
                            <Avatar size={55} icon={<UserOutlined />} />
                          </div>
                          <div className='ml-2'>
                            <p className='text-sm'>{e.fullName}</p>
                            <Rate value={e.rating} allowHalf disabled className='w-full !text-xs' />
                          </div>
                        </div>
                        <div className='mt-5'>
                          <TextArea disabled value={e.comment} autoSize={{ minRows: 3, maxRows: 5 }} />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Skeleton>
          </Tabs.TabPane>
        </Tabs>
      </div>

      {/* Sản phẩm tương tự */}

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
