import { Outlet } from 'react-router-dom'
import { FloatButton, Modal, Drawer, Row, Col, Button, Space, Select, List, Avatar, Image, App } from 'antd'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useState } from 'react'
import axiosClient from '~/utils/api/AxiosClient'
import debounce from 'lodash/debounce'
import { formatCurrencyVND } from '~/utils/numberUtils'
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

const CompareLayout = () => {
  const { notification } = App.useApp()
  const [open, setOpen] = useState(false)
  const [dbValue, setDbValue] = useState<any[]>([])
  const [compareList, setCompareList] = useState(JSON.parse(localStorage.getItem('compare') || '[]'))
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    setCompareList(compare)
  }
  const showDrawer = () => {
    setOpen(!open)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleDelete = (itemId: number) => {
    const compare = JSON.parse(localStorage.getItem('compare') || '[]') as any
    const filterCompare = compare.filter((item: any) => item.id !== itemId)
    localStorage.setItem('compare', JSON.stringify(filterCompare))
    setCompareList(JSON.parse(localStorage.getItem('compare') || '[]'))
  }

  const handleDeleteAll = () => {
    localStorage.removeItem('compare')
    setCompareList([])
  }

  useEffect(() => {
    if (localStorage.getItem('compare')) {
      setCompareList(JSON.parse(localStorage.getItem('compare') || '[]'))
    }
    // eslint-disable-next-line
  }, [JSON.parse(localStorage.getItem('compare') || '[]')])
  return (
    <>
      <FloatButton className='!z-[9999]' onClick={showDrawer} tooltip={<div>Documents</div>} />
      <Drawer
        maskClosable={false}
        mask={false}
        footer={false}
        height={200}
        placement='bottom'
        closable={false}
        open={open}
      >
        <Row gutter={[24, 16]} className='h-full'>
          {compareList.length > 0 ? (
            <Col span={6}>
              <div className='flex flex-col justify-center items-center h-full'>
                <Space direction='vertical' size={'middle'}>
                  <div>
                    <div className='flex justify-end '>
                      <Button
                        onClick={() => handleDelete(compareList[0].id)}
                        type='link'
                        size='small'
                        className='!p-0'
                        icon={<CloseOutlined />}
                      />
                    </div>
                    <div className='flex justify-center items-center w-full'>
                      <Image
                        preview={false}
                        height={100}
                        width={100}
                        src={`https://api.techx.id.vn/uploads/birds/${compareList[0].thumbnail}`}
                      />
                    </div>
                  </div>
                </Space>
                <p>{compareList[0].name}</p>
              </div>
            </Col>
          ) : (
            <Col span={6}>
              <div className='flex justify-center items-center h-full'>
                <Space direction='vertical' size={'middle'}>
                  <div className='flex justify-center items-center w-full'>
                    <Button onClick={showModal} size='large' icon={<PlusOutlined />}></Button>
                  </div>
                  <p>Thêm chim</p>
                </Space>
              </div>
            </Col>
          )}
          {compareList.length > 1 ? (
            <Col span={6}>
              <div className='flex flex-col justify-center items-center h-full'>
                <Space direction='vertical' size={'middle'}>
                  <div>
                    <div className='flex justify-end'>
                      <Button
                        onClick={() => handleDelete(compareList[1].id)}
                        type='link'
                        size='small'
                        className='!p-0'
                        icon={<CloseOutlined />}
                      />
                    </div>
                    <div className='flex justify-center items-center !w-full'>
                      <Image
                        preview={false}
                        height={100}
                        width={100}
                        src={`https://api.techx.id.vn/uploads/birds/${compareList[1].thumbnail}`}
                      />
                    </div>
                  </div>
                </Space>
                <p>{compareList[1].name}</p>
              </div>
            </Col>
          ) : (
            <Col span={6}>
              <div className='flex justify-center items-center h-full'>
                <Space direction='vertical' size={'middle'}>
                  <div className='flex justify-center items-center w-full'>
                    <Button onClick={showModal} size='large' icon={<PlusOutlined />}></Button>
                  </div>
                  <p>Thêm chim</p>
                </Space>
              </div>
            </Col>
          )}
          {compareList.length > 2 ? (
            <Col span={6}>
              <div className='flex flex-col justify-center items-center h-full '>
                <Space direction='vertical' size={'middle'} className=''>
                  <div>
                    <div className='flex justify-end'>
                      <Button
                        onClick={() => handleDelete(compareList[2].id)}
                        type='link'
                        size='small'
                        className='!p-0'
                        icon={<CloseOutlined />}
                      />
                    </div>
                    <div className='flex relative justify-center items-center w-full'>
                      <Image
                        preview={false}
                        height={100}
                        width={100}
                        src={`https://api.techx.id.vn/uploads/birds/${compareList[2].thumbnail}`}
                      />
                    </div>
                  </div>
                </Space>
                <p className='!w-full text-center'>{compareList[2].name}</p>
              </div>
            </Col>
          ) : (
            <Col span={6}>
              <div className='flex justify-center items-center h-full'>
                <Space direction='vertical' size={'middle'}>
                  <div className='flex justify-center items-center w-full'>
                    <Button onClick={showModal} size='large' icon={<PlusOutlined />}></Button>
                  </div>
                  <p>Thêm chim</p>
                </Space>
              </div>
            </Col>
          )}
          <Col span={6}>
            <div className='flex justify-center items-center h-full'>
              <Space direction='vertical' size={'middle'}>
                <Button type='primary'>So sánh ngay</Button>
                <div className='flex justify-center items-center w-full'>
                  <Button onClick={handleDeleteAll} type='link'>
                    Xóa tất cả
                  </Button>
                </div>
              </Space>
            </div>
          </Col>
        </Row>
      </Drawer>

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
                  avatar={<Avatar src={`https://api.techx.id.vn/uploads/birds/${item.thumbnail}`} />}
                  title={item.name}
                  description={
                    <p className='text-yellow-500'>
                      {formatCurrencyVND(item.price) ? formatCurrencyVND(item.price) : 0}
                    </p>
                  }
                />
              </List.Item>
            )}
          />
        </Space>
      </Modal>
      <Outlet />
    </>
  )
}

export default CompareLayout
