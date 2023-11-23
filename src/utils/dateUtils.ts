export const formatDateToDDMMYYYY = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0') // Lấy ngày và đảm bảo có 2 chữ số
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Lấy tháng và đảm bảo có 2 chữ số (lưu ý tháng bắt đầu từ 0)
  const year = date.getFullYear().toString()

  return `${day}-${month}-${year}`
}
export const timestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)

  // Đặt múi giờ cho Việt Nam (Asia/Ho_Chi_Minh)
  date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })

  const day = date.getDate().toString().padStart(2, '0') // Lấy ngày và đảm bảo có 2 chữ số
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Lấy tháng và đảm bảo có 2 chữ số (0-11)
  const year = date.getFullYear().toString() // Lấy năm
  return `${day}/${month}/${year}`
}

export function formatRequestDate(inputDate: string) {
  const parts = inputDate.split('/')
  if (parts.length === 3) {
    const day = parts[0]
    const month = parts[1]
    const year = parts[2]

    // Tạo một đối tượng Date với định dạng ngày/tháng/năm
    const date = new Date(`${year}-${month}-${day}`)

    // Lấy ngày, tháng và năm từ đối tượng Date và chuyển đổi thành chuỗi đúng định dạng
    const formattedDate = date.toISOString().split('T')[0]
    return formattedDate
  } else {
    // Trường hợp chuỗi đầu vào không đúng định dạng
    return 'Invalid input'
  }
}
