import React, { useState, useEffect } from 'react'
import { Typography } from 'antd'

type CountdownTimerProps = {
  createdAt: string
}
const CountdownTimer: React.FC<CountdownTimerProps> = ({ createdAt }) => {
  // Chuyển đổi thời gian 'createdAt' thành đối tượng Date
  const createdAtDate = new Date(createdAt)

  // Tính offset của múi giờ UTC+7 (7 giờ)
  const offset = 7 * 60 * 60 * 1000 // 7 giờ = 7 * 60 phút * 60 giây * 1000 mili giây

  // Chuyển đổi thời gian 'createdAt' thành đối tượng Date với offset UTC+7
  const createdAtDateTime = new Date(createdAtDate.getTime() + offset)

  // Lấy thời gian hiện tại với múi giờ UTC+7
  const currentTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }))

  // Tính thời gian còn lại (tính bằng mili giây) cho bộ đếm 1 ngày
  const countdownDuration = createdAtDateTime.getTime() + 24 * 60 * 60 * 1000 - currentTime.getTime()

  // Sử dụng useState để lưu trữ thời gian còn lại
  const [countdown, setCountdown] = useState(countdownDuration)

  // Sử dụng useEffect để gọi hàm cập nhật sau mỗi giây
  useEffect(() => {
    // Hàm cập nhật bộ đếm
    const updateCountdown = () => {
      // Giảm bộ đếm xuống 1 giây
      const updatedCountdown = countdown - 1000
      if (updatedCountdown > 0) setCountdown(updatedCountdown)
      else clearInterval(interval)
    }

    const interval = setInterval(updateCountdown, 1000)

    // Đảm bảo rằng bạn xóa interval khi component bị unmount
    return () => clearInterval(interval)
  }, [countdown])

  // Chuyển đổi thời gian còn lại thành mm:ss
  const minutesRemaining = Math.floor(countdown / 60000) // 1 phút = 60000 mili giây
  const secondsRemaining = Math.floor((countdown % 60000) / 1000)

  // Hiển thị thời gian còn lại theo định dạng mm:ss
  const formattedTime = `${minutesRemaining > 0 ? minutesRemaining.toString().padStart(2, '0') : '00'}:${
    secondsRemaining > 0 ? secondsRemaining.toString().padStart(2, '0') : '00'
  }`

  // Hiển thị thời gian còn lại theo ý muốn
  return <Typography.Title level={5}>Thời gian thanh toán {formattedTime}</Typography.Title>
}

export default CountdownTimer
