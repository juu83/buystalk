<script setup lang="ts">
// 📋 Définition de l'interface spécifique aux annonces
interface Ad {
  id: number
  title: string      // 🆕 Ajout du titre
  description: string
  city: string       // 🆕 Ajout de la ville
  image: string | null
  user_id: number
}

const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

defineProps<{
  ad: Ad
}>()
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
    <div v-if="ad.image" class="aspect-video w-full bg-gray-100">
      <img 
        :src="`${apiUrl}/storage/${ad.image}`" 
        alt="Illustration de l'annonce"
        class="w-full h-full object-cover"
      >
    </div>

    <div class="p-6">
      <div class="flex justify-between items-start mb-2">
        <h2 class="text-2xl font-bold text-gray-900">{{ ad.title }}</h2>
        <span class="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          📍 {{ ad.city }}
        </span>
      </div>
      
      <p class="text-gray-600 leading-relaxed whitespace-pre-line">
        {{ ad.description }}
      </p>
    </div>
  </div>
</template>