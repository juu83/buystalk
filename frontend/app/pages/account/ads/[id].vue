<script setup lang="ts">
const { deleteAd, loading } = useAds()

const route = useRoute()
const id = route.params.id
const { token } = useAuth()

const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

interface Ad {
  id: number
  title: string
  description: string
  city: string
  image: string | null
  user_id: number
}

const ad = ref<Ad | null>(null)
const isEditing = ref(false)
const editTitle = ref('')
const editDescription = ref('')
const editImage = ref<File | null>(null)

const loadAd = async () => {
  ad.value = await $fetch<Ad>(`${apiUrl}/api/user/ads/${id}`, {
    headers: { Authorization: `Bearer ${token.value}` }
  })
}

const startEditing = () => {
  editTitle.value = ad.value?.title || ''
  editDescription.value = ad.value?.description || ''
  isEditing.value = true
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) editImage.value = target.files[0]
}

const updateAd = async () => {
  const formData = new FormData()
  formData.append('title', editTitle.value)
  formData.append('description', editDescription.value)
  if (editImage.value) formData.append('image', editImage.value)
  formData.append('_method', 'PUT')

  try {
    await $fetch(`${apiUrl}/api/user/ads/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: formData
    })
    await loadAd()
    isEditing.value = false
  } catch (error) {
    alert("Erreur lors de la mise à jour.")
  }
}

const handleDelete = async () => {
  if (!confirm("Supprimer cette annonce ?")) return
  
  const success = await deleteAd(id)
  if (success) {
    navigateTo('/account/ads')
  } else {
    alert("Impossible de supprimer l'annonce.")
  }
}

onMounted(loadAd)
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <div v-if="ad">
      <div v-if="!isEditing">
        <CardAd :ad="ad" />
        <div class="flex space-x-2 mt-4">
          <button @click="startEditing" class="flex-1 bg-blue-600 text-white p-3 rounded-xl font-bold transition hover:bg-blue-700">
            Modifier
          </button>
          <button 
            @click="handleDelete" 
            :disabled="loading"
            class="flex-1 bg-red-100 text-red-600 p-3 rounded-xl font-bold transition hover:bg-red-200 disabled:opacity-50"
          >
            {{ loading ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </div>

      <div v-else class="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 class="text-lg font-bold text-gray-800">Modifier l'annonce</h2>
        <input v-model="editTitle" type="text" class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Titre">
        <textarea v-model="editDescription" class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="4"></textarea>
        <input type="file" @change="onFileSelected" class="text-sm text-gray-500">
        
        <div class="flex space-x-2 pt-2">
          <button @click="updateAd" class="flex-1 bg-green-600 text-white p-3 rounded-xl font-bold">Enregistrer</button>
          <button @click="isEditing = false" class="flex-1 bg-gray-200 p-3 rounded-xl font-bold">Annuler</button>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-10">
      <div class="animate-pulse text-gray-400 italic font-medium text-lg">Chargement de l'annonce... ⏳</div>
    </div>
  </div>
</template>