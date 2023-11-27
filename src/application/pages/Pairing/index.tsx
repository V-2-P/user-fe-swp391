import React, { useMemo, useState } from 'react'
import { Select, Row, Col, Flex, Skeleton, Result, App } from 'antd'
import useFetchData from '~/application/hooks/useFetchData'
import SearchBird from './search'
import { useNavigate } from 'react-router-dom'
import { usePairing } from '~/application/hooks/usePairing'

type BirdImage = {
  id: number
  imageUrl: string
}

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
  birdImages: BirdImage[] // Đây là một mảng các hình ảnh của chim
}

const Pairing: React.FC = () => {
  const { pairing } = usePairing()
  const [birdTypeId, setBirdTypeId] = useState('')
  const { notification } = App.useApp()
  const [birdTypeLoading, birdTypeError, birdTypeResponse] = useFetchData('/birdtype')
  const [birdLoading, birdError, birdResponse] = useFetchData('/birds/all')
  const navigate = useNavigate()
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
        (bird: any) => bird.birdType.id.toString() === birdTypeId && bird.category.id === 2 && bird.quantity > 0
      )
    }
    return []
  }, [birdError, birdLoading, birdResponse, birdTypeId])

  const maleBird = useMemo(() => birdMemorized.filter((bird: any) => bird.gender === 'Trống'), [birdMemorized])
  const femaleBird = useMemo(() => birdMemorized.filter((bird: any) => bird.gender === 'Mái'), [birdMemorized])

  const motherBird = useMemo(() => {
    return pairing.mother
  }, [pairing.mother])
  const fatherBird = useMemo(() => {
    return pairing.father
  }, [pairing.father])

  const handleChangeBirdType = (value: string[]) => {
    setBirdTypeId(value.toString())
  }
  const handleSubmit = () => {
    if (motherBird && fatherBird) {
      navigate('/pairingcheckout')
    } else {
      notification.error({ message: 'Vui lòng chọn chim cha hoặc chim mẹ' })
    }
  }

  return (
    <div className='w-full p-10'>
      <Skeleton loading={birdTypeLoading || birdLoading} active>
        {birdTypeError || birdError ? (
          <Result title='Failed to fetch' subTitle={birdTypeError || birdError} status='error' />
        ) : (
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
                <SearchBird birds={maleBird} name='Chim Trống' type='male' />
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
                  onClick={handleSubmit}
                />
              </Flex>
            </Col>

            <Col span={10}>
              <Row gutter={[16, 16]}>
                <SearchBird birds={femaleBird} name='Chim Mái' type='female' />
              </Row>
            </Col>
          </Row>
        )}
      </Skeleton>
    </div>
  )
}

export default Pairing
