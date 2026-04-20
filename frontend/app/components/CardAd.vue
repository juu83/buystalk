<script setup lang="ts">
import { computed } from 'vue'

const { user } = useAuth()

const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

const props = defineProps({
  ad: {
    type: Object,
    required: true
  }
})

const isMyAd = computed(() => {
  return user.value && user.value.id === props.ad.user_id
})

const formattedDistance = computed(() => {
  if (props.ad.distance === undefined || props.ad.distance === null) return null
  return `• à ${Math.round(props.ad.distance)} km`
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition hover:shadow-md">
    
    <div class="p-4 flex items-center space-x-3">
      <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
        {{ ad.title?.charAt(0).toUpperCase() || '?' }}
      </div>
    
      <div class="flex flex-col">
        <h2 class="font-bold text-gray-900 leading-tight">{{ ad.title }}</h2>
        <div class="flex items-center space-x-1 text-xs text-gray-500 uppercase tracking-wide">
          <span>📍 {{ ad.city }}</span>
          <span v-if="formattedDistance" class="font-medium text-blue-500">
            {{ formattedDistance }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="ad.image" class="aspect-video w-full bg-gray-200">
      <img :src="`${apiUrl}/storage/${ad.image}`" alt="Ad image" class="w-full h-full object-cover" />
    </div>

    <div class="p-4">
      <p class="text-gray-700 leading-relaxed line-clamp-3 mb-4">{{ ad.description }}</p>
      
      <div class="pt-4 border-t flex justify-between items-center text-sm font-medium">
        <NuxtLink 
          :to="isMyAd ? `/account/ads/${ad.id}` : `/ads/${ad.id}`" 
          class="text-blue-600 hover:text-blue-800 transition flex items-center"
        >
          <span>{{ isMyAd ? 'Gérer mon annonce' : 'Voir les détails' }}</span>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>