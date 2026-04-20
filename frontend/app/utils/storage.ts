function getCapacitorStorage() {
  if (!process.client) return null
  const cap = (globalThis as any).Capacitor || (globalThis as any).capacitor
  if (cap && cap.Plugins && cap.Plugins.Storage) return cap.Plugins.Storage
  // Some Capacitor installs expose Storage directly
  if ((globalThis as any).CapacitorStorage) return (globalThis as any).CapacitorStorage
  return null
}

export async function getToken(): Promise<string | null> {
  if (process.client) {
    try {
      const Storage = getCapacitorStorage()
      if (Storage && Storage.get) {
        const res = await Storage.get({ key: 'token' })
        if (res?.value) return res.value
      }
    } catch (e) {
      // ignore and fallback
    }

    try {
      return localStorage.getItem('token')
    } catch (e) {
      return null
    }
  }
  return null
}

export async function setToken(value: string) {
  if (process.client) {
    try {
      const Storage = getCapacitorStorage()
      if (Storage && Storage.set) {
        await Storage.set({ key: 'token', value })
      }
    } catch (e) {
      // ignore
    }

    try {
      localStorage.setItem('token', value)
    } catch (e) {
      // ignore
    }
  }
}

export async function removeToken() {
  if (process.client) {
    try {
      const Storage = getCapacitorStorage()
      if (Storage && Storage.remove) {
        await Storage.remove({ key: 'token' })
      }
    } catch (e) {
      // ignore
    }

    try {
      localStorage.removeItem('token')
    } catch (e) {
      // ignore
    }
  }
}

export default { getToken, setToken, removeToken }
