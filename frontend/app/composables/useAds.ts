export const useAds = () => {
  const ads = useState('ads', () => [])
  const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
  const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL
  const token = useCookie('token')

  const getHeaders = () => ({
    'Authorization': `Bearer ${token.value}`,
    'Accept': 'application/json',
  })

  const fetchAds = async (lat = null, lng = null) => {
    try {
      let url = `${apiUrl}/api/ads`
      if (lat !== null && lng !== null) {
        url += `?lat=${lat}&lng=${lng}`
      }
      const res = await $fetch(url, { headers: getHeaders() })
      ads.value = res
    } catch (e) {
      console.error("Erreur API Annonces", e)
    }
  }

  const createAd = async (formData) => {
    return await $fetch(`${apiUrl}/api/user/ads`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token.value}`, 
        'Accept': 'application/json' 
      },
      body: formData
    })
  }

  return { ads, fetchAds, createAd, apiUrl }
}