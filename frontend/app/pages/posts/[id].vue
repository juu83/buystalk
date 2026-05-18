<script setup>
import { Share } from '@capacitor/share'
import { computed, ref, reactive, onMounted } from 'vue'

definePageMeta({ middleware: ['auth'] })

import { getApiUrl } from '~/composables/useApiUrl'

const route = useRoute()
const id = route.params.id
const apiUrl = getApiUrl()
const webOrigin = process.client ? window.location.origin : 'http://localhost:3000'
const { post, fetchPost, updatePost, deletePost } = usePosts()
const { user } = useAuth()

const isEditing = ref(false)
const form = reactive({ description: '' })
const isSubmitting = ref(false)

const likesCount = computed(() => post.value?.likes?.length ?? 0)
const comments = computed(() => post.value?.comments ?? [])
const commentsCount = computed(() => comments.value.length)

const isOwner = computed(() => post.value && user.value && post.value.user?.id === user.value.id)

onMounted(async () => {
  await fetchPost(id)
  if (post.value) { form.description = post.value.description }
})

const handleUpdate = async () => {
  if (!form.description) return alert('La description est obligatoire')
  isSubmitting.value = true
  try {
    await updatePost(id, form)
    post.value.description = form.description
    isEditing.value = false
  } catch (error) { alert('Erreur') } 
  finally { isSubmitting.value = false }
}

const handleDelete = async () => {
  if (confirm('Voulez-vous vraiment supprimer ce post ?')) {
    await deletePost(id)
    navigateTo('/account/posts')
  }
}

const sharePost = async () => {
  if (!post.value) return
  const shareData = { title: `Post de ${post.value.user?.firstname}`, text: post.value.description, url: `${webOrigin}/posts/${post.value.id}` }
  try {
    const canShare = await Share.canShare()
    if (canShare.value) await Share.share(shareData)
    else if (navigator.share) await navigator.share(shareData)
    else alert('Partage non supporté.')
  } catch (error) { console.error('Erreur', error) }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8">
    <div class="mb-6">
      <NuxtLink to="/account/posts" class="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
        &larr; Retour à mes publications
      </NuxtLink>
    </div>

    <div v-if="post" class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      
      <div v-if="!isEditing" class="p-6 sm:p-8">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
            {{ post.user?.firstname?.charAt(0) }}
          </div>
          <div>
            <p class="font-bold text-blue-900">{{ post.user?.firstname }} {{ post.user?.lastname }}</p>
            <p class="text-sm text-blue-900">Auteur du post</p>
          </div>
        </div>
        
        <p class="text-blue-900 text-xl leading-relaxed mb-6">{{ post.description }}</p>

        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span>{{ likesCount }} like{{ likesCount > 1 ? 's' : '' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 10c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 19l1.395-3.72C3.512 13.042 3 11.574 3 10c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{{ commentsCount }} commentaire{{ commentsCount > 1 ? 's' : '' }}</span>
          </div>
        </div>

        <div v-if="post.image" class="mb-6 -mx-6 sm:-mx-8">
          <img :src="post.image && (post.image.startsWith('http') ? post.image : `${apiUrl}/storage/${post.image}`)" alt="Image" class="w-full max-h-96 object-cover">
        </div>

        <div class="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
            <div v-if="isOwner" class="flex space-x-4 mt-6">
              <button @click="isEditing = true" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                Modifier
              </button>
              <button @click="handleDelete" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Supprimer
              </button>
            </div>
          <button @click="sharePost" class="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-xl font-medium transition ml-auto flex-1 sm:flex-none shadow-md">
            Partager
          </button>
        </div>

        <div v-if="comments.length" class="mt-8 pt-6 border-t border-gray-100 px-0 sm:px-0">
          <h2 class="text-lg font-bold text-blue-900 mb-4">Commentaires</h2>
          <div class="space-y-4">
            <div v-for="comment in comments" :key="comment.id" class="flex gap-3 bg-gray-50 p-4 rounded-3xl border border-gray-100">
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg">
                {{ comment.user?.firstname?.charAt(0) ?? '?' }}
              </div>
              <div class="flex-1">
                <p class="font-semibold text-blue-900">{{ comment.user?.firstname ?? 'Utilisateur' }} {{ comment.user?.lastname ?? '' }}</p>
                <p class="text-gray-700 mt-1">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form v-else @submit.prevent="handleUpdate" class="p-6 sm:p-8 bg-yellow-50/30">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">Mode Édition</h3>
        <div class="mb-4">
          <textarea v-model="form.description" rows="5" class="w-full p-4 rounded-xl border border-yellow-200 focus:ring-2 focus:ring-yellow-400 outline-none bg-white shadow-inner resize-none text-lg"></textarea>
        </div>
        <div class="flex space-x-3">
          <button type="submit" :disabled="isSubmitting" class="bg-yellow-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-600 transition shadow-md">
            {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
          <button @click="isEditing = false" type="button" class="bg-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-300 transition">
            Annuler
          </button>
        </div>
      </form>

    </div>
    
    <div v-else class="text-center py-12 text-gray-400 animate-pulse">
      Chargement du post...
    </div>
  </div>
</template>