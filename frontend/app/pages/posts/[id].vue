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