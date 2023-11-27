import {
  App,
  Skeleton,
  Result,
  Space,
  Breadcrumb,
  Steps,
  Typography,
  Flex,
  Divider,
  List,
  Image,
  Descriptions,
  Button
} from 'antd'
import React, { useState, useMemo, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch } from '~/application/hooks/reduxHook'
import useFetchData from '~/application/hooks/useFetchData'
import type { StepProps, DescriptionsProps } from 'antd'
import {
  ShoppingCartOutlined,
  InboxOutlined,
  CarOutlined,
  CarryOutOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import axiosClient from '~/utils/api/axiosClient'
import { getBirdImage } from '~/utils/imageUtils'
import { BookingStatus } from '~/application/components/shared/constanst'
import { reFetchData } from '~/redux/slices'
import CountdownTimer from '~/application/components/shared/CountdownTimer'
import { formatCurrencyVND } from '~/utils/numberUtils'

interface BookingStep {
  status: 'wait' | 'error' | 'process' | 'finish'
  current: number
}
interface BirdImage {
  id: number
  imageUrl: string
}

interface Category {
  id: number
  name: string
}

interface BirdType {
  id: number
  name: string
}

interface Bird {
  createdAt: string
  updatedAt: string
  id: number
  name: string
  price: number
  thumbnail: string
  description: string
  category: Category
  birdType: BirdType
  status: boolean
  purebredLevel: string
  competitionAchievements: number
  age: string
  gender: string
  color: string
  quantity: number
  birdImages: BirdImage[]
}

interface BirdPairing {
  createdAt: string
  updatedAt: string
  id: number
  newBird: Bird
  status: string
}

interface BookingDetail {
  createdAt: string
  updatedAt: string
  id: number
  birdType: BirdType
  fatherBird: Bird
  motherBird: Bird
  status: string
  birdPairing: BirdPairing[]
}

interface RoleEntity {
  id: number
  name: string
}

interface User {
  createdAt: string
  updatedAt: string
  id: number
  fullName: string
  phoneNumber: string
  email: string
  address: string
  imageUrl: string
  roleEntity: RoleEntity
  emailVerified: boolean
  dob: string
  isActive: number
}

interface Booking {
  createdAt: string
  updatedAt: string
  id: number
  user: User
  fullName: string
  phoneNumber: string
  shippingAddress: string
  paymentMethod: string
  status: string
  paymentDeposit: number
  totalPayment: number
  bookingDetail: BookingDetail
  shippingMethod: string
  shippingMoney: number
  trackingNumber: string
}
const BookingDetailPage: React.FC = () => {
  const { id } = useParams()
  const { notification } = App.useApp()
  const dispatch = useAppDispatch()

  const [loading, error, response] = useFetchData(`/booking/${id}`)

  const [btnTakeBirdLoading, setBtnTakeBirdLoading] = useState<boolean>(false)
  const [btnNotTakeBirdLoading, setBtnNotTakeBirdLoading] = useState<boolean>(false)
  const [btnPaymentLoading, setBtnPaymentLoading] = useState<boolean>(false)

  const [bookingStep, setBookingStep] = useState<BookingStep>({
    status: 'process',
    current: 3
  })

  const [bookingDetailStep, setBookingDetailStep] = useState<BookingStep>({
    status: 'process',
    current: 0
  })

  const booking: Booking = useMemo(() => {
    if (!loading && !error && response) {
      return response.data
    }
    return null
  }, [loading, error, response])

  const pairings: BirdPairing[] = useMemo(() => {
    if (booking) return booking.bookingDetail.birdPairing
    return []
  }, [booking])

  const stepItems: StepProps[] =
    bookingStep.status !== 'error'
      ? [
          {
            title: bookingStep.current > 0 ? 'Đã trả trước' : 'Chờ trả trước',
            icon: <ShoppingCartOutlined />
          },
          {
            title:
              bookingStep.current === 1
                ? booking?.bookingDetail.status === 'Waiting'
                  ? 'Chờ xác nhận'
                  : 'Đã xác nhận'
                : bookingStep.current > 1
                ? 'Đã xác nhận'
                : 'Chờ xác nhận',
            icon: <CheckCircleOutlined />
          },
          {
            title:
              bookingStep.current === 2
                ? booking?.bookingDetail.status === 'Receiving_Confirm'
                  ? 'Đã nhận con'
                  : 'Đang nhận con'
                : bookingStep.current > 2
                ? 'Đã nhận con'
                : 'Chờ nhận con',
            icon: <InboxOutlined />
          },
          {
            title:
              bookingStep.current === 3
                ? 'Đang vận chuyển'
                : bookingStep.current > 3
                ? 'Đã vận chuyển'
                : 'Chờ vận chuyển',
            icon: <CarOutlined />
          },
          {
            title:
              bookingStep.current === 4 ? 'Đang giao hàng' : bookingStep.current > 4 ? 'Đã giao hàng' : 'Chờ giao hàng',
            icon: <CarryOutOutlined />
          }
        ]
      : [
          {
            title: bookingStep.current > 0 ? 'Đã trả trước' : 'Chờ trả trước',
            icon: bookingStep.current === 0 && bookingStep.status === 'error' ? null : <ShoppingCartOutlined />
          },
          {
            title:
              bookingStep.status === 'error'
                ? 'Đã hủy'
                : bookingStep.current === 1
                ? booking?.bookingDetail.status === 'Waiting'
                  ? 'Chờ xác nhận'
                  : 'Đã xác nhận'
                : bookingStep.current > 1
                ? 'Đã xác nhận'
                : 'Chờ xác nhận',
            icon: bookingStep.current === 1 && bookingStep.status === 'error' ? null : <CheckCircleOutlined />
          }
        ]

  const bookingDetailStepItems: StepProps[] = [
    {
      title: 'Nhân giống',
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Ấp trứng',
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Trứng nở hết',
      icon: <ShoppingCartOutlined />
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
      children: formatCurrencyVND(booking?.bookingDetail.fatherBird.price + booking?.bookingDetail.motherBird.price)
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
      children: formatCurrencyVND(booking?.shippingMoney)
    },
    {
      key: '3',
      label: 'Thành tiền',
      labelStyle: {
        textAlign: 'right'
      },
      contentStyle: {
        textAlign: 'right'
      },
      children: formatCurrencyVND(booking?.totalPayment)
    },
    {
      key: '4',
      label: 'Tiền đặt cọc',
      labelStyle: {
        textAlign: 'right'
      },
      contentStyle: {
        textAlign: 'right'
      },
      children: formatCurrencyVND(booking?.paymentDeposit)
    },
    {
      key: '5',
      label: 'Tiền phải trả',
      labelStyle: {
        textAlign: 'right'
      },
      contentStyle: {
        textAlign: 'right'
      },
      children: formatCurrencyVND(booking?.totalPayment - booking?.paymentDeposit)
    },
    {
      key: '6',
      label: 'Phương thức thanh toán nhận con',
      labelStyle: {
        textAlign: 'right'
      },
      contentStyle: {
        textAlign: 'right'
      },
      children: booking?.paymentMethod === 'Debit_Or_Credit_Card' ? 'VNPay' : 'Tiền mặt'
    }
  ]

  const checkPaymentStatus = async (bookingId: number): Promise<any> => {
    const response = await axiosClient.get(`/booking/${bookingId}`)
    return response.data
  }
  const longPollingCheckPaymentStatus = async (bookingId: number) => {
    const intervalId = setInterval(async () => {
      try {
        const data = await checkPaymentStatus(bookingId)
        const isPaymentSuccessful = data.status as any

        if (isPaymentSuccessful === BookingStatus.Confirmed || data?.bookingDetail.status === 'Receiving_Confirm') {
          clearInterval(intervalId) // Dừng long polling khi thanh toán thành công
          dispatch(reFetchData())
          setBtnPaymentLoading(false)
        }
      } catch (error) {
        // Xử lý lỗi (ví dụ: thông báo lỗi)
        console.error('Error checking payment status:', error)
      }
    }, 5000) // Gọi kiểm tra mỗi 5 giây (có thể điều chỉnh thời gian giữa các lần kiểm tra)
  }

  const checkDelivered = async (id: number, status: string) => {
    try {
      const response = await axiosClient.put(`booking/${id}/status?status=${status}`)
      if (response) {
        notification.success({ message: 'Xác nhận thành công' })
        dispatch(reFetchData())
      } else {
        notification.error({ message: 'Xác nhận thất bại !' })
      }
    } catch (err) {
      notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
    }
  }

  const handleRepay = async () => {
    setBtnPaymentLoading(true)
    try {
      const response = await axiosClient.get(`/booking/pay-unpaid-booking?id=${id}`)
      if (response) {
        // redirect tới trang thanh toán
        if (response.data) {
          window.open(response.data.url, '_blank')!.focus()
        }
        // gọi api check status
        await longPollingCheckPaymentStatus(booking.id)
      } else {
        notification.error({ message: 'Sorry! Something went wrong. App server error' })
      }
    } catch (err) {
      setBtnPaymentLoading(false)
      notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
    }
  }

  const handleTakeBird = async () => {
    setBtnTakeBirdLoading(true)
    try {
      const response = await axiosClient.put(`/bookingdetail/${id}/status?status=Receiving_Confirm`)
      if (response) {
        dispatch(reFetchData())
        setBtnTakeBirdLoading(false)
      } else {
        notification.error({ message: 'Sorry! Something went wrong. App server error' })
      }
    } catch (err) {
      setBtnTakeBirdLoading(false)
      notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
    }
  }

  const handleNotTakeBird = async () => {
    setBtnNotTakeBirdLoading(true)
    try {
      const response = await axiosClient.put(`/bookingdetail/${id}/status?status=Not_Receiving_Confirm`)
      if (response) {
        dispatch(reFetchData())
        setBtnNotTakeBirdLoading(false)
      } else {
        notification.error({ message: 'Sorry! Something went wrong. App server error' })
      }
    } catch (err) {
      setBtnNotTakeBirdLoading(false)
      notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
    }
  }

  const handleConfirm = () => {
    setBtnPaymentLoading(true)
    axiosClient
      .put(`/booking/${id}/status?status=Delivered`)
      .then((response) => {
        setBtnPaymentLoading(false)
        if (response) {
          dispatch(reFetchData())
        } else {
          notification.error({ message: 'Xác nhận thất bại' })
        }
      })
      .catch((err) => {
        setBtnPaymentLoading(false)
        notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
      })
  }

  const handlePay = async () => {
    setBtnPaymentLoading(true)
    try {
      const response = await axiosClient.get(`/booking/pay-total-booking?id=${id}`)
      if (response) {
        // redirect tới trang thanh toán
        if (response.data) {
          window.open(response.data.url, '_blank')!.focus()
        }
        // gọi api check status
        await longPollingCheckPaymentStatus(booking.id)
      } else {
        notification.error({ message: 'Sorry! Something went wrong. App server error' })
      }
    } catch (err) {
      setBtnPaymentLoading(false)
      notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
    }
  }

  useEffect(() => {
    if (!loading && !error && response) {
      const status = response.data.status as BookingStatus
      const status2nd = response.data.bookingDetail.status
      if (status == BookingStatus.Pending) {
        setBookingStep({
          status: 'process',
          current: 0
        })
      } else if (status == BookingStatus.Confirmed) {
        setBookingStep({
          status: 'process',
          current: 1
        })
      } else if (status == BookingStatus.Preparing) {
        setBookingStep({
          status: 'process',
          current: 2
        })
      } else if (status == BookingStatus.Shipping) {
        setBookingStep({
          status: 'process',
          current: 3
        })
      } else if (status == BookingStatus.Delivered) {
        setBookingStep({
          status: 'process',
          current: 4
        })
      } else if (status == BookingStatus.Cancelled) {
        setBookingStep({
          status: 'error',
          current: 1
        })
      }

      if (status2nd === 'In_Breeding_Progress') {
        setBookingDetailStep({
          status: 'process',
          current: 0
        })
      } else if (status2nd === 'Brooding') {
        setBookingDetailStep({
          status: 'process',
          current: 1
        })
      } else if (status2nd === 'Fledgling_All') {
        setBookingDetailStep({
          status: 'process',
          current: 2
        })
      }
    }
  }, [loading, error, response])

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        if (booking) {
          if (booking.status === BookingStatus.Pending && booking.paymentMethod === 'Debit_Or_Credit_Card') {
            const isPaymentSuccessful = await checkPaymentStatus(booking.id)

            if (isPaymentSuccessful === BookingStatus.Confirmed) {
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
  }, [dispatch, notification, booking])
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
                  title: <Link to='/booking'>Danh sách đơn lai chim</Link>
                },
                {
                  title: `Mã lai chim ${id}`
                }
              ]}
            />
            <Steps
              className='custom-step-content'
              // onChange={onStepChange}
              current={bookingStep.current}
              status={bookingStep.status}
              labelPlacement='vertical'
              items={stepItems}
            />
            <div>
              {booking?.status === BookingStatus.Pending && (
                <Flex justify='space-between' align='center' className='border-[1px] border-dashed p-5'>
                  <CountdownTimer createdAt={booking.createdAt} />
                  <Button
                    className='w-48'
                    size='large'
                    type='primary'
                    loading={btnPaymentLoading}
                    onClick={handleRepay}
                  >
                    Thanh toán trả trước
                  </Button>
                </Flex>
              )}
              {booking?.status === BookingStatus.Preparing &&
                booking.bookingDetail.status !== 'Receiving_Confirm' &&
                booking.bookingDetail.status !== 'Not_Receiving_Confirm' && (
                  <>
                    <Flex justify='flex-end' className='border-[1px] border-dashed p-5'>
                      {booking?.paymentMethod === 'Debit_Or_Credit_Card' ? (
                        <Button
                          className='w-48'
                          size='large'
                          type='primary'
                          loading={btnPaymentLoading}
                          onClick={handlePay}
                        >
                          Thanh toán nhận chim
                        </Button>
                      ) : (
                        <Button
                          className='w-48'
                          size='large'
                          type='primary'
                          loading={btnTakeBirdLoading}
                          onClick={handleTakeBird}
                        >
                          Nhận chim
                        </Button>
                      )}
                    </Flex>
                    <Flex justify='flex-end' className='border-[1px] border-dashed p-5'>
                      <Button
                        className='w-48'
                        size='large'
                        type='primary'
                        loading={btnNotTakeBirdLoading}
                        onClick={handleNotTakeBird}
                      >
                        Không nhận chim
                      </Button>
                    </Flex>
                  </>
                )}
              {booking?.status === BookingStatus.Shipping && (
                <Flex justify='flex-end' className='border-[1px] border-dashed p-5'>
                  <Button
                    className='w-48'
                    size='large'
                    type='primary'
                    loading={btnPaymentLoading}
                    onClick={handleConfirm}
                  >
                    Xác nhận
                  </Button>
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
                  <Typography.Text>{booking?.shippingMethod}</Typography.Text>
                  <Typography.Text>{booking?.trackingNumber}</Typography.Text>
                  <Typography.Link
                    href={`https://tracking.ghn.dev/?order_code=${booking?.trackingNumber}`}
                    target='_blank'
                  >
                    {booking?.trackingNumber}
                  </Typography.Link>
                </Space>
              </Flex>
              <Typography.Text strong>{booking?.fullName}</Typography.Text>
              <Typography.Text type='secondary'>{booking?.phoneNumber}</Typography.Text>
              <Typography.Text type='secondary'>{booking?.trackingNumber}</Typography.Text>
            </Space>

            <Divider />
            {booking?.status === 'Shipping' ? (
              <Button onClick={() => checkDelivered(booking.id, 'Delivered')} size='large'>
                Đã nhận hàng
              </Button>
            ) : (
              <></>
            )}
            <Typography.Title level={3}>Chim Bố x Chim Mẹ</Typography.Title>
            <List itemLayout='horizontal'>
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Image
                      height={100}
                      src={getBirdImage(booking?.bookingDetail.fatherBird.thumbnail)}
                      fallback='data:image/png;base64,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'
                    />
                  }
                  title={<Typography.Title level={5}>{booking?.bookingDetail.fatherBird.name}</Typography.Title>}
                  description={
                    <Descriptions
                      items={[
                        {
                          key: '1',
                          label: 'Giới tính',
                          children: booking?.bookingDetail.fatherBird.gender
                        }
                      ]}
                      column={1}
                    />
                  }
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Image
                      height={100}
                      src={getBirdImage(booking?.bookingDetail.motherBird.thumbnail)}
                      fallback='data:image/png;base64,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'
                    />
                  }
                  title={<Typography.Title level={5}>{booking?.bookingDetail.motherBird.name}</Typography.Title>}
                  description={
                    <Descriptions
                      items={[
                        {
                          key: '1',
                          label: 'Giới tính',
                          children: booking?.bookingDetail.motherBird.gender
                        }
                      ]}
                      column={1}
                    />
                  }
                />
              </List.Item>
            </List>

            {booking?.status !== BookingStatus.Pending && booking?.bookingDetail.status !== 'Waiting' && (
              <>
                <Divider />
                <Steps
                  className='custom-step-content'
                  // onChange={onStepChange}
                  current={bookingDetailStep.current}
                  status={bookingDetailStep.status}
                  labelPlacement='vertical'
                  items={bookingDetailStepItems}
                />
                <Typography.Title level={3}>Chim con</Typography.Title>
                <List
                  itemLayout='horizontal'
                  dataSource={pairings}
                  renderItem={(item) => {
                    if (item.status === 'Egg') {
                      return (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Image
                                height={100}
                                src={getBirdImage('egg.jpg')}
                                fallback='data:image/png;base64,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'
                              />
                            }
                            title={<Typography.Title level={5}>Trứng</Typography.Title>}
                          />
                        </List.Item>
                      )
                    } else {
                      const items: DescriptionsProps['items'] = [
                        {
                          key: '1',
                          label: 'Giới tính',
                          children: item.newBird.gender
                        }
                      ]
                      return (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Image
                                height={100}
                                src={getBirdImage(item.newBird.thumbnail)}
                                fallback='data:image/png;base64,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'
                              />
                            }
                            title={<Typography.Title level={5}>{item.newBird.name}</Typography.Title>}
                            description={<Descriptions items={items} column={1} />}
                          />
                        </List.Item>
                      )
                    }
                  }}
                />
              </>
            )}
            <Divider />
            <Descriptions items={orderDes} column={1} bordered />
          </Space>
        )}
      </Skeleton>
    </div>
  )
}

export default BookingDetailPage
