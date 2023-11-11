export const getStatusVN = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận'
      break
    case 'processing':
      return 'Xử lý'
      break
    case 'shipping':
      return 'Đang vận chuyển'
      break
    case 'delivered':
      return 'Hoàn thành'
      break
    case 'cancelled':
      return 'Hủy'
      break
    default:
      return 'UNKNOWN'
      break
  }
}
