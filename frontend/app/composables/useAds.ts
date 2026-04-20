export const useAds = () => {
  const ads = useState('ads', () => [])
  const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
  const apiUrl = APP_ENV === 'mobile' ? (APPAPI_URL || WEBAPI_URL) : WEBAPI_URL
  const token = useCookie('token')

  const getHeaders = () => ({
    'Accept': 'application/json',
    ...(token.value ? { 'Authorization': `Bearer ${token.value}` } : {})
  })

  const fetchAds = async (lat = null, lng = null) => {
    try {
      let url = `${apiUrl}/api/ads`
      if (lat !== null && lng !== null) {
        url += `?lat=${lat}&lng=${lng}`
      }
      const res = await $fetch(url, { headers: getHeaders() })
      ads.value = Array.isArray(res) ? res : res?.data ?? []
    } catch (e) {
      console.error('Erreur API Annonces', e)
      ads.value = []
    }
  }

  const createAd = async (formData) => {
    try {
      return await $fetch(`${apiUrl}/api/user/ads`, {
        method: 'POST',
        headers: getHeaders(), // Pas de Content-Type ici pour que FormData gère l'image
        body: formData
      })
    } catch (err: any) {
      console.error('Erreur création d\'annonce', err)
      throw err
    }
  }

  return { ads, fetchAds, createAd, apiUrl }
}