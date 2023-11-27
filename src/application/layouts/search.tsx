import { Input, Button, Form, Typography, Select, Flex, Collapse, InputNumber } from 'antd'
import React, { useMemo, useCallback } from 'react'
import type { CollapseProps } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useFetchData from '../hooks/useFetchData'
import debounce from 'lodash/debounce'

const { Title } = Typography

const Search: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 16
  const keyword = searchParams.get('keyword')
  const category_id = searchParams.get('category_id')
  const type_id = searchParams.get('type_id')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  const [form] = Form.useForm()
  const [loadingCategory, errorCategory, responseCategory] = useFetchData(`/category`)
  const [loadingBirdType, errorBirdType, responseBirdType] = useFetchData(`/birdtype`)
  const categories = useMemo(
    () =>
      !loadingCategory && !errorCategory && responseCategory
        ? responseCategory.data
            .filter((d: { id: number; name: string }) => {
              console.log(d)
              if (d.name === 'Chim ghép sinh sản') return false
              if (d.name === 'Chim non') return false
              return true
            })
            .map((d: { id: number; name: string }) => ({
              value: d.id,
              label: d.name
            }))
        : [],
    [responseCategory, loadingCategory, errorCategory]
  )
  const birdtypes = useMemo(
    () =>
      !loadingBirdType && !errorBirdType && responseBirdType
        ? responseBirdType.data.map((d: { id: number; name: string }) => ({
            value: d.id,
            label: d.name
          }))
        : [],
    [loadingBirdType, errorBirdType, responseBirdType]
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((nextValue: any) => {
      let query = `page=1&limit=${limit}`
      if (nextValue) {
        query += `&keyword=${nextValue}`
      }
      if (type_id) {
        query += `&type_id=${type_id}`
      }
      if (category_id) {
        query += `&category_id=${category_id}`
      }
      if (minPrice) {
        query += `&minPrice=${minPrice}`
      }
      if (maxPrice) {
        query += `&minPrice=${maxPrice}`
      }
      setSearchParams(query)
    }, 1000),
    [category_id, type_id]
  )
  const handleSearchPrice = () => {
    navigate('/viewall')
  }
  const handleSearchTxt = (e: string) => {
    debouncedSave(e)
  }
  const handleChangeTxt = (e: any) => {
    debouncedSave(e.target.value)
  }
  const handleChangeCategory = (value: string[]) => {
    let query = `page=1&limit=${limit}`
    if (keyword) {
      query += `&keyword=${keyword}`
    }
    if (type_id) {
      query += `&type_id=${type_id}`
    }
    if (value !== undefined) {
      query += `&category_id=${value}`
    }
    setSearchParams(query)
  }
  const handleChangeBirdType = (value: string[]) => {
    let query = `page=1&limit=${limit}`
    if (keyword) {
      query += `&keyword=${keyword}`
    }
    if (value !== undefined) {
      query += `&type_id=${value}`
    }
    if (category_id) {
      query += `&category_id=${category_id}`
    }
    if (minPrice) {
      query += `&minPrice=${minPrice}`
    }
    if (maxPrice) {
      query += `&minPrice=${maxPrice}`
    }
    setSearchParams(query)
  }
  const onFinish = (values: any) => {
    let flag = false
    let query = `page=1&limit=${limit}`
    if (values.birdName !== undefined) {
      query += `&keyword=${values.birdName}`
      flag = true
    }
    if (values.birdType !== undefined) {
      query += `&type_id=${values.birdType}`
      flag = true
    }
    if (values.category !== undefined) {
      query += `&category_id=${values.category}`
      flag = true
    }
    if (values.minPrice !== undefined) {
      query += `&minPrice=${values.minPrice}`
      flag = true
    }
    if (values.maxPrice !== undefined) {
      query += `&maxPrice=${values.maxPrice}`
      flag = true
    }
    if (!flag) {
      query = `page=${page}&limit=${limit}`
    }
    setSearchParams(query)
  }

  const handleMinValue = (value: number | null) => {
    if (value) {
      console.log(value)
    }
  }
  const handleMaxValue = (value: number | null) => {
    if (value) {
      console.log(value)
    }
  }

  const onReset = () => {
    let query = `page=1&limit=${limit}`
    if (!keyword && !type_id && !category_id && !minPrice && !maxPrice) {
      console.log(page)
      query = `page=${page}&limit=${limit}`
      console.log(query)
      setSearchParams(query)
    } else {
      form.resetFields()
      setSearchParams(query)
    }
  }

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: <Title level={5}>Tìm kiếm</Title>,
      children: (
        <Form.Item name='birdName'>
          <Input.Search
            onChange={handleChangeTxt}
            onSearch={handleSearchTxt}
            placeholder='Tìm kiếm chim'
            className='!shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)] '
          />
        </Form.Item>
      )
    },
    {
      key: '2',
      label: <Title level={5}>Thuộc tính chim</Title>,
      children: (
        <>
          <Form.Item name='category'>
            <Select
              allowClear
              onChange={handleChangeCategory}
              defaultActiveFirstOption={false}
              placeholder='Danh mục'
              options={categories}
            />
          </Form.Item>
          <Form.Item name='birdType'>
            <Select
              allowClear
              onChange={handleChangeBirdType}
              defaultActiveFirstOption={false}
              placeholder='Loài chim'
              options={birdtypes}
            />
          </Form.Item>
        </>
      )
    },
    {
      key: '3',
      label: <Title level={5}>Giá tiền</Title>,
      children: (
        <>
          <Flex wrap='wrap' justify='space-between' gap='small'>
            <Form.Item name='minPrice' label='Min'>
              <InputNumber placeholder='min' onChange={handleMinValue} />
            </Form.Item>
            <Form.Item name='maxPrice' label='Max'>
              <InputNumber placeholder='max' onChange={handleMaxValue} />
            </Form.Item>
          </Flex>
        </>
      )
    }
  ]

  return (
    <Form form={form} layout='vertical' name='advanced_search' onFinish={onFinish}>
      <Collapse defaultActiveKey={['1', '2', '3']} expandIconPosition='end' items={items} bordered={false} />
      <Form.Item className='!px-[16px]'>
        <Button
          htmlType='submit'
          type='default'
          shape='round'
          onClick={handleSearchPrice}
          className='!bg-green-800 !rounded-ful !w-full !text-white !shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)]'
        >
          Áp dụng
        </Button>
      </Form.Item>
      <Form.Item className='!px-[16px]'>
        <Button
          type='default'
          shape='round'
          onClick={onReset}
          className='!bg-green-800 !rounded-ful !w-full !text-white !shadow-[0_20px_25px_-15px_rgba(0,0,0,0.4)]'
        >
          Xóa tất cả
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Search
