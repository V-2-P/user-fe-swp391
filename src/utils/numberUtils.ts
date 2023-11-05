export const formatCurrencyVND = (amount?: number): string => {
  if (!amount) return Number(0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}
export const formatCurrencyVNDToString = (value?: number) => {
  if (!value) return ''
  const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
  return currency.format(value).replace('₫', '').trim()
}

export const parseCurrencyVNDToNumber = (value?: string) => {
  const numericString = value!.replace(/[^\d]/g, '')
  const numericValue = parseInt(numericString, 10)
  return isNaN(numericValue) ? 0 : numericValue
}
