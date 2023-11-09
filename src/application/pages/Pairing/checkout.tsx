import { EnvironmentOutlined } from '@ant-design/icons'
import { App, Button, Col, Form, Input, Result, Row, Select, Skeleton, Tag, Typography } from 'antd'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '~/application/hooks/reduxHook'
import useFetchData from '~/application/hooks/useFetchData'
import { usePairing } from '~/application/hooks/usePairing'
import axiosClient from '~/utils/api/AxiosClient'
import { formatCurrencyVND } from '~/utils/numberUtils'
import PairingItem from './pairingItem'

const PairingCheckout: React.FC = () => {
  const { pairing, clearPairingList } = usePairing()
  const [shippindMethod, setShippingMethod] = useState<any[]>([])
  const payment = [
    { value: 'cast', label: 'Tiền mặt' },
    { value: 'vnpay', label: 'VNPay' }
  ]

  const [loadingShipping, errorShipping, responseShipping] = useFetchData(`/shippingmethod`)
  const [loadingUser, errorUser, responseUser] = useFetchData(`/user/me`)

  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const { notification } = App.useApp()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { userId } = useAppSelector((state) => state.account)

  const shippindId = Form.useWatch('shippingMethod', form)

  const motherBird = useMemo(() => {
    return pairing.mother
  }, [pairing.mother])
  const fatherBird = useMemo(() => {
    return pairing.father
  }, [pairing.father])
  const shippingPrice = useMemo(() => {
    if (shippindId && shippindMethod.find((e: any) => e.id === shippindId) !== -1) {
      return shippindMethod.find((e: any) => e.id === shippindId)?.shippingMoney
    } else {
      return 0
    }
  }, [shippindId, shippindMethod])

  const onFinish = (values: any) => {
    setLoadingCheckout(true)
    const payload = {
      userId: userId,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      shippingAddress: values.shippingAddress,
      paymentMethod: values.paymentMethod,
      bookingDetailRequest: {
        birdTypeId: 0,
        fatherBirdId: 0,
        motherBirdId: 0
      }
      // note: values.note,
      // userId: userId,
      // fullName: values.fullName,
      // phoneNumber: values.phoneNumber,
      // shippingAddress: values.shippingAddress,
      // paymentMethod: values.paymentMethod,
      // shippingMethod: values.shippingMethod,
      // ...(values?.voucherId && { voucherId: values.voucherId }),
      // cartItems: Object.values(cart.items).map((item: any) => ({
      //   birdId: item.id,
      //   quantity: item.quantity
      // }))
    }
    console.log(payload)
    axiosClient
      .post('/booking', payload)
      .then((response) => {
        setLoadingCheckout(false)
        if (response) {
          notification.success({ message: 'Đặt lai chim thành công' })
          clearPairingList()
          navigate('/productlist')
        } else {
          notification.error({ message: 'Đặt lai chim thất bại' })
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

  const totalPrice = () => {
    let price = 0
    price += motherBird!.detail!.price
    price += fatherBird!.detail!.price
    return formatCurrencyVND(price + shippingPrice)
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
              <Row className='bg-white p-3' gutter={[0, 16]}>
                <Col span={24}>
                  <Typography.Title level={5}>
                    Chim Trống - {formatCurrencyVND(fatherBird!.detail!.price)}
                  </Typography.Title>
                  <PairingItem bird={fatherBird!.detail!} type={'checkout'} />
                </Col>
                <Col span={24}>
                  <Typography.Title level={5}>
                    Chim Mái - {formatCurrencyVND(motherBird!.detail!.price)}
                  </Typography.Title>
                  <PairingItem bird={motherBird!.detail!} type={'checkout'} />
                </Col>
              </Row>
            </div>

            <div className='bg-white p-3 space-y-2'>
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
                    <p className='text-xl font-semibold text-red-500'>{totalPrice()}</p>
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

export default PairingCheckout
