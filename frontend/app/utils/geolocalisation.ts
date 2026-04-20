export async function ensurePermissions() {
  if (!process.client) return { location: 'granted' }

  try {
    const cap = (globalThis as any).Capacitor
    if (cap && cap.Plugins && cap.Plugins.Geolocation) {
      // Native Capacitor plugin available
      const { Geolocation } = await import('@capacitor/geolocation')
      try {
        const perm = await Geolocation.checkPermissions()
        if (perm && (perm as any).location === 'granted') return perm
        // request permissions
        const req = await Geolocation.requestPermissions()
        return req
      } catch (e) {
        // fallthrough to web permissions
      }
    }
  } catch (e) {
    // ignore
  }

  // Web fallback
  try {
    if (navigator.permissions) {
      const p = await navigator.permissions.query({ name: 'geolocation' as any })
      return { location: p.state }
    }
  } catch (e) {
    // ignore
  }

  return { location: 'prompt' }
}

export async function getCurrentPosition(opts: any = { enableHighAccuracy: true, timeout: 15000 }) {
  if (!process.client) throw new Error('Not client')

  // Try native Capacitor plugin first when available
  try {
    const cap = (globalThis as any).Capacitor
    if (cap && cap.Plugins && cap.Plugins.Geolocation) {
      const { Geolocation } = await import('@capacitor/geolocation')
      const pos = await Geolocation.getCurrentPosition(opts)
      return pos
    }
  } catch (e) {
    // continue to web fallback
  }

  // Web fallback using navigator.geolocation
  return await new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('Geolocation not supported'))
    navigator.geolocation.getCurrentPosition(
      (p) => resolve(p),
      (err) => reject(err),
      opts
    )
  })
}

export default { ensurePermissions, getCurrentPosition }
