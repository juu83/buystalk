<script setup>
// 1. Récupération de l'utilisateur connecté via useAuth
const { user } = useAuth() 
const { posts, fetchPosts, likePost } = usePosts()
const { triggerLikeNotification } = useNotifications()
const route = useRoute()

const handleLike = async (post) => {
  try {
    // 2. On vérifie qu'on est bien connecté avant de liker
    if (!user.value) return navigateTo('/login')

    await likePost(post.id) 
    
    // 3. Déclenchement de la notification
    // On passe l'ID du propriétaire du post et MON ID (user.value.id)
    await triggerLikeNotification(post.user_id, user.value.id)
    
    // 4. Optionnel : Rafraîchir pour voir le compteur de likes à jour
    const userId = route.query.user || null
    await fetchPosts(userId)
    
  } catch (e) {
    console.error('Erreur like:', e)
  }
}

onMounted(async () => {
  const userId = route.query.user || null
  await fetchPosts(userId)
})
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Fil d'actualité</h1>
    
    <p class="mb-6">
      <NuxtLink to="/" class="text-blue-500 hover:text-blue-700 font-medium">
        &larr; Retour à l'accueil
      </NuxtLink>
    </p>
    
    <div v-if="posts.length === 0" class="text-gray-500 italic">
      Aucune publication pour le moment.
    </div>
    
    <!-- 5. Ajout de l'écouteur d'événement @like -->
    <CardPost 
      v-for="p in posts" 
      :key="p.id" 
      :post="p" 
      baseUrl="/posts"
      @like="handleLike(p)"
    />
  </div>
</template>