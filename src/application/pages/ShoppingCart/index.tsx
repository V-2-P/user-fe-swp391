import { useState, useEffect } from 'react'
import { Button, InputNumber, List, Empty, Rate, Image } from 'antd'
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import Carousel from 'react-multi-carousel'
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Products } from '~/application/components/shared/ListOfBird'
import useFetchData from '~/application/hooks/useFetchData'
import { formatCurrencyVND } from '~/utils/numberUtils'

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
  const savedCart = JSON.parse(localStorage.getItem('cart') || '[]') as any
  const birdIds = savedCart.map((e: any) => e.id)

  const [loading, error, response] = useFetchData(`/birds/by-ids?ids=${birdIds.join(',')}`)

  const [cart, setCart] = useState<any[]>([])
  const [abc, setAbc] = useState(false)

  const handleIncrease = (id: number) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingCartItem = cart.find((item: any) => item.id === id)
    if (existingCartItem) {
      cart = cart.map((item: any) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      cart = [...cart, { id, quantity: 1 }]
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    setAbc(!abc)
  }

  const handleDecrease = (id: number) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingCartItem = cart.find((item: any) => item.id === id)
    if (existingCartItem) {
      cart = cart.map((item: any) =>
        item.id === id ? { ...item, quantity: item.quantity ? item.quantity - 1 : 0 } : item
      )
    } else {
      cart = [...cart, { id, quantity: 1 }]
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    setAbc(!abc)
  }

  const calculateTotalPrice = () => {
    // const totalPrice = cart.reduce((total: any, item: any) => total + item.price * item.quantity, 0)
    const sum = cart.reduce(
      (accumulator: any, currentValue: any) =>
        accumulator +
        (savedCart.findIndex((saved: any) => saved.id === currentValue.id) !== -1
          ? savedCart[savedCart.findIndex((saved: any) => saved.id === currentValue.id)].quantity * currentValue.price
          : 0),
      0
    )
    return sum
  }
  const handleDelete = (itemId: number) => {
    // setCart((prevCart: any) => prevCart.filter((item: any) => item.id !== itemId))
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const newcart = cart.filter((item: any) => item.id !== itemId)
    localStorage.setItem('cart', JSON.stringify(newcart))
    setAbc(!abc)
  }
  console.log(cart)

  const handleDeleteSelected = () => {
    localStorage.removeItem('cart')
    setAbc(!abc)
  }

  useEffect(() => {
    if (!loading && !error) {
      setCart(response?.data)
    }
  }, [loading, error, response])

  return (
    <div className='px-[10%] p-5 min-h-screen' style={{ background: '#038777' }}>
      <div className='bg-gray-100 p-10'>
        {savedCart.length === 0 ? (
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
                <div className='w-[15%] mx-[2%] pl-10'>Sản phẩm</div>
                <div className=' space-y-2 w-[20%]'></div>
                <div className='ml-[10%] w-[8%]'>Đơn giá</div>
                <div className='space-x-1 w-[15%] flex justify-center mr-3'>Số lượng</div>
                <div className='w-[15%]'>Số tiền</div>
                <div className='w-[10%]'>Thao tác</div>
              </List.Item>
            </List>
            <List className=''>
              {savedCart &&
                savedCart.map((_e: any, index: any) => (
                  <List.Item className='!flex !justify-normal rounded-md' key={cart[index]?.id}>
                    <div className='w-[15%] mx-[2%] h-full'>
                      <Image
                        src={`https://api.techx.id.vn/uploads/birds/${cart[index]?.thumbnail}`}
                        className='text-center w-full h-full object-cover'
                        preview={false}
                        fallback='data:image/png;base64,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'
                      />
                    </div>
                    <div className=' space-y-2 w-[15%] flex-col mt-0'>
                      <p className='font-semibold'>{cart[index]?.name}</p>
                      <div className='bg-red-500 text-center text-white'>Tag giảm giá</div>
                    </div>
                    <div className='w-[5%]'></div>
                    <div className='ml-[10%] w-[8%]'>
                      <p>{formatCurrencyVND(cart[index] ? cart[index]?.price : 0)}</p>
                    </div>
                    <div className='space-x-1 w-[15%] flex justify-center'>
                      <Button icon={<ArrowLeftOutlined />} onClick={() => handleDecrease(cart[index]?.id)} />
                      <InputNumber
                        controls={false}
                        className='!w-[25%]'
                        value={
                          savedCart.findIndex((saved: any) => saved.id === cart[index]?.id) !== -1
                            ? savedCart[savedCart.findIndex((saved: any) => saved.id === cart[index]?.id)].quantity
                            : 0
                        }
                      />
                      <Button icon={<ArrowRightOutlined />} onClick={() => handleIncrease(cart[index]?.id)} />
                    </div>
                    <div className='w-[15%]'>
                      <p>
                        {savedCart.findIndex((saved: any) => saved.id === cart[index]?.id) !== -1
                          ? formatCurrencyVND(
                              cart[index]?.price *
                                savedCart[savedCart.findIndex((saved: any) => saved.id === cart[index]?.id)].quantity
                            )
                          : 0}
                      </p>
                    </div>
                    <div className='w-[10%]'>
                      <Button onClick={() => handleDelete(cart[index]?.id)} type='link'>
                        Xóa
                      </Button>
                    </div>
                  </List.Item>
                ))}
            </List>
            <List>
              <List.Item className='bg-gray-500 bg-opacity-30 !flex !justify-normal mb-5 rounded-md shadow-lg !font-semibold !text-lg'>
                <div className='w-[15%] mx-[2%]'>
                  <p>Tổng sản phẩm : {savedCart?.length}</p>
                </div>
                <div className=' space-y-2 w-[20%]'>
                  <Button type='link' onClick={handleDeleteSelected}>
                    Xóa tất cả
                  </Button>
                </div>
                <div className='space-x-1 w-[45%] flex justify-center'>
                  <p>Tổng tiền: {formatCurrencyVND(calculateTotalPrice())}</p>
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
