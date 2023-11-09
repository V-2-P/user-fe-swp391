import { Skeleton } from 'antd'
import { Link, useSearchParams } from 'react-router-dom'
import useFetchData from '~/application/hooks/useFetchData'
import { Result } from 'antd'
import React from 'react'
const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('userId')
  const token = searchParams.get('token')
  const [loading, error, response] = useFetchData(`/auth/verify?userId=${userId}&token=${token}`)

  return (
    <div>
      <Skeleton loading={loading}>
        {error ? (
          <Result status='error' title='Failed to fetch' subTitle={error} />
        ) : (
          <Result
            status='success'
            title={'Xác thực thành công'}
            subTitle={<p>{response?.message}</p>}
            extra={[<Link to='/productlist'>Đi đến cửa hàng</Link>]}
          />
        )}
      </Skeleton>
    </div>
  )
}

export default VerifyPage
