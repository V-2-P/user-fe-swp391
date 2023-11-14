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
    case 'Pending':
      return 'Chờ xác nhận'
      break
    case 'Shipping':
      return 'Đang vận chuyển'
      break
    case 'Delivered':
      return 'Hoàn thành'
      break
    case 'Cancelled':
      return 'Hủy'
      break
    case 'Preparing':
      return 'Có thể nhận con'
      break
    case 'Confirmed':
      return 'Xác nhận'
      break
    default:
      return 'UNKNOWN'
      break
  }
}
