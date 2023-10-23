import React from 'react'
import { Rate, Button, Image } from 'antd'
import { useNavigate } from 'react-router-dom'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { Products } from '~/application/components/shared/ListOfBird'
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import useFetchData from '~/application/hooks/useFetchData'

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

interface dataType {
  id: number
  name: string
  categoryName: string
  birdType: string
  gender: string
  price: number
  thumbnail: string
}

const List: React.FC = () => {
  const [loading, error, response] = useFetchData(`/birds`)
  const birdData: dataType[] = response?.data?.birds
  const navigate = useNavigate()

  const click = () => {
    navigate('/productdetail')
  }

  console.log(response)
  console.log(birdData)
  console.log(error)

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{ background: '#bdd4cd' }}
          className='w-full p-10 mx-auto lg:w-full lg:text-2xl bg-opacity-80 space-y-5'
        >
          <div style={{ background: '#038777' }} className='lg:mb-0 p-5 rounded-xl'>
            <Carousel responsive={responsive}>
              {birdData &&
                birdData.map((list: any) => (
                  <div key={list.id} className='flex flex-col lg:mr-5 rounded-md overflow-hidden bg-white'>
                    <button className='relative w-[100%]' onClick={click}>
                      <Image
                        src={`https://api.techx.id.vn/images/birds/${list.thumbnail}`}
                        className='text-center !w-[100%] object-cover'
                        preview={false}
                        fallback='data:image/png;base64,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'
                      />
                    </button>
                    <div className='w-[100%] flex flex-col p-2 lg:p-3 space-y-3'>
                      <p className='break-words w-[full] justify-start text-sm'>{list.name}</p>
                      <div className='bg-yellow-400 w-[40%] p-1 !shadow-md'>
                        <p className='text-xs object-cover'>Giảm 20k</p>
                      </div>
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

          <div style={{ background: '#038777' }} className='lg:mb-0 p-5 rounded-xl'>
            <Carousel responsive={responsive}>
              {Products.map((list) => (
                <div key={list.id} className='flex flex-col lg:mr-5 rounded-md overflow-hidden bg-white'>
                  <button className='relative w-[100%]' onClick={click}>
                    <img src={list.srcImage} className='text-center w-[100%] object-cover' />
                  </button>
                  <div className='w-[100%] flex flex-col p-2 lg:p-3 space-y-3'>
                    <p className='break-words w-[full] justify-start text-sm'>
                      {list.name} .......................... ....................... ..............
                    </p>
                    <div className='bg-yellow-400 w-[40%] p-1 !shadow-md'>
                      <p className='text-xs object-cover'>Giảm 20k</p>
                    </div>
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

          <div style={{ background: '#038777' }} className='lg:mb-0 p-5 rounded-xl'>
            <Carousel responsive={responsive}>
              {Products.map((list) => (
                <div key={list.id} className='flex flex-col lg:mr-5 rounded-md overflow-hidden bg-white'>
                  <button className='relative w-[100%]' onClick={click}>
                    <img src={list.srcImage} className='text-center w-[100%] object-cover' />
                  </button>
                  <div className='w-[100%] flex flex-col p-2 lg:p-3 space-y-3'>
                    <p className='break-words w-[full] justify-start text-sm'>
                      {list.name} .......................... ....................... ..............
                    </p>
                    <div className='bg-yellow-400 w-[40%] p-1 !shadow-md'>
                      <p className='text-xs object-cover'>Giảm 20k</p>
                    </div>
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
          <div className='w-full mt-10 flex justify-center'>
            <Button className='!bg-green-800 !text-white' href='/viewall'>
              View all page
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default List
