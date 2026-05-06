<script setup>
import { ref, onMounted } from 'vue'
import { Share } from '@capacitor/share'
import { usePosts } from '~/composables/usePosts'
import { getApiUrl } from '~/composables/useApiUrl'
// IMPORT des notifications locales et de l'utilisateur connecté
import { useNotifications } from '~/composables/useNotifications'
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  post: { type: Object, required: true },
  showLink: { type: Boolean, default: true },
  baseUrl: { type: String, default: '/posts' }
})

const apiUrl = getApiUrl()
const webOrigin = process.client ? window.location.origin : 'http://localhost:3000'

// Initialisation des outils de notifications et auth
const { triggerLikeNotification, triggerCommentNotification } = useNotifications()
const { user: currentUser } = useAuth()

const showComments = ref(false)
const newComment = ref('')
const comments = ref(props.post.comments || [])
const likesCount = ref(props.post.likes?.length || 0)
const isLiked = ref(props.post.likes?.some(like => like.user_id === currentUser.value?.id) || false)

const sharePost = async () => {
  const shareData = {
    title: `Post de ${props.post.user?.firstname}`,
    text: props.post.description,
    url: `${webOrigin}/posts/${props.post.id}`
  }

  try {
    const canShare = await Share.canShare()
    if (canShare.value) {
      await Share.share(shareData)
    } else if (navigator.share) {
      await navigator.share(shareData)
    } else {
      alert('Le partage n\'est pas supporté sur cet appareil.')
    }
  } catch (error) {
    console.error('Erreur lors du partage', error)
  }
}

const toggleLike = async () => {
  try {
    console.log("Tentative de like..."); // DEBUG
    await usePosts().likePost(props.post.id)
    isLiked.value = !isLiked.value
    likesCount.value += isLiked.value ? 1 : -1

    if (isLiked.value) {
      console.log("Envoi de la notif pour le post de :", props.post.user?.id); // DEBUG
      await triggerLikeNotification(props.post.user?.id, currentUser.value?.id)
    }
  } catch (error) {
    console.error('Failed to toggle like:', error)
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const comment = await usePosts().addComment(props.post.id, newComment.value.trim())
    comments.value.push(comment)
    const commentText = newComment.value // On garde le texte pour la notif
    newComment.value = ''

    // ETAPE 6 : Simulation d'un Commentaire
    // Déclenche la notification locale système
    await triggerCommentNotification(props.post.user?.id, currentUser.value?.id)
  } catch (error) {
    console.error('Failed to add comment:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  if (showComments.value) {
    try {
      comments.value = await usePosts().getComments(props.post.id)
    } catch (error) {
      console.error('Failed to load comments:', error)
    }
  }
})
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-md p-5 mb-4">
    <p class="text-sm text-blue-900 font-semibold mb-2">
      Auteur :
      <NuxtLink :to="{ path: '/posts', query: { user: post.user?.id } }" class="text-blue-900 hover:text-blue-600 font-medium">
        {{ post.user?.firstname }} {{ post.user?.lastname }}
      </NuxtLink>
    </p>

    <p class="text-blue-900 text-lg mb-4">{{ post.description }}</p>

    <div v-if="post.image" class="mb-4">
      <img :src="post.image && (post.image.startsWith('http') ? post.image : `${apiUrl}/storage/${post.image}`)" alt="Image du post" class="rounded-lg max-h-64 object-cover w-full">
    </div>

    <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center space-x-4">
        <button @click="toggleLike" 
                class="flex items-center space-x-2 text-blue-900 hover:text-red-500 transition-colors">
          <svg class="w-5 h-5" :class="{ 'text-red-500 fill-current': isLiked }" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{{ likesCount }}</span>
        </button>

        <button @click="showComments = !showComments" 
                class="flex items-center space-x-2 text-blue-900 hover:text-blue-500 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{{ comments.length }}</span>
        </button>
      </div>

      <div class="flex space-x-2">
        <div v-if="showLink">
          <NuxtLink :to="`${baseUrl}/${post.id}`" class="text-blue-500 hover:text-blue-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
          </svg>
          </NuxtLink>
        </div>
        
        <button @click="sharePost" class="text-gray-500 hover:text-blue-500 flex items-center space-x-1 font-medium">
          <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
            </svg>
          </span>
        </button>
      </div>
    </div>

    <!-- Comments Section -->
    <div v-if="showComments" class="border-t pt-3 mt-3">
      <div class="mb-3">
        <div class="flex space-x-2">
          <input v-model="newComment" 
                 @keyup.enter="submitComment"
                 placeholder="Écrivez un commentaire..." 
                 class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <button @click="submitComment" 
                  :disabled="!newComment.trim()"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
            Publier
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <div v-for="comment in comments" :key="comment.id" class="flex space-x-2">
          <img :src="comment.user.avatar || '/default-avatar.png'" 
               :alt="comment.user.firstname" 
               class="w-8 h-8 rounded-full">
          <div class="flex-1">
            <div class="bg-gray-100 rounded-lg px-3 py-2">
              <p class="font-semibold text-sm">{{ comment.user.firstname }} {{ comment.user.lastname }}</p>
              <p class="text-sm">{{ comment.content }}</p>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(comment.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>