import React, { useMemo, useState } from 'react'
import { List, Select, Row, Col, Flex, Input, Typography } from 'antd'
import PairingItem from './pairingItem'
import useFetchData from '~/application/hooks/useFetchData'

const { Title } = Typography

type Bird = {
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
  birdImages: string[] // Đây là một mảng các hình ảnh của chim
}

const Pairing: React.FC = () => {
  const [birdTypeId, setBirdTypeId] = useState('')
  const [birdTypeLoading, birdTypeError, birdTypeResponse] = useFetchData('/birdtype')
  const [birdLoading, birdError, birdResponse] = useFetchData('/birds/all')

  const birdtypes = useMemo(
    () =>
      !birdTypeLoading && !birdTypeError && birdTypeResponse
        ? birdTypeResponse.data.map((d: { id: number; name: string }) => ({
            value: d.id,
            label: d.name
          }))
        : [],
    [birdTypeLoading, birdTypeError, birdTypeResponse]
  )

  const birdMemorized: Bird[] = useMemo(() => {
    if (!birdLoading && !birdError && birdResponse) {
      return birdResponse.data.filter(
        (bird: any) => bird.birdType.id.toString() === birdTypeId && bird.category.id === 2
      )
    }
    return []
  }, [birdError, birdLoading, birdResponse, birdTypeId])

  const maleBird = useMemo(() => birdMemorized.filter((bird: any) => bird.gender === 'Trống'), [birdMemorized])
  const femaleBird = useMemo(() => birdMemorized.filter((bird: any) => bird.gender === 'Mái'), [birdMemorized])

  const handleChangeBirdType = (value: string[]) => {
    setBirdTypeId(value.toString())
  }

  return (
    <div className='w-full p-10'>
      <Row className='bg-green-200 p-10' gutter={[16, 16]}>
        <Col span={24}>
          <Flex justify={'center'} align={'center'} className='w-full' gap={'large'}>
            <p className='font-bold text-lg'>Loại chim</p>
            <Select
              placeholder='Chọn loài chim'
              className='w-1/6'
              onChange={handleChangeBirdType}
              options={birdtypes}
            />
          </Flex>
        </Col>

        <Col span={10}>
          <Row gutter={[16, 16]}>
            <Col span={10}>
              <Title level={5}>Chim Trống</Title>
            </Col>
            <Col span={14}>
              <Input.Search placeholder='Chim Trống' className='w-full' />
            </Col>
            <Col span={24}>
              <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={maleBird}
                pagination={{
                  onChange: (page) => {
                    console.log(page)
                  },
                  pageSize: 2
                }}
                renderItem={(item) => (
                  <List.Item className='!p-0'>
                    <PairingItem bird={item} />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Col>

        <Col span={4}>
          <Flex justify={'center'} align={'center'} className='w-full h-full'>
            <img
              src='/heart.svg'
              loading='eager'
              className='cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-110'
              style={{
                filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
              }}
            />
          </Flex>
        </Col>

        <Col span={10}>
          <Row gutter={[16, 16]}>
            <Col span={10}>
              <Title level={5}>Chim Mái</Title>
            </Col>
            <Col span={14}>
              <Input.Search placeholder='Chim Mái' className='w-full' />
            </Col>
            <Col span={24}>
              <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={femaleBird}
                pagination={{
                  onChange: (page) => {
                    console.log(page)
                  },
                  pageSize: 2
                }}
                renderItem={(item) => (
                  <List.Item className='!p-0'>
                    <PairingItem bird={item} />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Pairing
