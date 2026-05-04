<script setup>
const route = useRoute()
const { ads, fetchAds, apiUrl } = useAds()
const ad = ref(null)
const loading = ref(true)
const error = ref(null)

const adId = route.params.id

onMounted(async () => {
  try {
    // Si les annonces ne sont pas chargées, les récupérer d'abord
    if (ads.value.length === 0) {
      await fetchAds()
    }

    // Chercher l'annonce dans la liste
    const foundAd = ads.value.find(a => a.id == adId)
    if (foundAd) {
      ad.value = foundAd
    } else {
      throw new Error('Annonce non trouvée')
    }
  } catch (err) {
    error.value = 'Annonce introuvable'
    console.error('Erreur chargement annonce:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/ads" class="text-blue-600 hover:text-blue-800 font-medium">
        ← Retour aux annonces
      </NuxtLink>
      <span class="text-gray-400">|</span>
      <NuxtLink to="/map" class="text-green-600 hover:text-green-800 font-medium">
        🗺️ Voir sur la carte
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-500 mt-4">Chargement de l'annonce...</p>
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-600">
      <p class="text-lg">{{ error }}</p>
      <NuxtLink to="/ads" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
        Retour à la liste des annonces
      </NuxtLink>
    </div>

    <div v-else-if="ad" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-8">
        <div class="flex justify-between items-start mb-6">
          <div class="flex-1">
            <h1 class="text-3xl font-extrabold text-gray-900 mb-2">{{ ad.title }}</h1>
            <div class="flex items-center gap-4 text-gray-600">
              <span class="flex items-center gap-1">
                📍 {{ ad.city }}
              </span>
              <span v-if="ad.distance !== undefined" class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                📏 {{ Math.round(ad.distance) }} km de vous
              </span>
            </div>
          </div>
          <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
            {{ ad.user?.firstname?.charAt(0) || '?' }}
          </div>
        </div>

        <div class="prose prose-gray max-w-none mb-8">
          <p class="text-gray-700 text-lg leading-relaxed">{{ ad.description }}</p>
        </div>

        <div v-if="ad.image" class="rounded-2xl overflow-hidden border border-gray-100 mb-8">
          <img :src="`${apiUrl}/storage/${ad.image}`" class="w-full object-cover" :alt="ad.title" />
        </div>

        <div class="border-t border-gray-100 pt-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              Publiée par <span class="font-medium text-gray-700">{{ ad.user?.firstname }} {{ ad.user?.lastname }}</span>
            </div>
            <div class="text-sm text-gray-500">
              {{ new Date(ad.created_at).toLocaleDateString('fr-FR') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>