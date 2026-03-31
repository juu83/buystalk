<script setup lang="ts">
interface Post {
  id: number
  description: string
  image: string | null
  user: {
    firstname: string
  }
}

const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

defineProps<{
  post: Post
}>()
</script>

<template>
  <div class="post-detail">
    <h3>{{ post?.user?.firstname || 'Chargement...' }}</h3>
    
    <img 
      v-if="post.image" 
      :src="`${apiUrl}/storage/${post.image}`" 
      alt="Image du post"
      style="max-width: 100%;"
    >
    <p>{{ post.description }}</p>
  </div>
</template>