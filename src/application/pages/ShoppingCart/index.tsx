import React, { useEffect } from 'react'
import { Button, List, Empty, Rate } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import Carousel from 'react-multi-carousel'
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Products } from '~/application/components/shared/ListOfBird'
import { formatCurrencyVND } from '~/utils/numberUtils'
import { useCart } from '~/application/hooks/useCart'
import CartItemCard from '~/application/components/cart/cartItemCard'
import { useAppDispatch } from '~/application/hooks/reduxHook'
import { fetchCartDetailsIfNeeded } from '~/redux/slices'

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

const ShoppingCart: React.FC = () => {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const dispath = useAppDispatch()
  const handleDeleteSelected = () => {
    clearCart()
  }

  useEffect(() => {
    dispath(fetchCartDetailsIfNeeded())
  }, [dispath])

  return (
    <div className='px-[10%] p-5 min-h-screen' style={{ background: '#038777' }}>
      <div className='bg-gray-100 p-10'>
        {cart.totalQuantity === 0 ? (
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
            <List
              itemLayout='horizontal'
              dataSource={Object.values(cart.items)}
              renderItem={(item) => (
                <List.Item className='!flex !justify-normal rounded-md'>
                  <CartItemCard item={item} />
                </List.Item>
              )}
            />

            <List>
              <List.Item className='bg-gray-500 bg-opacity-30 !flex !justify-normal mb-5 rounded-md shadow-lg !font-semibold !text-lg'>
                <div className='w-[18%] mx-[2%]'>
                  <p>Tổng sản phẩm : {cart.totalQuantity}</p>
                </div>
                <div className=' space-y-2 w-[20%]'>
                  <Button type='link' onClick={handleDeleteSelected}>
                    Xóa tất cả
                  </Button>
                </div>
                <div className='space-x-1 w-[45%] flex justify-center'>
                  <p>Tổng tiền: {formatCurrencyVND(cart.totalPrice)}</p>
                </div>
                <div className='w-[15%]'>
                  <Button onClick={() => navigate('/checkout')} className='!bg-green-800 !text-white'>
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
export default ShoppingCart
