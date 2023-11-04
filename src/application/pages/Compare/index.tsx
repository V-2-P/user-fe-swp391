import { useCallback, useEffect, useState } from 'react'
import { App, Avatar, Button, Card, Divider, Image, List, Modal, Select, Space } from 'antd'
import useFetchData from '~/application/hooks/useFetchData'
import { formatCurrencyVND } from '~/utils/numberUtils'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import debounce from 'lodash/debounce'
import { ShoppingCartOutlined } from '@ant-design/icons'
import axiosClient from '~/utils/api/AxiosClient'

const SearchInput: React.FC<{
  placeholder: string
  style: React.CSSProperties
  dbValue: any[]
  saveToDb: (element: any[]) => void
}> = ({ dbValue, saveToDb, placeholder, style }) => {
  console.log(dbValue)
  const [value, setValue] = useState('')
  // highlight-starts
  // eslint-disable-next-line
  const debouncedSave = useCallback(
    debounce(async (nextValue: any) => {
      if (!nextValue) {
        saveToDb([])
      } else {
        const compare = JSON.parse(localStorage.getItem('compare') || '[]') as any
        let response
        if (compare.length > 0) {
          response = await axiosClient.get(`/birds?limit=9999&keyword=${nextValue}&type_id=${compare[0].birdType.id}`)
        } else {
          response = await axiosClient.get(`/birds?limit=9999&keyword=${nextValue}`)
        }
        saveToDb(response.data.birds)
      }
    }, 1000),
    [] // will be created only once initially
  )
  // highlight-ends
  const handleSearch = (newValue: string) => {
    setValue(newValue)
    debouncedSave(newValue)
  }

  const handleChange = (newValue: string) => {
    setValue(newValue)
    debouncedSave(newValue)
  }
  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder}
      style={style}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
    />
  )
}

export const ComparePage = () => {
  const [loading, error, response] = useFetchData(
    `/birds/by-ids?ids=${JSON.parse(localStorage.getItem('compare') || '[]')
      .map((e: any) => e.id)
      .join(',')}`
  )
  const [dbValue, setDbValue] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [savedCompare, setSavedCompare] = useState(JSON.parse(localStorage.getItem('compare') || '[]'))
  const [tableHandle, setTableHandle] = useState([
    {
      head: 'Giới tính',
      bird: []
    },
    {
      head: 'Màu sắc',
      bird: []
    },
    {
      head: 'Độ thuần chủng',
      bird: []
    },
    {
      head: 'Mô tả',
      bird: []
    }
  ])

  const { notification } = App.useApp()

  const addToCompare = (bird: any) => {
    let compare = JSON.parse(localStorage.getItem('compare') || '[]') as any
    if (compare.length === 3) {
      notification.warning({ message: 'Danh sách so sánh đã đủ' })
      return
    }
    const existingCartItem = compare.find((item: any) => item.id === bird.id)
    if (existingCartItem) {
      compare = compare.map((item: any) => (item.id === bird.id ? { ...item } : item))
    } else {
      compare = [...compare, bird]
    }
    localStorage.setItem('compare', JSON.stringify(compare))
  }

  const addToCart = (id: any) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingCartItem = cart.find((item: any) => item.id === id)
    if (existingCartItem) {
      cart = cart.map((item: any) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      cart = [...cart, { id, quantity: 1 }]
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    notification.success({ message: 'Thêm vào giỏ hàng thành công' })
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleDelete = (itemId: number) => {
    const compare = JSON.parse(localStorage.getItem('compare') || '[]') as any
    const newSaveCompare = savedCompare.filter((item: any) => item.id !== itemId)
    const filterCompare = compare.filter((item: any) => item.id !== itemId)
    const tableHandle1 = [
      {
        head: 'Giới tính',
        bird: newSaveCompare ? newSaveCompare.map((item: any) => ({ id: item.id, infor: item.gender })) : []
      },
      {
        head: 'Màu sắc',
        bird: newSaveCompare ? newSaveCompare.map((item: any) => ({ id: item.id, infor: item.color })) : []
      },
      {
        head: 'Độ thuần chủng',
        bird: newSaveCompare ? newSaveCompare.map((item: any) => ({ id: item.id, infor: item.purebredLevel })) : []
      },
      {
        head: 'Mô tả',
        bird: newSaveCompare ? newSaveCompare.map((item: any) => ({ id: item.id, infor: item.description })) : []
      }
    ]
    setTableHandle(tableHandle1)
    localStorage.setItem('compare', JSON.stringify(filterCompare))
    setSavedCompare(newSaveCompare)
  }
  useEffect(() => {
    if (!loading && !error && response) {
      setSavedCompare(response?.data)
      const tableHandle1 = [
        {
          head: 'Giới tính',
          bird: response ? response.data.map((item: any) => ({ id: item.id, infor: item.gender })) : []
        },
        {
          head: 'Màu sắc',
          bird: response ? response.data.map((item: any) => ({ id: item.id, infor: item.color })) : []
        },
        {
          head: 'Độ thuần chủng',
          bird: response ? response.data.map((item: any) => ({ id: item.id, infor: item.purebredLevel })) : []
        },
        {
          head: 'Mô tả',
          bird: response ? response.data.map((item: any) => ({ id: item.id, infor: item.description })) : []
        }
      ]
      setTableHandle(tableHandle1)
    }
  }, [loading, error, response])
  console.log(savedCompare)

  return (
    <div className='p-[5%]'>
      <div className='p-10 bg-white rounded-md'>
        <table id='table' className='border-collapse border border-slate-500 w-full text-left mt-5'>
          <thead>
            <tr>
              <th className='w-[10%] text-left'>
                {savedCompare.map((e: any) => (
                  <>
                    <span className='text-yellow-500'>{e?.name}</span>
                    <Divider />
                  </>
                ))}
              </th>
              {savedCompare.length > 0 ? (
                <th className='border p-10 h-full border-slate-500 w-[30%]'>
                  <div className='flex justify-center h-full content-center relative'>
                    <Button
                      onClick={() => handleDelete(savedCompare[0].id)}
                      type='link'
                      size='small'
                      className='!p-0 !absolute !top-[-5%] !right-5 '
                      icon={<CloseOutlined />}
                    />
                    <Card
                      className='w-[70%] h-full'
                      bordered={false}
                      cover={
                        <Image
                          preview={false}
                          src={`https://api.techx.id.vn/uploads/birds/${savedCompare[0].thumbnail}`}
                        />
                      }
                    >
                      <div>
                        <p>{savedCompare[0]?.name}</p>
                        <p className='text-red-500'>
                          {savedCompare[0].price ? formatCurrencyVND(savedCompare[0]?.price) : 0}
                        </p>
                      </div>
                      <div className='flex w-full mt-2'>
                        <Button
                          onClick={() => addToCart(savedCompare[0]?.id)}
                          size='middle'
                          icon={<ShoppingCartOutlined />}
                          className='!w-[100%] lg:mt-0 lg:w-[50%] text-center !p-0 m-0 lg:mr-1 lg:ml-2 !text-xs !bg-green-700 !text-white'
                        >
                          Add to cart
                        </Button>
                      </div>
                    </Card>
                  </div>
                </th>
              ) : (
                <th className='border p-10 h-full border-slate-500 w-[30%]'>
                  <div className='flex justify-center items-center h-full'>
                    <Space direction='vertical' size={'middle'}>
                      <div className='flex justify-center items-center w-full'>
                        <Button onClick={showModal} size='large' icon={<PlusOutlined />}></Button>
                      </div>
                      <p>Thêm chim</p>
                    </Space>
                  </div>
                </th>
              )}
              {savedCompare.length > 1 ? (
                <th className='border p-10 h-full border-slate-500 w-[30%]'>
                  <div className='flex justify-center h-full content-center relative'>
                    <Button
                      onClick={() => handleDelete(savedCompare[1].id)}
                      type='link'
                      size='small'
                      className='!p-0 !absolute !top-[-5%] !right-5 '
                      icon={<CloseOutlined />}
                    />
                    <Card
                      className='w-[70%] h-full'
                      bordered={false}
                      cover={
                        <Image
                          preview={false}
                          src={`https://api.techx.id.vn/uploads/birds/${savedCompare[1].thumbnail}`}
                        />
                      }
                    >
                      <div>
                        <p>{savedCompare[1].name}</p>
                        <p className='text-red-500'>
                          {savedCompare[1].price ? formatCurrencyVND(savedCompare[1]?.price) : 0}
                        </p>
                      </div>
                      <div className='flex w-full mt-2'>
                        <Button
                          onClick={() => addToCart(savedCompare[1]?.id)}
                          size='middle'
                          icon={<ShoppingCartOutlined />}
                          className='!w-[100%] lg:mt-0 lg:w-[50%] text-center !p-0 m-0 lg:mr-1 lg:ml-2 !text-xs !bg-green-700 !text-white'
                        >
                          Add to cart
                        </Button>
                      </div>
                    </Card>
                  </div>
                </th>
              ) : (
                <th className='border p-10 h-full border-slate-500 w-[30%]'>
                  <div className='flex justify-center items-center h-full'>
                    <Space direction='vertical' size={'middle'}>
                      <div className='flex justify-center items-center w-full'>
                        <Button onClick={showModal} size='large' icon={<PlusOutlined />}></Button>
                      </div>
                      <p>Thêm chim</p>
                    </Space>
                  </div>
                </th>
              )}
              {savedCompare.length > 2 ? (
                <th className='border p-10 h-full border-slate-500 w-[30%]'>
                  <div className='flex justify-center h-full content-center relative'>
                    <Button
                      onClick={() => handleDelete(savedCompare[2].id)}
                      type='link'
                      size='small'
                      className='!p-0 !absolute !top-[-5%] !right-5 '
                      icon={<CloseOutlined />}
                    />
                    <Card
                      className='w-[70%] h-full'
                      bordered={false}
                      cover={
                        <Image
                          preview={false}
                          src={`https://api.techx.id.vn/uploads/birds/${savedCompare[2].thumbnail}`}
                        />
                      }
                    >
                      <div>
                        <p>{savedCompare[2].name}</p>
                        <p className='text-red-500'>
                          {savedCompare[2].price ? formatCurrencyVND(savedCompare[2]?.price) : 0}
                        </p>
                      </div>
                      <div className='flex w-full mt-2'>
                        <Button
                          onClick={() => addToCart(savedCompare[2]?.id)}
                          size='middle'
                          icon={<ShoppingCartOutlined />}
                          className='!w-[100%] lg:mt-0 lg:w-[50%] text-center !p-0 m-0 lg:mr-1 lg:ml-2 !text-xs !bg-green-700 !text-white'
                        >
                          Add to cart
                        </Button>
                      </div>
                    </Card>
                  </div>
                </th>
              ) : (
                <th className='border p-10 h-full border-slate-500 w-[30%]'>
                  <div className='flex justify-center items-center h-full'>
                    <Space direction='vertical' size={'middle'}>
                      <div className='flex justify-center items-center w-full'>
                        <Button onClick={showModal} size='large' icon={<PlusOutlined />}></Button>
                      </div>
                      <p>Thêm chim</p>
                    </Space>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {tableHandle.map((e) => (
              <tr>
                <td className='border border-slate-500 w-[10%]'>{e.head}</td>
                {e.bird.map((bird: any) => (
                  <td key={bird.id} className='border border-slate-500 w-[30%] text-base'>
                    {bird.infor}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        title='Tìm kiếm chim để search'
        open={isModalOpen}
        style={{ top: 20 }}
        footer={false}
        onCancel={handleCancel}
      >
        <Space direction='vertical' className='w-full'>
          <SearchInput
            dbValue={dbValue}
            saveToDb={setDbValue}
            placeholder='input search text'
            style={{ width: '100%' }}
          />
          <List
            className='h-[50vh] overflow-auto'
            itemLayout='horizontal'
            dataSource={dbValue}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button onClick={() => addToCompare(item)} size='small' shape='circle' icon={<PlusOutlined />} />
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={`https://api.techx.id.vn/uploads/birds/${item?.thumbnail}`} />}
                  title={item.name}
                  description={
                    <p className='text-yellow-500'>
                      {/* {formatCurrencyVND(item.price) ? formatCurrencyVND(item.price) : 0} */}
                    </p>
                  }
                />
              </List.Item>
            )}
          />
        </Space>
      </Modal>
    </div>
  )
}
