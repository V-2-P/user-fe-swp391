export const convertToFormData = (data: any) => {
  const formData = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length && value[0] instanceof File) {
      value.forEach((file) => {
        formData.append(`${key}`, file)
      })
    } else if (value instanceof File) {
      formData.append(`${key}`, value)
    } else {
      formData.append(`${key}`, `${value}`)
    }
  }
  return formData
}
