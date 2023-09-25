type TOKEN = 'FBT-HOTEL-ACCESS-TOKEN'
type APP = 'persist:root'

export const LOCAL_STORAGE_KEY: {
  JWT: TOKEN
  APP: APP
} = {
  JWT: 'FBT-HOTEL-ACCESS-TOKEN',
  APP: 'persist:root'
}
export type LocalStorageKeyType = APP | TOKEN

export class LocalStorageUtils {
  public getItem<T>(key: LocalStorageKeyType, defaultValue?: T): T | null {
    const item = localStorage.getItem(key)
    if (item) {
      if (key === LOCAL_STORAGE_KEY.APP) {
        const rootState = JSON.parse(item)
        for (const prop in rootState) {
          // lặp qua all key
          rootState[prop] = JSON.parse(rootState[prop])
        }
        return rootState as T
      }
      return JSON.parse(item) as T
    }
    return defaultValue ? defaultValue : null
  }

  public setItem<T>(key: LocalStorageKeyType, value: T): void {
    if (key === LOCAL_STORAGE_KEY.APP) {
      console.log('Bạn không thể set bằng method này')
      return
    }
    if (value) {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.removeItem(key)
    }
  }

  public removeItem(key: LocalStorageKeyType): void {
    localStorage.removeItem(key)
  }

  public clear(): void {
    localStorage.clear()
  }

  public getJWT(): string | null {
    return this.getItem<string>(LOCAL_STORAGE_KEY.JWT)
  }
}
