import {
  AutoComplete,
  App,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Select,
  Typography,
  Space,
  Spin,
  Radio
} from 'antd'
import { useState, useEffect, useMemo, useCallback, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '~/application/hooks/reduxHook'
import { useCart } from '~/application/hooks/useCart'
import useFetchData from '~/application/hooks/useFetchData'
import axiosClient from '~/utils/api/axiosClient'
import { getBirdImage } from '~/utils/imageUtils'
import { formatCurrencyVND } from '~/utils/numberUtils'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import debounce from 'lodash/debounce'
import axios from 'axios'
import { formatRequestDate, timestampToDate } from '~/utils/dateUtils'

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
  const payment = [
    { value: 'cast', label: 'Tiền mặt' },
    { value: 'vnpay', label: 'VNPay' }
  ]
  const [shippingService, setShippingService] = useState<
    { serviceTypeId: number; serviceName: string; expectedDate: number; price: number }[]
  >([
    {
      serviceTypeId: 2,
      serviceName: 'Chuyển phát thương mại điện tử',
      expectedDate: 1700783999,
      price: 50000
    }
  ])
  const [loadingAddressOptions, setLoadingAddressOptions] = useState<boolean>(false)
  const [addressOptions, setAddressOptions] = useState<{ value: string; label: string }[]>()
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const { notification } = App.useApp()
  const [form] = Form.useForm()

  const districtId = Form.useWatch('districtId', form)
  const wardId = Form.useWatch('wardId', form)
  const serviceTypeId = Form.useWatch('serviceTypeId', form)
  const navigate = useNavigate()
  const { userId } = useAppSelector((state) => state.account)

  const [loadingUser, errorUser, responseUser] = useFetchData(`/user/me`)
  const [loadingVoucher, errorVoucher, responseVoucher] = useFetchData(`/voucher/customer`)
  const [loadingDistrict, errorDistrict, responseDistrict] = useFetchData(`/shipments/district?province_id=202`)
  const [loadingWard, errorWard, responseWard] = useFetchData(
    `/shipments/ward?district_id=${districtId}`,
    districtId === undefined ? null : districtId
  )

  const districtOptions = useMemo(() => {
    if (responseDistrict) {
      return responseDistrict.data.map((district: any) => ({
        value: district.DistrictID,
        label: district.DistrictName
      }))
    }
    return []
  }, [responseDistrict])

  const wardOptions = useMemo(() => {
    if (responseWard) {
      return responseWard.data.map((ward: any) => ({
        value: ward.WardCode,
        label: ward.WardName
      }))
    }
    return []
  }, [responseWard])

  const vouchers: Voucher[] = useMemo(() => {
    if (!loadingVoucher && !errorVoucher && responseVoucher) {
      return responseVoucher.data
    }
    return []
  }, [loadingVoucher, errorVoucher, responseVoucher])

  const shipService = useMemo(
    () => shippingService.find((s) => s.serviceTypeId === serviceTypeId),
    [serviceTypeId, shippingService]
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchAddress = useCallback(
    debounce(async (nextValue: any) => {
      setLoadingAddressOptions(true)
      if (nextValue) {
        const res = await axios.get(
          `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=${nextValue}&countryCode=VNM&f=pjson`
        )
        const data = res.data.suggestions
        const options = data.map((d: any) => ({ value: d.text, label: d.text }))
        setLoadingAddressOptions(false)
        setAddressOptions(options)
      } else {
        setLoadingAddressOptions(false)
        setAddressOptions([])
      }
    }, 1000),
    []
  )

  const handleSearchAddress = (value: any) => {
    debouncedSearchAddress(value)
  }

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
      ...(values.note && { note: values.note }),
      userId: userId,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      shippingAddress: values.shippingAddress,
      paymentMethod: values.paymentMethod,
      ...(shipService && { shippingMethod: shipService.serviceName }),
      ...(shipService && { shippingMoney: shipService.price }),
      ...(shipService && { expectedDate: formatRequestDate(timestampToDate(shipService.expectedDate)) }),
      ...(voucher && { voucherId: voucher.id }),
      cartItems: Object.values(cart.items).map((item: any) => ({
        birdId: item.id,
        quantity: item.quantity
      }))
    }

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
        console.log(err)
        setLoadingCheckout(false)
        notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
  const handleSearchVoucher = (e: any) => {
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
    form.setFieldsValue({
      wardId: null
    })
  }, [form, districtId])

  useEffect(() => {
    if (errorDistrict) {
      notification.error({ message: errorDistrict })
    }
    if (errorWard) {
      notification.error({ message: errorWard })
    }
  }, [errorDistrict, errorWard, notification])

  useEffect(() => {
    const getAllServices = async (payload: any) => {
      const result: { serviceTypeId: number; serviceName: string; expectedDate: number; price: number }[] = []
      const serviceRes = await axiosClient.post('/shipments/available-services', payload)
      const services: { service_id: number; service_type_id: number; short_name: string }[] = serviceRes.data
      for (const service of services) {
        const payloadFee = {
          to_district_id: districtId,
          to_ward_code: wardId,
          service_type_id: service.service_type_id
        }
        try {
          const feeRes = await axiosClient.post('/shipments/fee', payloadFee)

          const payloadLeatime = {
            to_district_id: districtId,
            to_ward_code: wardId,
            service_id: service.service_id
          }

          const leadTimeRes = await axiosClient.post('/shipments/leadtime', payloadLeatime)

          result.push({
            serviceTypeId: service.service_type_id,
            serviceName: service.short_name,
            price: feeRes.data.total,
            expectedDate: leadTimeRes.data.leadtime
          })
        } catch (err) {
          // notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
        }
      }
      setShippingService(result)
    }
    if (districtId && wardId) {
      const payloadFindService = {
        shop_id: 4710975,
        from_district: 1463,
        to_district: districtId
      }
      getAllServices(payloadFindService)
    }
  }, [districtId, wardId, serviceTypeId, notification])
  return (
    <div style={{ background: '#038777' }} className='md:px-20'>
      <Form
        style={{ maxWidth: 'none', padding: 24 }}
        form={form}
        initialValues={{ districtId: null, wardId: null, provinceId: null }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout='vertical'
      >
        <Row className='bg-white rounded-lg p-5' gutter={32}>
          <Col span={24}>
            <Typography.Title level={3}>Thông tin người dùng</Typography.Title>
          </Col>
          <Col span={12} order={1}>
            <Form.Item
              label='Tên người dùng'
              name='fullName'
              rules={[{ required: true, message: 'Xin hãy nhập tên người dùng' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12} order={3}>
            <Form.Item
              label='Số điện thoại'
              name='phoneNumber'
              rules={[{ required: true, message: 'Xin hãy nhập Số điện thoại' }]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col span={12} order={2}>
            <Form.Item label='Địa chỉ' name='shippingAddress' rules={[{ required: true, message: 'Xin hãy địa chỉ' }]}>
              <AutoComplete
                notFoundContent={loadingAddressOptions ? <Spin size='small' /> : null}
                options={addressOptions}
                style={{ width: '100%' }}
                onSearch={handleSearchAddress}
                placeholder='Nhập địa chỉ nhận hàng'
              />
              {/* <Input /> */}
            </Form.Item>
          </Col>

          <Col span={12} order={4}>
            <Form.Item
              label='Quận / Huyện'
              name='districtId'
              rules={[{ required: true, message: 'Xin hãy chọn Quận / HUyện' }]}
            >
              <Select
                notFoundContent={loadingDistrict ? <Spin size='small' /> : null}
                showSearch
                filterOption={filterOption}
                placeholder={'Chọn Quận / Huyện'}
                style={{ width: '100%' }}
                options={districtOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12} order={5} offset={12}>
            <Form.Item
              label='Phường / Xã'
              name='wardId'
              rules={[{ required: true, message: 'Xin hãy chọn Phường / Xã' }]}
            >
              <Select
                notFoundContent={loadingWard ? <Spin size='small' /> : null}
                disabled={districtId ? false : true}
                showSearch
                filterOption={filterOption}
                placeholder={'Chọn Phường / Xã'}
                style={{ width: '100%' }}
                options={wardOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className='bg-white rounded-lg' gutter={[32, 32]}>
          <Col span={24} className='!shadow-lg p-5'>
            <Row gutter={32} className='px-5'>
              <Col span={12}>
                <Typography.Title level={5}>Sản phẩm</Typography.Title>
              </Col>
              <Col span={4}>
                <Typography.Title level={5}>Đơn giá</Typography.Title>
              </Col>
              <Col span={4}>
                <Typography.Title level={5}>Số lượng</Typography.Title>
              </Col>
              <Col span={4}>
                <Typography.Title level={5}>Số tiền</Typography.Title>
              </Col>
            </Row>
          </Col>
          <Col span={24} className='p-5 pt-0'>
            <Row gutter={[32, 32]} className='px-5'>
              {Object.values(cart.items).map((item) => (
                <Fragment key={item.id}>
                  <Col span={12}>
                    <Flex gap={20}>
                      <Image
                        width={200}
                        src={getBirdImage(item.detail?.thumbnail)}
                        preview={false}
                        fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=='
                      />
                      <Typography.Text strong>{item.detail?.name}</Typography.Text>
                    </Flex>
                  </Col>
                  <Col span={4}>
                    <Typography.Text>{formatCurrencyVND(item.price)}</Typography.Text>
                  </Col>
                  <Col span={4}>
                    <Typography.Text>{item.quantity}</Typography.Text>
                  </Col>
                  <Col span={4}>
                    <Typography.Text> {formatCurrencyVND(item.quantity * item.price)}</Typography.Text>
                  </Col>
                </Fragment>
              ))}
            </Row>
          </Col>
        </Row>
        <Row className='bg-white rounded-lg' gutter={[32, 32]}>
          <Col span={24} className='p-5 bg-[#c0e1dd] rounded-t-lg'>
            <Carousel responsive={responsive} className='py-5'>
              {vouchers.map((e) => (
                <div className='mx-5' key={e.id}>
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
                        disabled={districtId && wardId ? false : true}
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
          </Col>
          <Col span={24} className='p-5 pt-0'>
            <Form.Item
              name='serviceTypeId'
              initialValue={2}
              label={
                <Typography.Title level={5} className='px-5'>
                  Gói cước
                </Typography.Title>
              }
            >
              <Radio.Group className='w-full' disabled={districtId && wardId ? false : true}>
                <Row className='px-5' gutter={[16, 16]}>
                  {shippingService.map((service, index) => (
                    <Col span={8} key={index}>
                      <Radio value={service.serviceTypeId}>
                        <Space direction='vertical' className='!w-full'>
                          <Typography.Text strong className='!text-[#157e3c]'>
                            {service.serviceName} {formatCurrencyVND(service.price)}
                          </Typography.Text>

                          <Typography.Text strong className='!text-[#00467F]'>
                            Ngày giao dự kiến {timestampToDate(service.expectedDate)}
                          </Typography.Text>
                        </Space>
                      </Radio>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24} className='p-5 pt-0'>
            <Row className='px-5'>
              <Col span={16}>
                <Typography.Title level={5}>Nhập voucher</Typography.Title>
              </Col>
              <Col span={8}>
                <Col span={24}>
                  <Form.Item>
                    <Input.Search
                      disabled={districtId && wardId ? false : true}
                      value={searchText}
                      onChange={handleSearchVoucher}
                      status={searchStatus}
                      className='!w-full'
                      placeholder='Mã code'
                    />
                  </Form.Item>
                </Col>
              </Col>
            </Row>
            <Row className='px-5'>
              <Col span={16}>
                <Typography.Title level={5}>Ghi Chú</Typography.Title>
              </Col>
              <Col span={8}>
                <Col span={24}>
                  <Form.Item name='note'>
                    <Input.TextArea
                      disabled={districtId && wardId ? false : true}
                      autoSize={{ minRows: 6 }}
                      className='!w-full'
                      placeholder='Lưu ý cho cửa hàng'
                    />
                  </Form.Item>
                </Col>
              </Col>
            </Row>

            <Row className='px-5'>
              <Col span={16}>
                <Typography.Title level={5}>Phương thức thanh toán</Typography.Title>
              </Col>
              <Col span={8}>
                <Form.Item name='paymentMethod' rules={[{ required: true, message: 'Chọn phương thức thanh toán' }]}>
                  <Select
                    disabled={districtId && wardId ? false : true}
                    placeholder={'Chọn phương thức thanh toán'}
                    style={{ width: '100%' }}
                    defaultValue={'vnpay'}
                    options={payment}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className='px-5'>
              <Col span={16}>
                <Typography.Text strong>
                  Nhấn đặt hàng đồng nghĩa với việc bạn tuân thủ các điều kiện của con chim xanh
                </Typography.Text>
              </Col>
              <Col span={8}>
                <Flex justify='center' align='end' gap={10} vertical>
                  <Space>
                    <Typography.Text strong className='!text-xl'>
                      Tổng tiền :
                    </Typography.Text>
                    <Typography.Text strong className='!text-xl !text-red-500'>
                      {formatCurrencyVND(
                        cart.totalPrice + (shipService ? shipService.price : 0) - (voucher ? voucher.discount : 0)
                      )}
                    </Typography.Text>
                  </Space>
                  <Form.Item>
                    <Button
                      disabled={districtId && wardId ? false : true}
                      loading={loadingCheckout}
                      type='primary'
                      htmlType='submit'
                    >
                      Đặt hàng
                    </Button>
                  </Form.Item>
                </Flex>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Checkout
