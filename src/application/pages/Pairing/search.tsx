import { Col, Typography, Input, List } from 'antd'
import React, { useMemo, useState } from 'react'
import PairingItem from './pairingItem'
import { usePairing } from '~/application/hooks/usePairing'

const { Title } = Typography

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

type SearchBirdProps = {
  birds: Bird[]
  name: string
  type: 'male' | 'female' | 'checkout'
}

const SearchBird: React.FC<SearchBirdProps> = ({ birds, name, type }) => {
  const { pairing } = usePairing()
  const [search, setSearchText] = useState<string>('')

  const bird = useMemo(() => {
    if (type === 'male') return pairing.father
    else return pairing.mother
  }, [pairing.father, pairing.mother, type])
  const listBird = useMemo(() => {
    return birds.filter((b) => {
      if (search) return b.name.toLowerCase().includes(search.toLowerCase())
      return birds
    })
  }, [birds, search])
  const handleChange = (e: any) => {
    setSearchText(e.target.value)
  }

  return (
    <>
      <Col span={10}>
        <Title level={5}>{name}</Title>
      </Col>
      <Col span={14}>
        <Input.Search value={search} onChange={handleChange} placeholder={name} className='w-full' />
      </Col>
      <Col span={24}>
        {bird !== null ? (
          <PairingItem bird={bird.detail!} type={type} />
        ) : (
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={listBird}
            pagination={{
              onChange: (page) => {
                console.log(page)
              },
              pageSize: 2
            }}
            renderItem={(item) => (
              <List.Item className='!p-0'>
                <PairingItem bird={item} type={type} />
              </List.Item>
            )}
          />
        )}
      </Col>
    </>
  )
}

export default SearchBird
