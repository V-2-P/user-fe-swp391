import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Descriptions, Typography } from 'antd'
import type { DescriptionsProps } from 'antd'
const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams()
  const vnp_TxnRef = searchParams.get('vnp_TxnRef')
  const vnp_Amount = searchParams.get('vnp_Amount')
  const vnp_OrderInfo = searchParams.get('vnp_OrderInfo')
  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode')
  const vnp_TransactionNo = searchParams.get('vnp_TransactionNo')
  const vnp_BankCode = searchParams.get('vnp_BankCode')
  const vnp_PayDate = searchParams.get('vnp_PayDate')
  const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus')
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Mã giao dịch thanh toán',
      children: vnp_TxnRef
    },
    {
      key: '2',
      label: 'Số tiền',
      children: vnp_Amount
    },
    {
      key: '3',
      label: 'Mô tả giao dịch',
      children: vnp_OrderInfo
    },
    {
      key: '4',
      label: 'Mã lỗi thanh toán',
      children: vnp_ResponseCode
    },
    {
      key: '5',
      label: 'Mã giao dịch tại CTT VNPAY-QR',
      children: vnp_TransactionNo
    },
    {
      key: '6',
      label: 'Mã ngân hàng thanh toán',
      children: vnp_BankCode
    },
    {
      key: '7',
      label: 'Thời gian thanh toán',
      children: vnp_PayDate
    },
    {
      key: '8',
      label: 'Tình trạng giao dịch',
      children: vnp_TransactionStatus === '00' ? 'Thành công' : 'Không thành công'
    }
  ]

  return (
    <div className='p-20' style={{ minHeight: 'calc(100vh - 134px)' }}>
      <Descriptions
        title={
          <Typography.Title level={3} className='!w-full !text-center'>
            KẾT QUẢ THANH TOÁN
          </Typography.Title>
        }
        items={items}
      />
    </div>
  )
}

export default PaymentResult
