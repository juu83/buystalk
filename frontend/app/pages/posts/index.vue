<script setup>
const { user, logout } = useAuth()
const { posts, fetchPosts } = usePosts()
const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

onMounted(async () => {
  await fetchPosts()
})
</script>


<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Fil d'actualité</h2>
      <button @click="logout()" class="text-xs text-red-500 font-bold uppercase">Sortir</button>
    </div>
    
    <CardPost v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>