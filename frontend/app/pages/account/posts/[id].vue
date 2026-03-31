<script setup lang="ts">
interface Post {
  id: number
  description: string
  image: string | null
  user: {
    firstname: string
  }
}

const route = useRoute()
const id = route.params.id

const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

const post = ref<Post | null>(null)

const { token } = useAuth()

const deletePost = async () => {
  if (!confirm("Supprimer définitivement ce post ?")) return

  try {
    await $fetch(`${apiUrl}/api/user/posts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    await navigateTo('/account/posts')
  } catch (error) {
    console.error("Erreur lors de la suppression", error)
    alert("Impossible de supprimer le post.")
  }
}

const isEditing = ref(false) 
const editDescription = ref('') 

const startEditing = () => {
  editDescription.value = post.value?.description || '' 
  editImage.value = null
  isEditing.value = true
}

const editImage = ref<File | null>(null)

const onFileSelected = (event: Event) => {
 const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    editImage.value = target.files[0] || null 
  }
}

const updatePost = async () => {
  const formData = new FormData()
  formData.append('description', editDescription.value)
  
  if (editImage.value) {
    formData.append('image', editImage.value)
  }
  formData.append('_method', 'PUT')

  try {
    await $fetch(`${apiUrl}/api/user/posts/${id}`, {
      method: 'POST', 
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: formData
    })
    
    await loadPost() 
    isEditing.value = false
    editImage.value = null

  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const fetchError = error as any;
      console.error("Erreur API :", fetchError.response?._data);
    } else {
      console.error("Erreur inconnue :", error);
    }
    alert("Impossible d'enregistrer les modifications.");
}
}

const loadPost = async () => {
  post.value = await $fetch<Post>(`${apiUrl}/api/user/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })
}

onMounted(loadPost)
</script>

<template>
  <div> <div v-if="post">

    <div v-if="!isEditing">
      <PostDetail :post="post" />
      
      <div class="actions mt-4">
        <button @click="startEditing" class="bg-blue-500 text-white p-2 rounded mr-2">Modifier</button>
        <button @click="deletePost" class="bg-red-500 text-white p-2 rounded">Supprimer</button>
      </div>
    </div>

    <div v-else class="mt-4">
      <textarea v-model="editDescription" class="border p-2 w-full mb-2" rows="4"></textarea>
      <input type="file" @change="onFileSelected" accept="image/*" class="mb-2 w-full">
      
      <div class="actions">
        <button @click="updatePost" class="bg-green-500 text-white p-2 rounded mr-2">Enregistrer</button>
        <button @click="isEditing = false" class="bg-gray-500 text-white p-2 rounded">Annuler</button>
      </div>
    </div>

  </div>

  <div v-else>
    Chargement en cours...
  </div></div>
 
</template>