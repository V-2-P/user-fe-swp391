import React, { useEffect, useState } from 'react'
import { Button, List, Empty, Image, Card, Typography, Space } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import Carousel from 'react-multi-carousel'
import { formatCurrencyVND } from '~/utils/numberUtils'
import { useCart } from '~/application/hooks/useCart'
import CartItemCard from '~/application/components/cart/cartItemCard'
import { useAppDispatch } from '~/application/hooks/reduxHook'
import { fetchCartDetailsIfNeeded } from '~/redux/slices'
import { getBirdImage } from '~/utils/imageUtils'
import useFetchData from '~/application/hooks/useFetchData'
import axiosClient from '~/utils/api/AxiosClient'
type Bird = {
  id: number
  name: string
  categoryName: string
  birdType: string
  gender: string
  price: number
  thumbnail: string
}

const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024
    },
    items: 4,
    partialVisibilityGutter: 40
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0
    },
    items: 1,
    partialVisibilityGutter: 30
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464
    },
    items: 2,
    partialVisibilityGutter: 30
  }
}

const ShoppingCart: React.FC = () => {
  const { cart, clearCart } = useCart()
  const [data, setData] = useState<Bird[]>([])
  const [recommendLoading, recommendError, recommendResponse] = useFetchData(`/birds/recommendation`)
  const navigate = useNavigate()
  const dispath = useAppDispatch()

  const handleDeleteSelected = () => {
    clearCart()
  }

  useEffect(() => {
    dispath(fetchCartDetailsIfNeeded())
  }, [dispath])

  useEffect(() => {
    if (cart.totalQuantity > 0) {
      const ids = Object.keys(cart.items)
      const randomId = ids[Math.floor(Math.random() * ids.length)]
      console.log(randomId)
      axiosClient.get(`/birds/recommendlist?birdId=${randomId}&K=20`).then((response) => {
        const birds = response.data
        setData(
          birds.map((e: any) => ({
            id: e.id,
            name: e.name,
            categoryName: e.category.name,
            birdType: e.birdType.name,
            gender: e.gender,
            price: e.price,
            thumbnail: e.thumbnail
          }))
        )
      })
    } else {
      if (!recommendLoading && !recommendError && recommendResponse) {
        setData(recommendResponse.data.bestSellers)
      }
    }
  }, [cart.items, cart.totalQuantity, recommendError, recommendLoading, recommendResponse])
  return (
    <div className='px-[10%] p-5 min-h-screen' style={{ background: '#038777' }}>
      <div className='bg-gray-100 p-10 rounded-xl'>
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
      <div className='bg-gray-200 mt-5 p-5 rounded-xl'>
        <Space direction='vertical' className='w-full'>
          <Typography.Title level={3} className='ml-5'>
            Đề cử
          </Typography.Title>
          <Carousel responsive={responsive}>
            {data.map((item) => (
              <div className='mx-5'>
                <Card
                  onClick={() => navigate(`/productdetail/${item.id}`)}
                  hoverable
                  cover={
                    <Image
                      src={getBirdImage(item.thumbnail)}
                      className='text-center !w-full object-cover'
                      preview={false}
                      height={300}
                      loading='eager'
                      fallback='data:image/png;base64,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'
                    />
                  }
                >
                  <div className='flex flex-col text-xs space-y-3'>
                    <div className='flex flex-col justify-center w-full space-y-3'>
                      <Typography.Text ellipsis={true}>{item.name} </Typography.Text>
                      <p className='break-words w-full text-sm text-red-500'>{formatCurrencyVND(item.price)}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </Carousel>
        </Space>
      </div>
    </div>
  )
}
export default ShoppingCart
