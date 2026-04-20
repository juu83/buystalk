import { ref } from 'vue'
import { Geolocation } from '@capacitor/geolocation'

export const useAds = () => {
  const ads = ref<any[]>([])
  const lat = ref<number | null>(null)
  const lng = ref<number | null>(null)
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)

  const { token } = useAuth()
  const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
  const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

  const updateLocation = async () => {
    loading.value = true
    try {
      const permissions = await Geolocation.requestPermissions()
      if (permissions.location === 'granted') {
        const position = await Geolocation.getCurrentPosition()
        lat.value = position.coords.latitude
        lng.value = position.coords.longitude
      }
    } catch (err) {
      errorMessage.value = "Erreur GPS"
    } finally {
      loading.value = false
    }
  }

  const fetchAds = async () => {
    if (!lat.value || !lng.value) return
    loading.value = true
    try {
      ads.value = await $fetch<any[]>(`${apiUrl}/api/ads`, {
        query: { lat: lat.value, lng: lng.value }
      })
    } finally {
      loading.value = false
    }
  }

  const fetchUserAds = async () => {
    loading.value = true
    try {
      ads.value = await $fetch<any[]>(`${apiUrl}/api/user/ads`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
    } finally {
      loading.value = false
    }
  }

  const createAd = async (adData: { title: string, description: string, city: string, image: File | null }) => {
    const formData = new FormData()
    formData.append('title', adData.title)
    formData.append('description', adData.description)
    formData.append('city', adData.city)
    if (adData.image) formData.append('image', adData.image)

    try {
      await $fetch(`${apiUrl}/api/user/ads`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json'
        },
        body: formData
      })
      await fetchUserAds()
      return true
    } catch (error) {
      return false
    }
  }

  const deleteAd = async (adId: number | string) => {
    try {
      await $fetch(`${apiUrl}/api/user/ads/${adId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token.value}` }
      })
      
      ads.value = ads.value.filter(a => a.id !== Number(adId))
      return true
    } catch (err) {
      console.error("Erreur suppression", err)
      return false
    }
  }

  return {
    ads,
    lat,
    lng,
    loading,
    errorMessage,
    updateLocation,
    fetchAds,
    fetchUserAds,
    createAd,
    deleteAd
  }
}