<script setup lang="ts">

    const route = useRoute()
    const id = route.params.id


    const config = useRuntimeConfig()
    const WEBAPI_URL = config.public.WEBAPI_URL

    interface Post {
        id: number
        description: string
        image: string | null
        user: {
            firstname: string
        }
    }

    const post = ref<Post | null>(null)


   const loadPost = async () => {
        post.value = await $fetch<Post>(`${WEBAPI_URL}/api/posts/${id}`)
    }


    onMounted(async () => {
    await loadPost()
    })
</script>

<template>
  <div v-if="post">
    <h3>{{ post.user.firstname }}</h3>
    
    <img 
      v-if="post.image" 
      :src="`${WEBAPI_URL}/storage/${post.image}`" 
      alt="Image du post"
    >
    <p>{{ post.description }}</p>
  </div>

  <div v-else>
    Chargement en cours... ⏳
  </div>
</template>