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
  <div>
    <h1>Fil d'actualité</h1>

    <div v-if="user">
      <p>Bienvenue {{ user.firstname }}</p>
    </div>

    <button @click="logout()">Logout</button>
    <NuxtLink :to="`/account/`">Mon Compte</NuxtLink>

    <CardPost v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>