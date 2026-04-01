<script setup lang="ts">
import { computed } from 'vue'

const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

const { sharePost } = useSocial()
const route = useRoute()

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const isMyPost = computed(() => route.path.includes('/account'))
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition hover:shadow-md">
    <div class="p-4 flex items-center space-x-3">
      <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
        {{ post.user?.firstname?.charAt(0) || '?' }}
      </div>
      <span class="font-semibold text-gray-800">{{ post.user?.firstname || 'Utilisateur' }}</span>
    </div>

    <div v-if="post.image" class="aspect-video w-full bg-gray-200">
      <img :src="`${apiUrl}/storage/${post.image}`" alt="Post content" class="w-full h-full object-cover" />
    </div>

    <div class="p-4">
      <p class="text-gray-700 leading-relaxed">{{ post.description }}</p>
      
      <div class="mt-4 pt-4 border-t flex justify-between items-center text-sm font-medium">
        <NuxtLink :to="isMyPost ? `/account/posts/${post.id}` : `/posts/${post.id}`" class="text-blue-600 hover:text-blue-800 transition">
          {{ isMyPost ? 'Gérer ma publication' : 'Voir les détails' }}
        </NuxtLink>
        
        <button @click="sharePost(post)" class="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition">
          <span>Partager</span>
        </button>
      </div>
    </div>
  </div>
</template>