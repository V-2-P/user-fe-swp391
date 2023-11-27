import { Button, Descriptions, List, Modal, Typography, Image, Rate, Space, Input, App, Form, Flex } from 'antd'
import React, { useState } from 'react'
import type { DescriptionsProps } from 'antd'
import { getBirdImage } from '~/utils/imageUtils'
import { formatCurrencyVND, formatCurrencyVNDToString } from '~/utils/numberUtils'
import { useAppDispatch } from '~/application/hooks/reduxHook'
import { reFetchData } from '~/redux/slices'
import axiosClient from '~/utils/api/axiosClient'

interface Bird {
  createdAt: string
  updatedAt: string
  id: number
  name: string
  price: number
  thumbnail: string
  description: string
  category: {
    id: number
    name: string
  }
  birdType: {
    id: number
    name: string
  }
  status: boolean
  purebredLevel: string
  competitionAchievements: number
  age: string
  gender: string
  color: string
  quantity: number
  birdImages: {
    id: number
    imageUrl: string
  }[]
}

interface OrderDetail {
  id: number
  bird: Bird
  numberOfProducts: number
  price: number
}

type FeedbackButtonProps = {
  orderDetails: OrderDetail[]
  orderId: number
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ orderDetails, orderId }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const { notification, message } = App.useApp()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    console.log(values)
    try {
      const payload = {
        orderId: orderId,
        birdFeedbacks: values.birdFeedbacks
      }
      const response = await axiosClient.post('/feedbackbirds', payload)
      setLoading(false)
      if (response) {
        notification.success({ message: 'Cảm ơn bạn đã đánh giá' })
        dispatch(reFetchData())
        setIsModalOpen(false)
      } else {
        notification.error({ message: 'Sorry! Something went wrong. App server error' })
      }
    } catch (err) {
      setLoading(false)
      notification.error({ message: (err as string) || 'Sorry! Something went wrong. App server error' })
    }
  }
  const onFinishFailed = (errorInfo: any) => {
    for (let i = 0; i < errorInfo.errorFields.length; i++) {
      message.error(errorInfo.errorFields[i].errors[0])
      return
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Button onClick={showModal} className='w-48' type='primary' size='large'>
        Đánh giá
      </Button>
      <Modal title='Đánh giá sản phẩm' width={1000} open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form initialValues={{}} name='feedback' onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Space className='w-full' direction='vertical' size='large'>
            <List
              itemLayout='horizontal'
              dataSource={orderDetails}
              renderItem={(item, index) => {
                const items: DescriptionsProps['items'] = [
                  {
                    key: '1',
                    label: 'Giới tính',
                    children: item.bird.name
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
                    <Space direction='vertical' className='!w-full'>
                      <List.Item.Meta
                        className='!flex-grow'
                        avatar={
                          <Image
                            height={100}
                            src={getBirdImage(item.bird.thumbnail)}
                            fallback='data:image/png;base64,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'
                          />
                        }
                        title={<Typography.Title level={5}>{item.bird.name}</Typography.Title>}
                        description={<Descriptions items={items} column={1} />}
                      />
                      <Form.Item name={['birdFeedbacks', index, 'birdId']} initialValue={item.id} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={['birdFeedbacks', index, 'rating']}
                        label='Chất lượng sản phẩm'
                        rules={[{ required: true, message: 'Cho điểm đánh giá!' }]}
                      >
                        <Rate />
                      </Form.Item>
                      <Form.Item name={['birdFeedbacks', index, 'comment']} label='Nhận xét'>
                        <Input.TextArea autoSize={{ minRows: 6, maxRows: 6 }} showCount maxLength={300} />
                      </Form.Item>
                    </Space>
                  </List.Item>
                )
              }}
            />
          </Space>
          <Flex justify='flex-end' gap={10}>
            <Button key='back' onClick={handleCancel}>
              Trở lại
            </Button>

            <Button htmlType='submit' type='primary' loading={loading}>
              Hoàn thành
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  )
}

export default FeedbackButton
