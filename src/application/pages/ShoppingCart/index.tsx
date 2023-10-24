import { useState } from 'react'
import { Button, Checkbox, InputNumber, List, Empty, Rate } from 'antd'
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import Carousel from 'react-multi-carousel'
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Products } from '~/application/components/shared/ListOfBird'

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

export const ShoppingCart = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Chim xinh',
      price: 10000000,
      quantity: 1,
      image: 'src/application/assets/images/background.png',
      selected: false
    },
    {
      id: 2,
      name: 'Chim quy',
      price: 150000000,
      quantity: 1,
      image: 'src/application/assets/images/background.png',
      selected: false
    },
    {
      id: 3,
      name: 'Chim cu',
      price: 2000000000,
      quantity: 1,
      image: 'src/application/assets/images/background.png',
      selected: false
    }
  ])

  const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
  console.log(savedCart)

  const handleIncrease = (itemId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item))
    )
  }

  const handleDecrease = (itemId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    )
  }

  const calculateTotalPrice = () => {
    const selectedItems = cart.filter((item) => item.selected)
    const totalPrice = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0)
    return totalPrice
  }

  const countSelected = () => {
    const selectedItems = cart.filter((item) => item.selected)
    return selectedItems.length
  }

  const handleDelete = (itemId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const handleDeleteSelected = () => {
    const updatedItems = cart.filter((item) => !item.selected)
    setCart(updatedItems)
  }

  const handleSelectAll = () => {
    const updatedItems = cart.map((item) => ({
      ...item,
      selected: !item.selected
    }))
    setCart(updatedItems)
  }

  const handleItemToggle = (itemId: any) => {
    const updatedItems = cart.map((item) => {
      if (item.id === itemId) {
        return { ...item, selected: !item.selected }
      }
      return item
    })
    setCart(updatedItems)
  }

  return (
    <div className='px-[10%] p-5 min-h-screen' style={{ background: '#038777' }}>
      <div className='bg-gray-100 p-10'>
        {cart.length === 0 ? (
          <Empty description={<span>Giỏ hàng của bạn không có bất kì sản phẩm nào</span>}>
            <Link
              to='/productlist'
              className='border-2 border-solid border-green-700 rounded-xl p-2 !text-white !bg-green-800'
            >
              Tiếp tục mua sắm
            </Link>
          </Empty>
        ) : (
          <div>
            <List>
              <List.Item className='bg-gray-500 bg-opacity-30 !flex !justify-normal mb-5 rounded-md shadow-lg !font-semibold'>
                <div className='!ml-[5%]' />
                <div className='w-[15%] mx-[2%] pl-10'>Sản phẩm</div>
                <div className=' space-y-2 w-[20%]'></div>
                <div className='ml-[10%] w-[8%]'>Đơn giá</div>
                <div className='space-x-1 w-[15%] flex justify-center mr-3'>Số lượng</div>
                <div className='w-[15%]'>Số tiền</div>
                <div className='w-[10%]'>Thao tác</div>
              </List.Item>
            </List>
            <List className=''>
              {cart.map((e) => (
                <List.Item className='!flex !justify-normal mb-5 rounded-md' key={e.id}>
                  <Checkbox className='!ml-[2%]' checked={e.selected} onChange={() => handleItemToggle(e.id)} />
                  <div className='w-[15%] mx-[2%]'>
                    <img src={e.image} />
                  </div>
                  <div className=' space-y-2 w-[15%]'>
                    <p className='font-semibold'>{e.name}</p>
                    <div className='flex space-x-2'>
                      <div className='bg-gray-300 w-[50%]'> sddsa</div>
                      <div className='bg-gray-300 w-[50%]'> s</div>
                    </div>
                    <div className='bg-red-500 text-center text-white'>Tag giảm giá</div>
                  </div>
                  <div className='w-[5%]'></div>
                  <div className='ml-[10%] w-[8%]'>
                    <p>
                      {e.price}
                      <span className='text-red-600 font-semibold'> đ</span>
                    </p>
                  </div>
                  <div className='space-x-1 w-[15%] flex justify-center'>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => handleDecrease(e.id)} />
                    <InputNumber controls={false} className='!w-[25%]' value={e.quantity} />
                    <Button icon={<ArrowRightOutlined />} onClick={() => handleIncrease(e.id)} />
                  </div>
                  <div className='w-[15%]'>
                    <p>
                      {e.price * e.quantity}
                      <span className='text-red-600 font-semibold'> đ</span>
                    </p>
                  </div>
                  <div className='w-[10%]'>
                    <Button onClick={() => handleDelete(e.id)} type='link'>
                      Xóa
                    </Button>
                  </div>
                </List.Item>
              ))}
            </List>
            <List>
              <List.Item className='bg-gray-500 bg-opacity-30 !flex !justify-normal mb-5 rounded-md shadow-lg !font-semibold'>
                <Checkbox onChange={handleSelectAll} className='!ml-[2%]' />
                <div className='w-[15%] mx-[2%]'>
                  <p>Chọn tất cả ({cart.length})</p>
                </div>
                <div className=' space-y-2 w-[20%]'>
                  <Button type='link' onClick={handleDeleteSelected}>
                    Xóa tất cả
                  </Button>
                </div>
                <div className='space-x-1 w-[45%] flex justify-center'>
                  Tổng thanh toán ({countSelected()}): <p className='text-red-500'>{calculateTotalPrice()} VNĐ</p>
                </div>
                <div className='w-[15%]'>
                  <Button href='/checkout' className='!bg-green-800 !text-white'>
                    Mua hàng
                  </Button>
                </div>
              </List.Item>
            </List>
          </div>
        )}
      </div>
      <div className='bg-gray-200 mt-5 rounded-xl'>
        <p className='text-2xl p-5 mx-[7%] font-bold'>Sản phẩm tương tự</p>
        <div className='lg:mb-0 pb-5 w-[85%] mx-auto'>
          <Carousel responsive={responsive}>
            {Products.map((list) => (
              <div key={list.id} className='flex flex-col lg:mr-5 rounded-md overflow-hidden bg-white'>
                <button className='relative w-[100%]'>
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
