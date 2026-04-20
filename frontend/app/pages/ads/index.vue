<script setup>
const { user, logout } = useAuth()
const { ads, updateLocation, fetchAds, loading, errorMessage } = useAds()
const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

onMounted(async () => {
  await updateLocation()
  await fetchAds()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <header class="p-6 bg-white shadow-sm mb-6">
      <h1 class="text-2xl font-extrabold text-gray-900">Annonces à proximité</h1>
      <p v-if="ads.length > 0" class="text-sm text-gray-500 mt-1">
        {{ ads.length }} annonces trouvées autour de vous
      </p>
    </header>

    <main class="px-4">
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-500 font-medium">Recherche des meilleures offres...</p>
      </div>

      <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
        {{ errorMessage }}
      </div>

      <div v-else-if="ads.length === 0" class="text-center py-12">
        <p class="text-gray-500">Aucune annonce trouvée dans votre secteur.</p>
      </div>

      <div v-else class="space-y-2">
        <CardAd 
          v-for="ad in ads" 
          :key="ad.id" 
          :ad="ad" 
        />
      </div>
    </main>
  </div>
</template>