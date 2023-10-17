import { PlusOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Button, Rate } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
const Information: React.FC = () => {
  const category = [
    { id: 1, name: 'Tag Loài chim' },
    { id: 2, name: 'Tag Đực cái' },
    { id: 3, name: 'Tag Màu sắc' },
    { id: 4, name: 'Tag Độ tuổi' }
  ]

  const rateStar = [
    { id: 1, star: 3 },
    { id: 2, star: 4 }
  ]

  const isBought = [{ id: 1 }, { id: 2 }]

  const priceBird = {
    id: 1,
    price: 10000
  }
  const [rating, setRating] = useState(4.5)
  const [buy, setBuy] = useState(isBought.length)
  const [rateCount, setRateCount] = useState(rateStar.length)

  const handleRating = (rate: number) => {
    setRating(rate)
    setBuy(1)
    setRateCount(1)
  }

  return (
    <div className='flex flex-col w-full'>
      <div className='text-lg space-y-8'>
        <div className='flex'>
          <h1 className='text-3xl text-clip overflow-clip'>
            Tên chim .......................... ...................... ........................ ..........
            <Button
              icon={<PlusOutlined />}
              className='ml-10 !text-sm w-[25%] lg:w-[20%] relative !text-green-800 !border-green-800 '
            >
              <span className='!text-xs'>So sánh</span>
            </Button>
          </h1>
        </div>

        <div className='flex text-sm'>
          <div className='flex w-[45%] lg:w-[30%] space-x-2 border-r-2 border-black'>
            <p className='w-[fit] my-auto border-b-2 border-red-500 text-base text-red-500'>{rating}</p>
            <Rate onChange={handleRating} value={rating} allowHalf disabled className='w-full !text-base' />
          </div>
          <Link to='/' className='w-[30%] lg:w-[20%] flex justify-center border-r-2 border-black ml-2'>
            <span className='w-[fit] my-auto !text-black border-b-2 border-black mr-2'>{rateCount}</span>
            <p className='text-base mr-1'>Đánh giá</p>
          </Link>
          <p className='flex justify-center w-[25%]  lg:w-[20%] mr-1'>
            <span className='w-[fit] my-auto !text-black border-b-2 border-black mr-2'>{buy}</span>
            <p className='text-base mr-1'>Đã mua</p>
          </p>
        </div>

        <div className='flex lg:space-x-0 space-x-6 bg-gray-300 text-left'>
          <p className='w-[25%] !text-2xl text-gray-600'>
            <span className='text-sm'>đ</span>
            <span className='line-through'>{priceBird.price}.00</span>
          </p>

          <p className='w-[40%] !text-4xl text-red-500'>
            <span className='text-xl'>đ</span>
            <span>10000.00</span>
          </p>
          <div className='flex bg-red-500 text-white p-1 w-[fit] h-fit text-xs my-auto'>50% giảm</div>
        </div>

        <div className='flex '>
          <div className='grid grid-cols-3 lg:grid-cols-4  w-full'>
            {category.map((e) => (
              <div
                key={e.id}
                className='w-[95%] text-xs rounded-md bg-white text-center p-1 m-1 border-solid border-2 border-gray-200'
              >
                {e.name}
              </div>
            ))}
          </div>
        </div>

        <div className='h-full w-full text-sm flex'>
          <div className='flex w-full'>
            <Button icon={<ShoppingCartOutlined />} className='w-[48%] !border-green-700 !text-green-700 !bg-green-50'>
              Thêm giỏ hàng
            </Button>
            <div className='w-[2%]'></div>
            <Button icon={<ShoppingOutlined />} className='w-[50%] !bg-green-700 !text-white'>
              Mua ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Information
