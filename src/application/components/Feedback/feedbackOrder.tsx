import { App, Button, Form, Image, Input, Modal, Rate, Skeleton } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState } from 'react'
import axiosClient from '~/utils/api/AxiosClient'
import { formatCurrencyVND } from '~/utils/numberUtils'

interface OrderDetail {
  id: number
  birdId: number
  birdName: string
  thumbnail: string
  gender: string
  price: number
  numberOfProducts: number
}

interface Order {
  id: number
  userId: number
  fullName: string
  phoneNumber: string
  shippingAddress: string
  note: string
  totalMoney: number
  totalPayment: number
  discount: number
  orderDate: string
  status: 'pending' | 'processing' | 'completed' // Sử dụng enum để xác định các giá trị hợp lệ
  paymentMethod: string
  shippingMethod: string
  shippingMoney: number
  shippingDate: string
  trackingNumber: string
  orderDetails: OrderDetail[]
}

export type Bird = {
  id: number
  name: string
  categoryName: string
  birdType: string
  gender: string
  color: string
  price: number
  quantity: number
  thumbnail: string
  competitionAchievements: number
  purebredLevel: string
  description: string
  totalRating: number
  countRating: number
  sold: number
  status: boolean
  bird_images: {
    id: number
    imageUrl: string
  }[]
}

type OrderDetailProps = {
  orderId: number
}

export const FeedbackOrder: React.FC<OrderDetailProps> = ({ orderId }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const { notification } = App.useApp()
  const [form] = Form.useForm()
  const [bird, setBird] = useState<Order>()
  const [loading, setLoading] = useState(false)
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  const showFeedbackModal = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    setFeedbackOpen(true)
    try {
      const response = await axiosClient.get(`/orders/${orderId}`)
      setLoading(false)
      if (response) {
        setBird(response.data)
      } else {
        notification.error({ message: 'Error j do' })
      }
    } catch (err) {
      setLoading(false)
      notification.error({ message: 'Error hoai nha' })
    }
  }

  const onSubmit = (values: any) => {
    setLoadingFeedback(true)
    const payload = {
      orderId: orderId,
      birdFeedbacks: values.birdFeedbacks
    }
    axiosClient
      .post('/feedbackbirds', payload)
      .then((response) => {
        setLoadingFeedback(false)
        if (response) {
          notification.success({ message: 'Đánh giá thành công' })
          form.resetFields()
          setFeedbackOpen(false)
        } else {
          notification.error({ message: 'Đánh giá thất bại' })
        }
      })
      .catch((err) => {
        setLoadingFeedback(false)
        notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
      })
  }

  console.log(orderId)
  const handleFeedbackOk = () => {
    setFeedbackOpen(false)
  }

  const handleFeedbackCancel = () => {
    setFeedbackOpen(false)
  }
  console.log(bird?.orderDetails)
  return (
    <div>
      <Button type='primary' onClick={showFeedbackModal}>
        Đánh giá
      </Button>
      <Modal
        footer={false}
        title={`Mã đơn hàng : ${orderId}`}
        width={'70%'}
        open={feedbackOpen}
        onOk={handleFeedbackOk}
        onCancel={handleFeedbackCancel}
      >
        <Skeleton loading={loading}>
          <Form form={form} onFinish={onSubmit}>
            {bird?.orderDetails &&
              bird?.orderDetails.map((e: any, index: any) => (
                <>
                  <div className='w-full mx-[2%] flex gap-5'>
                    <div className='w-[20%]'>
                      <Image
                        src={`https://api.techx.id.vn/uploads/birds/${e?.thumbnail}`}
                        className='text-center w-full h-full object-cover'
                        preview={false}
                        fallback='data:image/png;base64,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'
                      />
                    </div>
                    <div className='w-[50%] ml-5 flex flex-col space-y-3'>
                      <p className='text-xl'>{e?.birdName}</p>
                      <p>Giới tính: {e?.gender}</p>
                      <p>Giá tiền: {e?.price ? formatCurrencyVND(e?.price) : 0}</p>
                      <p>Số sản phẩm đã mua: {e?.numberOfProducts}</p>
                      <Form.Item
                        name={['birdFeedbacks', index, 'rating']}
                        rules={[{ required: true, message: 'Xin hãy đánh giá' }]}
                      >
                        <Rate key={e.id}></Rate>
                      </Form.Item>
                    </div>
                  </div>
                  <div className='px-4 flex h-full'>
                    <Form.Item className='w-full h-full' name={['birdFeedbacks', index, 'comment']} key={e.id}>
                      <TextArea className='h-full' placeholder='Thêm đánh giá' autoSize={{ minRows: 5, maxRows: 5 }} />
                    </Form.Item>
                    <div className='w-[5%]'></div>
                  </div>

                  <Form.Item
                    className='w-full h-full'
                    initialValue={e.birdId}
                    name={['birdFeedbacks', index, 'birdId']}
                    key={e.id}
                  >
                    <Input type='hidden' />
                  </Form.Item>
                </>
              ))}

            <div className='w-full flex space-x-5 mx-2 h-full'>
              <Button className='w-[30%]'>Xóa tất cả</Button>
              <Form.Item className='w-[30%]'>
                <Button loading={loadingFeedback} className='!w-full' type='primary' htmlType='submit'>
                  Lưu
                </Button>
              </Form.Item>
              <Button className='w-[30%]' onClick={handleFeedbackCancel}>
                Hủy
              </Button>
            </div>
          </Form>
        </Skeleton>
      </Modal>
    </div>
  )
}
