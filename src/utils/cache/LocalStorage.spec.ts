import { faker } from '@faker-js/faker'
import 'jest-localstorage-mock'
import { LocalStorageUtils, LOCAL_STORAGE_KEY } from './LocalStorage'

const makeSut = (): LocalStorageUtils => new LocalStorageUtils()

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('Should call localStorage.setItems with correct values', () => {
    const sut = makeSut()
    const key = LOCAL_STORAGE_KEY.JWT
    const value = faker.internet.password()
    sut.setItem(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value))
  })

  test('Should call localStorage.removeItems with values is null', () => {
    const sut = makeSut()
    const key = LOCAL_STORAGE_KEY.JWT
    sut.setItem(key, undefined)
    expect(localStorage.removeItem).toHaveBeenCalledWith(key)
  })

  test('Should call localStorage.getItem with correct value', () => {
    const sut = makeSut()
    const key = LOCAL_STORAGE_KEY.JWT
    const value = faker.internet.password()
    const getItemSpy = jest.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify(value))
    const obj = sut.getItem(key)
    expect(getItemSpy).toHaveBeenCalledWith(key)
    expect(obj).toEqual(value)
  })
})
