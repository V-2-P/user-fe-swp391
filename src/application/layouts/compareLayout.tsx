import { Outlet, useNavigate } from 'react-router-dom'
import { FloatButton, Modal, Drawer, Row, Col, Button, Space, List, Avatar, Image, App, Input } from 'antd'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import { useCallback, useMemo, useState } from 'react'
import axiosClient from '~/utils/api/axiosClient'
import debounce from 'lodash/debounce'
import { formatCurrencyVND } from '~/utils/numberUtils'
import { getBirdImage } from '~/utils/imageUtils'
import { useCompare } from '../hooks/useCompare'
import { Bird } from '~/redux/slices'

type CompareLayout = {
  children?: React.ReactNode
}

const CompareLayout: React.FC<CompareLayout> = ({ children }) => {
  const { compare, addProductToCompare, removeProductFromCompare, clearCompareList } = useCompare()
  const { notification } = App.useApp()
  const [open, setOpen] = useState(false)
  const [dbValue, setDbValue] = useState<Bird[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()
  const compareItems = useMemo(
    () => (Object.values(compare.items).length > 0 ? Object.values(compare.items) : []),
    [compare]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (nextValue: any) => {
      try {
        setLoading(true)
        console.log(Object.values(compare.items))
        console.log(compareItems)
        let response
        if (compareItems.length > 0) {
          response = await axiosClient.get(
            `/birds?limit=999&keyword=${nextValue}&type_id=${compareItems[0].detail?.birdType.id}`
          )
        } else {
          response = await axiosClient.get(`/birds?limit=9999&keyword=${nextValue}`)
        }
        setLoading(false)
        setDbValue(response.data.birds)
      } catch (error) {
        setLoading(false)
        setDbValue([])
      }
    }, 1000),
    [compareItems]
  )
  const handleSearch = (e: string) => {
    debouncedSave(e)
  }
  const handleChange = (e: any) => {
    setSearchText(e.target.value)
    debouncedSave(e.target.value)
  }

  const changeToCompare = (page: any) => {
    if (compareItems.length > 1) {
      navigate(page)
    } else {
      notification.warning({ message: 'Cần thêm chim để so sánh' })
    }
  }

  const addToCompare = (bird: Bird) => {
    if (compareItems.length === 0) {
      addProductToCompare({
        id: bird.id.toString(),
        name: bird.name,
        thumbnail: bird.thumbnail
      })
      const filteredDbValue = dbValue.filter((item) => item.birdType.id === bird.birdType.id)
      setDbValue(filteredDbValue)
    }
    if (compareItems.length > 0 && compareItems.length < 3) {
      addProductToCompare({
        id: bird.id.toString(),
        name: bird.name,
        thumbnail: bird.thumbnail
      })
    }
  }
  const showDrawer = () => {
    setOpen(!open)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSearchText('')
    setDbValue([])
  }
  const handleDelete = (itemId: string) => {
    removeProductFromCompare(itemId)
  }

  const handleDeleteAll = () => {
    clearCompareList()
  }

  const renderItems = () => {
    const itemsToRender = [] as any
    for (let i = 0; i < 3; i++) {
      if (compareItems[i]) {
        itemsToRender.push(
          <Col span={6}>
            <div className='flex flex-col justify-center items-center h-full'>
              <Space direction='vertical' size={'middle'}>
                <div>
                  <div className='flex justify-end '>
                    <Button
                      onClick={() => handleDelete(compareItems[i].id)}
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
                      src={getBirdImage(compareItems[i].thumbnail)}
                      fallback='data:image/png;base64,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'
                    />
                  </div>
                </div>
              </Space>
              <p>{compareItems[i].name}</p>
            </div>
          </Col>
        )
      } else {
        itemsToRender.push(
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
        )
      }
    }
    return itemsToRender
  }
  return (
    <>
      <FloatButton className='!z-[9999]' onClick={showDrawer} tooltip={<div>So sánh</div>} />
      <Drawer
        maskClosable={false}
        mask={false}
        footer={false}
        height={200}
        placement='bottom'
        closable={false}
        open={open}
        rootStyle={{ marginLeft: children ? 250 : 0 }}
      >
        <Row gutter={[24, 16]} className='h-full'>
          {renderItems()}
          <Col span={6}>
            <div className='flex justify-center items-center h-full'>
              <Space direction='vertical' size={'middle'}>
                <Button onClick={() => changeToCompare('/compare')} type='primary'>
                  So sánh ngay
                </Button>
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
          <Input.Search
            style={{ width: '100%' }}
            onChange={handleChange}
            placeholder='input search text'
            onSearch={handleSearch}
            loading={loading}
            value={searchText}
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
                  avatar={<Avatar src={getBirdImage(item.thumbnail)} />}
                  title={item.name}
                  description={<p className='text-yellow-500'>{formatCurrencyVND(item.price)}</p>}
                />
              </List.Item>
            )}
          />
        </Space>
      </Modal>
      {children ? children : <Outlet />}
    </>
  )
}

export default CompareLayout
