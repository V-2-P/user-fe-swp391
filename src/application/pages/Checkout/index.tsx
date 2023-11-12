import { EnvironmentOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Image,
  Input,
  List,
  Result,
  Row,
  Select,
  Skeleton,
  Tag,
  Typography,
  Space
} from 'antd'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '~/application/hooks/reduxHook'
import { useCart } from '~/application/hooks/useCart'
import useFetchData from '~/application/hooks/useFetchData'
import axiosClient from '~/utils/api/AxiosClient'
import { getBirdImage } from '~/utils/imageUtils'
import { formatCurrencyVND } from '~/utils/numberUtils'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import debounce from 'lodash/debounce'
const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024
    },
    items: 3,
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

type Voucher = {
  createdAt: string
  updatedAt: string
  id: number
  discount: number
  name: string
  amount: number
  minValue: number
  code: string
  description: string
  startDate: string
  expirationDate: string
  status: string
}

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart()
  const [searchStatus, setSearchStatus] = useState<'' | 'error' | 'warning'>('')
  const [voucher, setVoucher] = useState<Voucher>()
  const [searchText, setSearchText] = useState<string>()
  const [shippindMethod, setShippingMethod] = useState<any[]>([])
  const payment = [
    { value: 'cast', label: 'Tiền mặt' },
    { value: 'vnpay', label: 'VNPay' }
  ]

  const [loadingShipping, errorShipping, responseShipping] = useFetchData(`/shippingmethod`)
  const [loadingUser, errorUser, responseUser] = useFetchData(`/user/me`)
  const [loadingVoucher, errorVoucher, responseVoucher] = useFetchData(`/voucher/customer`)

  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const { notification } = App.useApp()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { userId } = useAppSelector((state) => state.account)

  const shippindId = Form.useWatch('shippingMethod', form)

  const vouchers: Voucher[] = useMemo(() => {
    if (!loadingVoucher && !errorVoucher && responseVoucher) {
      return responseVoucher.data
    }
    return []
  }, [loadingVoucher, errorVoucher, responseVoucher])

  const shippingPrice = useMemo(() => {
    if (shippindId && shippindMethod.find((e: any) => e.id === shippindId) !== -1) {
      return shippindMethod.find((e: any) => e.id === shippindId)?.shippingMoney
    } else {
      return 0
    }
  }, [shippindId, shippindMethod])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (nextValue: any) => {
      if (nextValue) {
        const v = vouchers.find((e) => e.code === nextValue)
        if (v) {
          if (cart.totalPrice < v.minValue) {
            setVoucher(undefined)
            setSearchStatus('error')
          } else {
            setVoucher(v)
            setSearchStatus('')
          }
        } else {
          setVoucher(undefined)
          setSearchStatus('error')
        }
      } else {
        setVoucher(undefined)
        setSearchStatus('')
      }
    }, 1000),
    [vouchers]
  )
  const onFinish = (values: any) => {
    setLoadingCheckout(true)
    const payload = {
      note: values.note,
      userId: userId,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      shippingAddress: values.shippingAddress,
      paymentMethod: values.paymentMethod,
      shippingMethod: values.shippingMethod,
      ...(voucher && { voucherId: voucher.id }),
      cartItems: Object.values(cart.items).map((item: any) => ({
        birdId: item.id,
        quantity: item.quantity
      }))
    }
    console.log(payload)
    axiosClient
      .post('/orders', payload)
      .then((response) => {
        setLoadingCheckout(false)
        if (response) {
          notification.success({ message: 'Đặt hàng thành công' })
          clearCart()
          if (response.data.paymentRespone) {
            window.open(response.data.paymentRespone.url, '_blank')!.focus()
          }
          navigate(`/orderdetail/${response.data.orderId}`)
        } else {
          notification.error({ message: 'Đặt hàng thất bại' })
        }
      })
      .catch((err) => {
        setLoadingCheckout(false)
        notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const handleSearch = (e: any) => {
    debouncedSave(e.target.value)
    setSearchText(e.target.value)
  }
  useEffect(() => {
    if (!loadingUser && !errorUser && responseUser) {
      form.setFieldsValue({
        fullName: responseUser?.data.fullName,
        shippingAddress: responseUser?.data.address,
        phoneNumber: responseUser?.data.phoneNumber,
        paymentMethod: 'vnpay'
      })
    }
  }, [loadingUser, errorUser, responseUser, form])
  useEffect(() => {
    if (!loadingShipping && !errorShipping && responseShipping) {
      setShippingMethod(responseShipping.data)
    }
  }, [loadingShipping, errorShipping, responseShipping])

  return (
    <div style={{ background: '#038777' }} className='px-[10%] py-5 space-y-5'>
      <Skeleton loading={loadingShipping}>
        {errorShipping ? (
          <Result title='Failed to fetch' subTitle={errorShipping} status='error' />
        ) : (
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} layout='vertical'>
            <div className='bg-white p-3 space-y-2'>
              <div className='flex'>
                <EnvironmentOutlined />
                <p className='ml-2'>Thông tin người dùng</p>
              </div>
              <div className='flex space-x-5'>
                <Form.Item
                  label='Tên người dùng'
                  name='fullName'
                  className='w-[25%] my-auto'
                  rules={[{ required: true, message: 'Xin hãy nhập tên người dùng' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label='Số điện thoại'
                  name='phoneNumber'
                  className='w-[25%] my-auto'
                  rules={[{ required: true, message: 'Xin hãy nhập Số điện thoại' }]}
                >
                  <Input className='!w-full' maxLength={10} />
                </Form.Item>
                <Form.Item
                  name='shippingAddress'
                  label='Địa chỉ'
                  className='w-[50%] my-auto'
                  rules={[{ required: true, message: 'Xin hãy nhập địa chỉ' }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className='bg-white'>
              <List>
                <List.Item className=' bg-opacity-30 !flex !justify-normal mb-5 rounded-md shadow-lg !font-semibold'>
                  <div className='w-[30%] mx-[2%]'>Sản phẩm</div>
                  <div className='w-[20%]'></div>
                  <div className=' w-[15%] text-center'>Đơn giá</div>
                  <div className='w-[15%] text-center'>Số lượng</div>
                  <div className='w-[15%] text-center'>Số tiền</div>
                  <div className='w-[5%]'></div>
                </List.Item>
              </List>
              <List>
                {Object.values(cart.items).map((item) => (
                  <List.Item className=' bg-opacity-30 !flex !justify-normal rounded-md !font-semibold'>
                    <div className='w-[30%] mx-[2%] flex gap-5'>
                      <div className='w-[50%]'>
                        <Image
                          src={getBirdImage(item.detail?.thumbnail)}
                          className='text-center w-full h-full object-cover'
                          preview={false}
                          fallback='data:image/png;base64,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'
                        />
                      </div>
                      <div className='w-[50%] my-auto'>
                        <p>{item.detail?.name}</p>
                      </div>
                    </div>
                    <div className='w-[20%]'></div>
                    <div className=' w-[15%] text-center'>
                      <p>{formatCurrencyVND(item.price)}</p>
                    </div>
                    <div className='w-[15%] text-center'>
                      <p>{item.quantity}</p>
                    </div>
                    <div className='w-[15%] text-center'>
                      <p className='text-red-500'> {formatCurrencyVND(item.quantity * item.price)}</p>
                    </div>
                    <div className='w-[5%]'></div>
                  </List.Item>
                ))}
              </List>

              <div className='p-3 bg-[#c0e1dd]'>
                <Carousel responsive={responsive}>
                  {vouchers.map((e) => (
                    <div className='mx-5'>
                      <Card title={`${e.name}`} hoverable className='!h-[200px]'>
                        <Space direction='vertical'>
                          <Flex justify='space-between' vertical>
                            <div>
                              <Typography.Text>Voucher có giá trị: {formatCurrencyVND(e.discount)}</Typography.Text>
                              <br />
                              <Typography.Text>Voucher code: {e.code}</Typography.Text>
                            </div>
                            <div>
                              <Typography.Text>
                                Áp dụng cho đơn hàng từ{' '}
                                <Typography.Text type='danger'>{formatCurrencyVND(e.minValue)}</Typography.Text>
                              </Typography.Text>
                            </div>
                          </Flex>
                          <Button
                            onClick={() => {
                              if (cart.totalPrice >= e.minValue) {
                                debouncedSave(e.code)
                                setSearchText(e.code)
                              } else {
                                notification.error({ message: 'Bạn không đủ điều kiện' })
                              }
                            }}
                            type='primary'
                          >
                            Áp dụng ngay
                          </Button>
                        </Space>
                      </Card>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>

            <div className='bg-white p-3 space-y-2'>
              <Row>
                <Col span={16}>
                  <p className='w-[30%] text-lg font-semibold mt-1'>Nhập voucher</p>
                </Col>
                <Col span={8}>
                  <Col span={24}>
                    <Form.Item>
                      <Input.Search
                        value={searchText}
                        onChange={handleSearch}
                        status={searchStatus}
                        className='!w-full'
                        placeholder='Mã code'
                      />
                    </Form.Item>
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <p className='w-[30%] text-lg font-semibold mt-1'>Ghi Chú</p>
                </Col>
                <Col span={8}>
                  <Col span={24}>
                    <Form.Item name='note'>
                      <Input.TextArea autoSize={{ minRows: 6 }} className='!w-full' placeholder='Lưu ý cho cửa hàng' />
                    </Form.Item>
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <p className='w-[30%] text-lg font-semibold mt-1'>Phương thức vận chuyển</p>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='shippingMethod'
                    rules={[{ required: true, message: 'Xin hãy chọn phương thức vận chuyển' }]}
                  >
                    <Select
                      placeholder={'Vui lòng chọn phương thức vận chuyển'}
                      options={shippindMethod.map((e: any) => ({
                        value: e.id,
                        label: (
                          <span>
                            {e.name}{' '}
                            {
                              <Tag color={e.id === 1 ? 'red' : 'yellow'}>
                                {formatCurrencyVND(e.shippingMoney ? e.shippingMoney : 0)}
                              </Tag>
                            }
                          </span>
                        )
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <p className='w-[30%] text-lg font-semibold mt-1'>Phương thức thanh toán</p>
                </Col>
                <Col span={8}>
                  <Form.Item name='paymentMethod' rules={[{ required: true, message: 'Chọn phương thức thanh toán' }]}>
                    <Select
                      placeholder={'Chọn phương thức thanh toán'}
                      style={{ width: '100%' }}
                      defaultValue={'vnpay'}
                      options={payment}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div className='flex'>
                <div className='flex flex-col-reverse w-[50%]'>
                  <p className='text-xs'>
                    Nhấn đặt hàng đồng nghĩa với việc bạn tuân thủ các điều kiện của con chim xanh
                  </p>
                  <div className='w-full'></div>
                </div>
                <div className='flex w-[50%] justify-end'>
                  <div className='w-[50%]'></div>
                  <div className='w-[20%]'>
                    <p className='text-xl font-semibold'>Tổng tiền</p>
                  </div>
                  <div className='w-[25%] space-y-1'>
                    <p className='text-xl font-semibold text-red-500'>
                      {formatCurrencyVND(cart.totalPrice + shippingPrice - (voucher ? voucher.discount : 0))}
                    </p>
                    <Form.Item>
                      <Button loading={loadingCheckout} type='primary' htmlType='submit'>
                        Đặt hàng
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Skeleton>
    </div>
  )
}

export default Checkout
