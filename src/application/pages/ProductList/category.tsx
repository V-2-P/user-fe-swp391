import { Button, Input } from 'antd'
import React from 'react'
import Search from 'antd/es/input/Search'

const Category: React.FC = () => {
  return (
    <div className='h-full flex flex-col bg-gray-300 space-y-5'>
      <div className='mt-5 mx-5'>
        <Search
          placeholder='Nhập tên'
          enterButton
          className='!rounded-full !shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)] '
        />
      </div>

      <div className='border-t-2 border-black w-[85%] m-auto'></div>

      <div className='flex flex-col lg:w-full'>
        <div className='my-3 space-y-2 mx-7'>
          <div className='w-full bg-white p-2 rounded-lg shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)]'>
            <input type='checkbox' />
            <label className='ml-6'>Tên danh mục</label>
          </div>
          <div className='w-full bg-white p-2 rounded-lg shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)]'>
            <input type='checkbox' />
            <label className='ml-6'>Tên danh mục</label>
          </div>
          <div className='w-full bg-white p-2 rounded-lg shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)]'>
            <input type='checkbox' />
            <label className='ml-6'>Tên danh mục</label>
          </div>
        </div>
      </div>

      <div className='border-t-2 border-black w-[85%] m-auto'></div>

      <div className='flex flex-col my-3 space-y-3 mx-7 text-center'>
        <h1 className='text-xl font-bold shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)]'>Khoảng giá</h1>
        <form className='space-y-3'>
          <Input
            placeholder='Từ'
            name='fromPrice'
            className='!rounded-full !shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)]'
          />
          <Input
            placeholder='Đến'
            name='toPrice'
            className='!rounded-full !shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)]'
          />
          <Button
            type='default'
            shape='round'
            className='!bg-green-800 !rounded-ful !w-full !text-white !shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)]'
          >
            Áp dụng
          </Button>
        </form>
      </div>

      <div className='border-t-2 border-black w-[85%] m-auto'></div>

      <div className='my-3 space-y-3 mx-7 text-center'>
        <Button
          shape='round'
          className='!bg-green-800 !rounded-full mb-5 !w-full !text-white !shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)]'
        >
          Xóa tất cả
        </Button>
      </div>
    </div>
  )
}

export default Category
