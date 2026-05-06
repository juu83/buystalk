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
      <h1 class="text-3xl font-extrabold text-blue-900">Petites Annonces</h1>
    </div>
    <!-- Section incitative pour créer un post -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
      <div class="flex items-center justify-between gap-4">
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-2">Envie de vendre quelque chose ?</h2>
          <p class="text-blue-100 text-sm mb-4">Crée une nouvelle annonce pour faire connaître ton produit.</p>
          <NuxtLink
            to="ads/create"
            class="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50 transition shadow-sm"
          >
            <span class="text-lg"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </span>
            Créer une annonce
          </NuxtLink>
        </div>
        <div class="hidden sm:block">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span class="text-2xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          </span>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-6 p-4 rounded-xl border font-medium" :class="isLocated ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600'">
      {{ statusMsg }}
    </div>

    <div v-if="ads.length === 0" class="text-center py-12 text-blue-900 italic bg-white rounded-2xl border border-gray-100">
      Aucune annonce disponible pour le moment. Soyez le premier !
    </div>

    <div class="grid grid-cols-1 gap-6">
      <CardAd v-for="ad in ads" :key="ad.id" :ad="ad" :apiUrl="apiUrl" />
    </div>
  </div>
</template>