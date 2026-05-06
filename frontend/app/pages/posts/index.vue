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

    <!-- Section incitative pour créer un post -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
      <div class="flex items-center justify-between gap-4">
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-2">Partage tes pensées !</h2>
          <p class="text-blue-100 text-sm mb-4">Crée un nouveau post pour partager tes idées avec la communauté.</p>
          <NuxtLink
            to="/account/posts/create"
            class="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50 transition shadow-sm"
          >
            <span class="text-lg">✏️</span>
            Créer un post
          </NuxtLink>
        </div>
        <div class="hidden sm:block">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span class="text-2xl">💭</span>
          </div>
        </div>
      </div>
    </div>
    
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