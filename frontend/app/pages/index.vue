<script setup>
const { user, logout } = useAuth()
const { posts, fetchPosts } = usePosts()
const config = useRuntimeConfig()
const apiUrl = config.public.WEBAPI_URL

onMounted(async () => {
  await fetchPosts()
})
</script>


<template>
  <div>
    <h1>Fil d'actualité</h1>

    <div v-if="user">
      <p>Bienvenue {{ user.firstname }}</p>
    </div>

    <button @click="logout()">Logout</button>

    <div>
      <div v-for="post in posts" :key="post.id" style="border: 1px solid black; padding: 10px; margin: 10px 0;">
        <strong>{{ post.user?.firstname }}</strong>
        <img v-if="post.image" :src="`${apiUrl}/storage/${post.image}`" />
        <p>{{ post.description }}</p>
        <NuxtLink :to="`/posts/${post.id}`">Voir</NuxtLink>
      </div>
    </div>
  </div>
</template>
