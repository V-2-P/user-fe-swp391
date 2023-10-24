import { EnvironmentOutlined } from '@ant-design/icons'
import { Button, Form, Input, List, Select, Tag } from 'antd'
import { useState } from 'react'
import { formatCurrencyVND } from '~/utils/numberUtils'

const Checkout: React.FC = () => {
  const [method, setMethod] = useState([
    { id: 1, name: 'Giao hàng nhanh', price: 40000 },
    { id: 2, name: 'Giao hàng tiết kiệm', price: 20000 }
  ])
  console.log(setMethod)

  const [payment, setPayment] = useState([
    { id: 'cast', name: 'Thanh toán trực tiếp' },
    { id: 'vnpay', name: 'Thanh toán qua cổng VNPay' }
  ])
  console.log(setPayment)

  const onFinish = (values: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const payload = {
      note: values.note,
      userId: 1,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      shippingAddress: values.shippingAddress,
      paymentMethod: values.paymentMethod,
      voucher: 'string',
      cartItems: cart.map((item: any) => ({
        birdId: item.id,
        quantity: item.quantity
      }))
    }
    console.log(payload)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div style={{ background: '#038777' }} className='px-[10%] py-5 space-y-5'>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout='vertical'
        initialValues={{
          fullName: 'Huu Nam',
          shippingAddress: 'Binh Duong',
          phoneNumber: '012345678'
        }}
      >
        <div className='bg-white p-3 space-y-2'>
          <div className='flex'>
            <EnvironmentOutlined />
            <p className='ml-2'>Thông tin người dùng</p>
          </div>
          <div className='flex space-x-5'>
            <Form.Item label='Tên người dùng' name='fullName' className='w-[25%] my-auto'>
              {/* <p className="w-[25%] font-bold my-auto">Tên người dùng (Số điện thoại)</p> */}
              <Input />
            </Form.Item>
            <Form.Item label='Số điện thoại' name='phoneNumber' className='w-[25%] my-auto'>
              <Input />
            </Form.Item>
            <Form.Item name='shippingAddress' label='Địa chỉ' className='w-[50%] my-auto'>
              {/* <p className="w-[65%] my-auto" >Địa chỉ khách hàng</p> */}
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
            <List.Item className=' bg-opacity-30 !flex !justify-normal rounded-md !font-semibold'>
              <div className='w-[30%] mx-[2%] flex gap-5'>
                <div className='w-[50%]'>
                  <img src='src/application/assets/images/background.png' />
                </div>
                <div className='w-[50%]'>
                  <Form.Item>
                    <p>Tên sản phẩm</p>
                  </Form.Item>
                </div>
              </div>
              <div className='w-[20%]'></div>
              <div className=' w-[15%] text-center'>
                <p>100000000</p>
              </div>
              <div className='w-[15%] text-center'>
                <p>1</p>
              </div>
              <div className='w-[15%] text-center'>
                <p className='text-red-500'>100000000</p>
              </div>
              <div className='w-[5%]'></div>
            </List.Item>
            <List.Item className=' bg-opacity-30 !flex !justify-normal rounded-md shadow-lg !font-semibold'>
              <div className='w-[30%] mx-[2%] flex gap-5'>
                <div className='w-[50%]'>
                  <img src='src/application/assets/images/background.png' />
                </div>
                <div className='w-[50%]'>
                  <p>Tên sản phẩm</p>
                </div>
              </div>
              <div className='w-[20%]'></div>
              <div className=' w-[15%] text-center'>
                <p>100000000</p>
              </div>
              <div className='w-[15%] text-center'>
                <p>1</p>
              </div>
              <div className='w-[15%] text-center'>
                <p className='text-red-500'>100000000</p>
              </div>
              <div className='w-[5%]'></div>
            </List.Item>
          </List>
          <List>
            <List.Item className='!p-0' style={{ backgroundColor: '#c0e1dd' }}>
              <div className='w-[45%] border-r-2 border-dashed border-black'>
                <div className='flex flex-col mx-[2%] space-y-2 px-5 py-3'>
                  <p className='text-sm font-semibold'>Ghi chú</p>
                  <Form.Item name='note'>
                    <Input className='!w-[60%]' placeholder='Lưu ý cho cửa hàng' />
                  </Form.Item>
                </div>
              </div>
              <div className='w-[50%] flex'>
                <div className='w-[10%]'></div>
                <p className='my-1 w-[30%] text-sm font-semibold'>Phương thức vận chuyển </p>
                <div className='w-[50%]'>
                  <Select
                    placeholder={'Vui lòng chọn phương thức vận chuyển'}
                    style={{ width: '100%' }}
                    options={method.map((e) => ({
                      value: e.id,
                      label: (
                        <span>
                          {e.name} {<Tag color={e.id === 1 ? 'red' : 'yellow'}>{formatCurrencyVND(e.price)}</Tag>}
                        </span>
                      )
                    }))}
                  />
                </div>
              </div>
            </List.Item>
          </List>
        </div>
        <div className='bg-white p-3 space-y-2'>
          <div className='flex border-b-2 border-solid border-black p-2'>
            <p className='w-[30%] text-lg font-semibold mt-1'>Phương thức thanh toán</p>
            <div className='w-[40%]'></div>
            <Form.Item className='w-[20%] mt-1' name='paymentMethod'>
              <Select
                placeholder={'Vui lòng chọn phương thức thanh toán'}
                style={{ width: '100%' }}
                options={payment.map((e) => ({
                  value: e.id,
                  label: <span>{e.name}</span>
                }))}
              />
            </Form.Item>
          </div>
          <div className='flex'>
            <div className='flex flex-col-reverse w-[50%]'>
              <p className='text-xs'>Nhấn đặt hàng đồng nghĩa với việc bạn tuân thủ các điều kiện của con chim xanh</p>
              <div className='w-full'></div>
            </div>
            <div className='flex w-[50%] justify-end'>
              <div className='w-[50%]'></div>
              <div className='w-[20%]'>
                <p className='text-xl font-semibold'>Tổng tiền</p>
              </div>
              <div className='w-[25%] space-y-1'>
                <p className='text-xl font-semibold text-red-500'>3.000.000đ</p>
                <Form.Item>
                  <Button type='primary' htmlType='submit'>
                    Đặt hàng
                  </Button>
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default Checkout
