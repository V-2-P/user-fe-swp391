import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import useFetchData from '~/application/hooks/useFetchData'
import { List, Image } from 'antd'
import { formatCurrencyVND, formatCurrencyVNDToString } from '~/utils/numberUtils'
import { getBirdImage } from '~/utils/imageUtils'
type OrderDetail = {
  id: number
  birdId: number
  birdName: string
  thumbnail: string
  gender: string
  price: number
  numberOfProducts: number
}

type Order = {
  id: number
  userId: number
  fullName: string
  phoneNumber: string
  shippingAddress: string
  note: string | null
  totalMoney: number
  totalPayment: number
  discount: number
  orderDate: string
  status: string
  paymentMethod: string
  shippingMethod: string
  shippingMoney: number
  shippingDate: string | null
  trackingNumber: string | null
  orderDetails: OrderDetail[]
  feedbackStatus: boolean
}

const OrderDetailPage: React.FC = () => {
  const { id } = useParams()
  const [loading, error, response] = useFetchData(`/orders/${id}`)
  console.log(response)
  const order: Order = useMemo(() => {
    if (!loading && !error && response) {
      return response.data
    }
    return null
  }, [loading, error, response])
  const orderDetails: OrderDetail[] = useMemo(() => {
    if (order) {
      return order.orderDetails
    }
    return []
  }, [order])
  const totalQuantity = useMemo(() => {
    let total = 0
    orderDetails.forEach((o) => (total += o.numberOfProducts))
    return total
  }, [orderDetails])
  return (
    <div className='w-full h-full px-[10%] py-10'>
      <div>
        <List>
          <List.Item className='bg-gray-500 bg-opacity-30 !flex !justify-normal mb-5 rounded-md shadow-lg !font-semibold'>
            <div className='w-[30%] mx-[2%] pl-10'>Sản phẩm</div>
            <div className=' space-y-2 w-[20%]'></div>
            <div className='ml-[10%] w-[8%]'>Đơn giá</div>
            <div className='space-x-1 w-[15%] flex justify-center mr-3'>Số lượng</div>
            <div className='w-[15%]'>Số tiền</div>
          </List.Item>
        </List>
        <List
          itemLayout='horizontal'
          dataSource={orderDetails}
          renderItem={(item) => (
            <List.Item className='!flex !justify-normal rounded-md'>
              <div className='w-[15%] mx-[2%] h-full'>
                <Image
                  src={getBirdImage(item.thumbnail)}
                  className='text-center w-full h-full object-cover'
                  preview={false}
                  loading='eager'
                  fallback='data:image/png;base64,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'
                />
              </div>
              <div className=' space-y-2 w-[15%] flex-col mt-0'>
                <p className='font-semibold text-base'>{item.birdName}</p>
              </div>
              <div className='w-[17.5%]'></div>
              <div className='ml-[10%] w-[8%]'>
                <p>{formatCurrencyVND(item.price)}</p>
              </div>
              <div className='space-x-1 w-[15%] flex justify-center'>
                <p className='font-semibold text-base'>{formatCurrencyVNDToString(item.numberOfProducts)}</p>
              </div>
              <div className='w-[15%]'>
                <p>{formatCurrencyVND(item.price * item.numberOfProducts)}</p>
              </div>
            </List.Item>
          )}
        />
        <List>
          <List.Item className='bg-gray-500 bg-opacity-30 !flex !justify-normal mb-5 rounded-md shadow-lg !font-semibold !text-lg'>
            <div className='w-[70%] mx-[2%]'>
              <p>Tổng sản phẩm : {totalQuantity}</p>
            </div>
            <div className='space-x-1 w-[20%] flex justify-center'>
              <p>Tổng tiền: {formatCurrencyVND(order?.totalPayment)}</p>
            </div>
          </List.Item>
        </List>
      </div>
    </div>
  )
}

export default OrderDetailPage
