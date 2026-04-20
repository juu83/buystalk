<script setup>
import { Share } from '@capacitor/share'
import { ref, reactive, onMounted, computed } from 'vue'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const id = route.params.id

const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL
const webOrigin = process.client ? window.location.origin : 'http://localhost:3000'

const { post, fetchPost, updatePost, deletePost } = usePosts()
const { user } = useAuth()

const isEditing = ref(false)
const form = reactive({ description: '' })
const isSubmitting = ref(false)

const isOwner = computed(() => post.value && user.value && post.value.user?.id === user.value.id)

onMounted(async () => {
  await fetchPost(id)
  if (post.value) {
    form.description = post.value.description
  }
})

const handleUpdate = async () => {
  if (!form.description) return alert('La description est obligatoire')
  
  isSubmitting.value = true
  try {
    await updatePost(id, form)
    alert('Post modifié avec succès !')
    post.value.description = form.description // Met à jour l'affichage
    isEditing.value = false // On quitte le mode édition
  } catch (error) {
    alert('Erreur lors de la modification')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (confirm('Voulez-vous vraiment supprimer ce post ?')) {
    try {
      await deletePost(id)
      alert('Post supprimé')
      navigateTo('/account/posts') // Retour à la liste
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }
}

const sharePost = async () => {
  if (!post.value) return
  
  const shareData = {
    title: `Post de ${post.value.user?.firstname}`,
    text: post.value.description,
    url: `${webOrigin}/posts/${post.value.id}`
  }

  try {
    const canShare = await Share.canShare()
    if (canShare.value) {
      await Share.share(shareData)
    } else if (navigator.share) {
      await navigator.share(shareData)
    } else {
      alert('Le partage n\'est pas supporté.')
    }
  } catch (error) {
    console.error('Erreur', error)
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-8">
    <p class="mb-6">
      <NuxtLink to="/account/posts" class="text-blue-500 hover:text-blue-700 font-medium">
        &larr; Retour à mes publications
      </NuxtLink>
    </p>

    <div v-if="post" class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      
      <div v-if="!isEditing">
        <p class="text-sm text-gray-500 font-semibold mb-2">
          Auteur : {{ post.user?.firstname }} {{ post.user?.lastname }}
        </p>
        <p class="text-gray-800 text-lg mb-4">{{ post.description }}</p>
        
        <div v-if="post.image" class="mb-4">
          <img :src="post.image && (post.image.startsWith('http') ? post.image : `${apiUrl}/storage/${post.image}`)" alt="Image" class="rounded-lg max-h-64 object-cover w-full">
        </div>

        <div class="flex space-x-4 mt-6">
          <div v-if="isOwner">
            <button @click="isEditing = true" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Modifier
            </button>
            <button @click="handleDelete" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Supprimer
            </button>
          </div>
          <button @click="sharePost" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Partager
          </button>
        </div>
      </div>

      <form v-else @submit.prevent="handleUpdate">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">Modifier la description :</label>
          <textarea 
            v-model="form.description" 
            rows="4" 
            class="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div class="flex space-x-4">
          <button type="submit" :disabled="isSubmitting" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
          <button @click="isEditing = false" type="button" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Annuler
          </button>
        </div>
      </form>

    </div>
    
    <div v-else class="text-gray-500 italic">
      Chargement du post...
    </div>
  </div>
</template>