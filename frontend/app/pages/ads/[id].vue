<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const id = route.params.id // On récupère l'ID depuis l'URL 📍

const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

interface Ad {
  id: number
  title: string
  description: string
  city: string
  image: string | null
  user_id: number
}

const ad = ref<Ad | null>(null)
const loading = ref(true)

const loadAd = async () => {
  try {
    ad.value = await $fetch<Ad>(`${apiUrl}/api/ads/${id}`)
  } catch (error) {
    console.error("Erreur lors du chargement de l'annonce", error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadAd()
})
</script>

<template>
  <div class="p-4 max-w-2xl mx-auto">
    <div v-if="ad">
      <CardAd :ad="ad" /> 
      
      <div class="mt-6 flex space-x-4">
        <NuxtLink to="/ads" class="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
          ⬅ Retour aux annonces
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-10">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      <p class="mt-2 text-gray-500">Chargement de l'annonce...</p>
    </div>

    <div v-else class="text-center py-10 text-red-500">
      Annonce introuvable
    </div>
  </div>
</template>