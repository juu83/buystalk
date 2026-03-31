<script setup lang="ts">

    const route = useRoute()
    const id = route.params.id


    const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
    const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

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
        post.value = await $fetch<Post>(`${apiUrl}/api/posts/${id}`)
    }


    onMounted(async () => {
    await loadPost()
    })
</script>

<template>

  <div>  <div v-if="post">
    <PostDetail :post="post" />
    
    <NuxtLink to="/posts" class="btn">Retour</NuxtLink>
    
  </div>

  <div v-else>
    Chargement en cours...
  </div></div>

</template>