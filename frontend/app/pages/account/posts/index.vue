<script setup>
definePageMeta({
  middleware: ['auth']
})

const { posts, fetchUserPosts } = usePosts()

const refreshPosts = async () => {
  await fetchUserPosts()
}

onMounted(async () => {
  await fetchUserPosts()
})
</script>

<template>
  <div class="max-w-3xl mx-auto py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-blue-900">Mes publications</h1>
      
      <NuxtLink to="/account/posts/create" class="bg-blue-500 text-white font-bold px-4 py-2 rounded shadow hover:bg-blue-600">
        + Créer un post
      </NuxtLink>
    </div>

    <p class="mb-6">
      <NuxtLink to="/account" class="text-gray-700 hover:text-blue-700 font-medium">
        &larr; Retour à mon compte
      </NuxtLink>
    </p>
    
    <div v-if="posts.length === 0" class="text-blue-900 italic bg-gray-50 p-4 rounded border">
      Vous n'avez pas encore publié de post.
    </div>
    
    <CardPost 
      v-for="p in posts" 
      :key="p.id" 
      :post="p" 
      baseUrl="/account/posts"
      @refresh="refreshPosts"
    />
  </div>
</template>