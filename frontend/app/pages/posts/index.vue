<script setup>
const { posts, fetchPosts } = usePosts()
const route = useRoute()

onMounted(async () => {
  const userId = route.query.user || null
  await fetchPosts(userId)
})
</script>

<template>
  <div class="max-w-3xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Fil d'actualité</h1>
    
    <p class="mb-6">
      <NuxtLink to="/" class="text-blue-500 hover:text-blue-700 font-medium">
        &larr; Retour à l'accueil
      </NuxtLink>
    </p>
    
    <div v-if="posts.length === 0" class="text-gray-500 italic">
      Aucune publication pour le moment.
    </div>
    
    <CardPost 
      v-for="p in posts" 
      :key="p.id" 
      :post="p" 
      baseUrl="/posts"
    />
  </div>
</template>