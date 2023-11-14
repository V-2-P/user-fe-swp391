export const formatDateToDDMMYYYY = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0') // Lấy ngày và đảm bảo có 2 chữ số
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Lấy tháng và đảm bảo có 2 chữ số (lưu ý tháng bắt đầu từ 0)
  const year = date.getFullYear().toString()

  return `${day}-${month}-${year}`
}
