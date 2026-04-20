<script setup>
import { ensurePermissions, getCurrentPosition } from '~/utils/geolocation'

const { ads, fetchAds, apiUrl } = useAds()
const statusMsg = ref('Recherche de votre position géographique...')
const isLocated = ref(false)

onMounted(async () => {
    try {
      await ensurePermissions()
      try {
        const position = await getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 })
        const lat = position.coords.latitude.toFixed(4)
        const lng = position.coords.longitude.toFixed(4)
        statusMsg.value = `📍 Position trouvée (${lat}, ${lng})`
        isLocated.value = true
        await fetchAds(position.coords.latitude, position.coords.longitude)
        return
      } catch (e) {
      // fallback to non-geolocated listing
      statusMsg.value = 'Localisation refusée ou indisponible. Affichage standard.'
      await fetchAds()
      return
    }
  } catch (e) {
    statusMsg.value = 'Géolocalisation non supportée ou permissions manquantes.'
    await fetchAds()
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-extrabold text-gray-900">Petites Annonces</h1>
      
      <NuxtLink to="/ads/create" class="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition flex items-center gap-2">
        + Créer
      </NuxtLink>
    </div>

    <div class="mb-6 p-4 rounded-xl border font-medium" :class="isLocated ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600'">
      {{ statusMsg }}
    </div>

    <div v-if="ads.length === 0" class="text-center py-12 text-gray-500 italic bg-white rounded-2xl border border-gray-100">
      Aucune annonce disponible pour le moment. Soyez le premier !
    </div>

    <div class="grid grid-cols-1 gap-6">
      <CardAd v-for="ad in ads" :key="ad.id" :ad="ad" :apiUrl="apiUrl" />
    </div>
  </div>
</template>