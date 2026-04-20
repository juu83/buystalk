<script setup>
import { Share } from '@capacitor/share'

const props = defineProps({
  post: { type: Object, required: true },
  showLink: { type: Boolean, default: true },
  baseUrl: { type: String, default: '/posts' }
})

const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL
const webOrigin = process.client ? window.location.origin : 'http://localhost:3000'

// La fameuse fonction de partage
const sharePost = async () => {
  const shareData = {
    title: `Post de ${props.post.user?.firstname}`,
    text: props.post.description,
    url: `${webOrigin}/posts/${props.post.id}`
  }

  try {
    const canShare = await Share.canShare()
    if (canShare.value) {
      await Share.share(shareData)
    } else if (navigator.share) {
      await navigator.share(shareData)
    } else {
      alert('Le partage n\'est pas supporté sur cet appareil.')
    }
  } catch (error) {
    console.error('Erreur lors du partage', error)
  }
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-md p-5 mb-4">
    <p class="text-sm text-gray-500 font-semibold mb-2">
      Auteur :
      <NuxtLink :to="{ path: '/posts', query: { user: post.user?.id } }" class="text-gray-700 hover:text-blue-600 font-medium">
        {{ post.user?.firstname }} {{ post.user?.lastname }}
      </NuxtLink>
    </p>

    <p class="text-gray-800 text-lg mb-4">{{ post.description }}</p>

    <div v-if="post.image" class="mb-4">
      <img :src="post.image && (post.image.startsWith('http') ? post.image : `${apiUrl}/storage/${post.image}`)" alt="Image du post" class="rounded-lg max-h-64 object-cover w-full">
    </div>

    <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
      <div v-if="showLink">
        <NuxtLink :to="`${baseUrl}/${post.id}`" class="text-blue-500 hover:text-blue-700 font-medium">
          Voir les détails &rarr;
        </NuxtLink>
      </div>
      
      <button @click="sharePost" class="text-gray-500 hover:text-blue-500 flex items-center space-x-1 font-medium ml-auto">
        <span>Partager</span>
      </button>
    </div>
  </div>
</template>