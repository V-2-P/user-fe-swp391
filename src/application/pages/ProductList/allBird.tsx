import { App, Breadcrumb, Button, Image, Result, Row, Skeleton, Typography, Space, List, Card } from 'antd'
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import useFetchData from '~/application/hooks/useFetchData'
import { CloseCircleOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { formatCurrencyVND } from '~/utils/numberUtils'
import CompareLayout from '~/application/layouts/compareLayout'
import { getBirdImage } from '~/utils/imageUtils'
import React, { useState, useEffect } from 'react'
import { useCart } from '~/application/hooks/useCart'
import { useCompare } from '~/application/hooks/useCompare'

type BirdImage = {
  id: number
  imageUrl: string
}

type Bird = {
  createdAt: Date
  updatedAt: Date
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
  birdImages: BirdImage[]
}

const { Paragraph, Text } = Typography

const ViewAllBird: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 16
  const keyword = searchParams.get('keyword')
  const category_id = searchParams.get('category_id')
  const type_id = searchParams.get('type_id')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const [loading, error, response] = useFetchData(
    `/birds?page=${page - 1}&limit=${limit}${keyword ? `&keyword=${keyword}` : ''}${
      category_id ? `&category_id=${category_id}` : ''
    }${type_id ? `&type_id=${type_id}` : ''}
    ${minPrice ? `&minPrice=${minPrice}` : ''}
    ${maxPrice ? `&maxPrice=${maxPrice}` : ''}`
  )
  const [data, setData] = useState<Bird[]>([])
  const totalPages = response ? response.data.totalPages : 0
  const { addToCart } = useCart()
  const { addProductToCompare } = useCompare()

  const { notification } = App.useApp()

  console.log(response)

  const navigate = useNavigate()

  const addToCompare = (bird: Bird) => {
    addProductToCompare({
      id: bird.id.toString(),
      name: bird.name,
      thumbnail: bird.thumbnail
    })
    notification.success({ message: 'Thêm vào so sánh thành công' })
  }

  const addBirdToCart = (bird: Bird) => {
    addToCart({
      id: bird.id.toString(),
      price: bird.price
    })
    notification.success({ message: 'Thêm vào giỏ hàng thành công' })
  }
  const onChange = (page: number) => {
    console.log(page)
    setSearchParams(
      `page=${page}&limit=${limit}${keyword ? `&keyword=${keyword}` : ''}${
        category_id ? `&category_id=${category_id}` : ''
      }${type_id ? `&type_id=${type_id}` : ''}
      ${minPrice ? `&minPrice=${minPrice}` : ''}
    ${maxPrice ? `&maxPrice=${maxPrice}` : ''}`
    )
  }
  useEffect(() => {
    if (!loading && !error && response) {
      setData(response.data.birds)
    }
  }, [loading, error, response])

  return (
    <CompareLayout>
      <Skeleton loading={loading} active paragraph={{ rows: 10 }} round>
        {error ? (
          <Result
            status='error'
            title='Submission Failed'
            subTitle='Please check and modify the following information before resubmitting.'
            extra={[
              <Button type='primary' key='console'>
                Go Console
              </Button>,
              <Button key='buy'>Buy Again</Button>
            ]}
          >
            <div className='desc'>
              <Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 16
                  }}
                >
                  The content you submitted has the following error:
                </Text>
              </Paragraph>
              <Paragraph>
                <CloseCircleOutlined className='site-result-demo-error-icon' /> Your account has been frozen.{' '}
                <a>Thaw immediately &gt;</a>
              </Paragraph>
              <Paragraph>
                <CloseCircleOutlined className='site-result-demo-error-icon' /> Your account is not yet eligible to
                apply. <a>Apply Unlock &gt;</a>
              </Paragraph>
            </div>
          </Result>
        ) : (
          <Space className='w-full' direction='vertical' size='large'>
            <Breadcrumb
              items={[
                {
                  title: <Link to='/'>Trang chủ</Link>
                },
                {
                  title: <Link to='/productlist'>Shopping</Link>
                },
                {
                  title: 'Xem tất cả'
                }
              ]}
            />
            <Row style={{ background: '#038777' }} className='p-5 rounded-xl'>
              <List
                className='!w-full'
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 4,
                  xl: 4,
                  xxl: 3
                }}
                pagination={{ onChange: onChange, pageSize: limit, total: totalPages * limit, current: page }}
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      onClick={() => navigate(`/productdetail/${item.id}`)}
                      hoverable
                      cover={
                        <Image
                          src={getBirdImage(item.thumbnail)}
                          className='text-center !w-[100%] object-cover !h-[250px]'
                          preview={false}
                          fallback='data:image/png;base64,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'
                        />
                      }
                    >
                      <div className='flex flex-col text-xs space-y-3'>
                        <div className='flex flex-col justify-center w-full space-y-3'>
                          <Typography.Text ellipsis={true}>{item.name} </Typography.Text>
                          <p className='break-words w-full text-sm text-red-500'>{formatCurrencyVND(item.price)}</p>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCompare(item)
                          }}
                          size='middle'
                          icon={<PlusOutlined />}
                          className=''
                        >
                          So sánh
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            addBirdToCart(item)
                          }}
                          size='middle'
                          icon={<ShoppingCartOutlined />}
                          type='primary'
                        >
                          Thêm giỏ hàng
                        </Button>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </Row>
          </Space>
        )}
      </Skeleton>
    </CompareLayout>
  )
}
export default ViewAllBird
