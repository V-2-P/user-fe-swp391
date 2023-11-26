import React, { useMemo, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import useFetchData from '~/application/hooks/useFetchData'
import {
  List,
  Image,
  Breadcrumb,
  Space,
  Steps,
  Flex,
  Button,
  Typography,
  Descriptions,
  Result,
  Divider,
  Skeleton,
  App
} from 'antd'
import { formatCurrencyVND, formatCurrencyVNDToString } from '~/utils/numberUtils'
import { getBirdImage } from '~/utils/imageUtils'
import type { StepProps, DescriptionsProps } from 'antd'
import { ShoppingCartOutlined, InboxOutlined, CarOutlined, CarryOutOutlined } from '@ant-design/icons'
import { OrderStatus } from '~/application/components/shared/constanst'
import FeedbackButton from './feedbackButton'
import { useAppDispatch } from '~/application/hooks/reduxHook'
import axiosClient from '~/utils/api/axiosClient'
import { reFetchData } from '~/redux/slices'
import ViewFeedbackButton from './viewFeedbackButton'
import CountdownTimer from '~/application/components/shared/CountdownTimer'

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
  createdAt: string
}

interface OrderStep {
  status: 'wait' | 'error' | 'process' | 'finish'
  current: number
}

const OrderDetailPage: React.FC = () => {
  const { id } = useParams()
  const { notification } = App.useApp()
  const dispatch = useAppDispatch()
  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loading, error, response] = useFetchData(`/orders/${id}`)

  console.log(response)
  const [orderStep, setOrderStep] = useState<OrderStep>({
    status: 'process',
    current: 1
  })
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
  const stepItems: StepProps[] = [
    {
      title: orderStep.current > 0 ? 'Đã xác nhận' : 'Chờ xác nhận',
      icon: orderStep.current === 0 && orderStep.status === 'error' ? null : <ShoppingCartOutlined />
    },
    {
      title:
        orderStep.status === 'error'
          ? 'Đã hủy'
          : orderStep.current === 1
          ? 'Đang xử lý'
          : orderStep.current > 1
          ? 'Đã xử lý'
          : 'Chờ xử lý',
      icon: orderStep.current === 1 && orderStep.status === 'error' ? null : <InboxOutlined />
    },
    {
      title: orderStep.current === 2 ? 'Đang vận chuyển' : orderStep.current > 2 ? 'Đã vận chuyển' : 'Chờ vận chuyển',
      icon: orderStep.current === 2 && orderStep.status === 'error' ? null : <CarOutlined />
    },
    {
      title: orderStep.current === 3 ? 'Đang giao hàng' : orderStep.current > 3 ? 'Đã giao hàng' : 'Chờ giao hàng',
      icon: orderStep.current === 3 && orderStep.status === 'error' ? null : <CarryOutOutlined />
    }
  ]
  const orderDes: DescriptionsProps['items'] = [
    {
      key: '1',
      labelStyle: {
        textAlign: 'right'
      },
      contentStyle: {
        textAlign: 'right'
      },
      label: 'Tổng tiền hàng',
      children: formatCurrencyVND(order?.totalMoney)
    },
    {
      key: '2',
      label: 'Phí vận chuyển',
      labelStyle: {
        textAlign: 'right'
      },
      contentStyle: {
        textAlign: 'right'
      },
      children: formatCurrencyVND(order?.shippingMoney)
    },
    {
      key: '3',
      label: 'Voucher giảm giá',
      labelStyle: {
        textAlign: 'right'
      },
      contentStyle: {
        textAlign: 'right'
      },
      children: formatCurrencyVND(order?.discount)
    },
    {
      key: '4',
      label: 'Thành tiền',
      labelStyle: {
        textAlign: 'right'
      },
      contentStyle: {
        textAlign: 'right'
      },
      children: formatCurrencyVND(order?.totalPayment)
    },
    {
      key: '5',
      label: 'Phương thức thanh toán',
      labelStyle: {
        textAlign: 'right'
      },
      contentStyle: {
        textAlign: 'right'
      },
      children: order?.paymentMethod
    }
  ]

  const checkPaymentStatus = async (orderId: number): Promise<OrderStatus> => {
    const response = await axiosClient.get(`/orders/${orderId}`)
    return response.data.status
  }
  const longPollingCheckPaymentStatus = async (orderId: number) => {
    const intervalId = setInterval(async () => {
      try {
        const isPaymentSuccessful = await checkPaymentStatus(orderId)

        if (isPaymentSuccessful === OrderStatus.processing) {
          clearInterval(intervalId) // Dừng long polling khi thanh toán thành công
          dispatch(reFetchData())
        }
      } catch (error) {
        // Xử lý lỗi (ví dụ: thông báo lỗi)
        console.error('Error checking payment status:', error)
      }
    }, 5000) // Gọi kiểm tra mỗi 5 giây (có thể điều chỉnh thời gian giữa các lần kiểm tra)
  }
  const handleRepayment = async () => {
    setLoadingButton(true)
    try {
      const response = await axiosClient.put(`/orders/rePayment/${order.id}`)
      if (response) {
        // redirect tới trang thanh toán
        if (response.data) {
          window.open(response.data.url, '_blank')!.focus()
        }
        // gọi api check status
        await longPollingCheckPaymentStatus(order.id)
        setLoadingButton(false)
      } else {
        notification.error({ message: 'Sorry! Something went wrong. App server error' })
      }
    } catch (err) {
      setLoadingButton(false)
      notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
    }
  }

  const handleConfirm = async () => {
    setLoadingButton(true)
    try {
      const response = await axiosClient.put(`/orders/delivered/${order.id}`)
      setLoadingButton(false)
      if (response) {
        notification.success({ message: 'Cảm ơn bạn đã mua hàng' })
        dispatch(reFetchData())
      } else {
        notification.error({ message: 'Sorry! Something went wrong. App server error' })
      }
    } catch (err) {
      setLoadingButton(false)
      notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
    }
  }

  useEffect(() => {
    if (!loading && !error && response) {
      const status = response.data.status as OrderStatus

      if (status == OrderStatus.pending) {
        setOrderStep({
          status: 'process',
          current: 0
        })
      } else if (status == OrderStatus.processing) {
        setOrderStep({
          status: 'process',
          current: 1
        })
      } else if (status == OrderStatus.shipping) {
        setOrderStep({
          status: 'process',
          current: 2
        })
      } else if (status == OrderStatus.delivered) {
        setOrderStep({
          status: 'process',
          current: 3
        })
      } else if (status == OrderStatus.cancelled) {
        setOrderStep({
          status: 'error',
          current: 1
        })
      }
    }
  }, [loading, error, response])

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        if (order) {
          if (order.status === OrderStatus.pending) {
            const isPaymentSuccessful = await checkPaymentStatus(order.id)

            if (isPaymentSuccessful === OrderStatus.processing) {
              clearInterval(intervalId) // Dừng long polling khi thanh toán thành công
              dispatch(reFetchData())
            }
          } else {
            clearInterval(intervalId)
          }
        } else {
          clearInterval(intervalId)
        }
      } catch (error) {
        // Xử lý lỗi (ví dụ: thông báo lỗi)
        console.error('Error checking payment status:', error)
      }
    }, 5000)
    return () => {
      // Dừng long polling và xóa interval khi thành phần bị unmount
      clearInterval(intervalId)
    }
  }, [dispatch, notification, order])
  return (
    <div className='w-full h-full p-10  bg-gray-200'>
      <Skeleton loading={loading} active>
        {error ? (
          <Result title='Failed to fetch' subTitle={error} status='error' />
        ) : (
          <Space className='w-full bg-[#fff] p-10 rounded-xl' direction='vertical' size='large'>
            <Breadcrumb
              items={[
                {
                  title: <Link to='/order'>Danh sách đơn hàng</Link>
                },
                {
                  title: `Mã đơn hàng ${id}`
                }
              ]}
            />
            <Steps
              className='custom-step-content'
              // onChange={onStepChange}
              current={orderStep.current}
              status={orderStep.status}
              labelPlacement='vertical'
              items={stepItems}
            />
            <div>
              {order?.status === OrderStatus.pending && order.paymentMethod === 'vnpay' && (
                <Flex justify='space-between' align='center' className='border-[1px] border-dashed p-5'>
                  <CountdownTimer createdAt={order.createdAt} />
                  <Button
                    className='w-48'
                    size='large'
                    type='primary'
                    loading={loadingButton}
                    onClick={handleRepayment}
                  >
                    Thanh toán ngay
                  </Button>
                </Flex>
              )}
              {(order?.status === OrderStatus.shipping || order?.status === OrderStatus.delivered) && (
                <Flex justify='flex-end' className='border-[1px] border-dashed p-5'>
                  {order?.status === OrderStatus.shipping ? (
                    <Button
                      className='w-48'
                      size='large'
                      type='primary'
                      loading={loadingButton}
                      onClick={handleConfirm}
                    >
                      Xác nhận
                    </Button>
                  ) : order?.feedbackStatus ? (
                    <ViewFeedbackButton orderId={order?.id} />
                  ) : (
                    <FeedbackButton orderDetails={orderDetails} orderId={order?.id} />
                  )}
                </Flex>
              )}
            </div>
            <div className='cmp831'>
              <div
                className='DM1xQK'
                style={{
                  height: ' 0.1875rem',
                  width: '100%',
                  backgroundPositionX: '-1.875rem',
                  backgroundSize: '7.25rem 0.1875rem',
                  backgroundImage:
                    'repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 33px,transparent 0,transparent 41px,#f18d9b 0,#f18d9b 74px,transparent 0,transparent 82px)'
                }}
              ></div>
            </div>
            <Space direction='vertical' className='!w-full px-5'>
              <Flex justify='space-between' align='center'>
                <Typography.Title level={3}>Địa chỉ nhận hàng</Typography.Title>
                <Space direction='vertical'>
                  <Typography.Text>{order?.shippingMethod}</Typography.Text>
                  <Typography.Text>{order?.trackingNumber}</Typography.Text>
                </Space>
              </Flex>
              <Typography.Text strong>{order?.fullName}</Typography.Text>
              <Typography.Text type='secondary'>{order?.phoneNumber}</Typography.Text>
              <Typography.Text type='secondary'>{order?.shippingAddress}</Typography.Text>
            </Space>

            <Divider />
            <List
              itemLayout='horizontal'
              dataSource={orderDetails}
              renderItem={(item) => {
                const items: DescriptionsProps['items'] = [
                  {
                    key: '1',
                    label: 'Giới tính',
                    children: item.gender
                  },
                  {
                    key: '2',
                    label: 'Giá tiền',
                    children: formatCurrencyVND(item.price)
                  },
                  {
                    key: '3',
                    label: 'Số lượng',
                    children: formatCurrencyVNDToString(item.numberOfProducts)
                  }
                ]

                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Image
                          height={100}
                          src={getBirdImage(item.thumbnail)}
                          fallback='data:image/png;base64,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'
                        />
                      }
                      title={<Typography.Title level={5}>{item.birdName}</Typography.Title>}
                      description={<Descriptions items={items} column={1} />}
                    />
                  </List.Item>
                )
              }}
            />
            <Descriptions items={orderDes} column={1} bordered />
          </Space>
        )}
      </Skeleton>
    </div>
  )
}

export default OrderDetailPage
