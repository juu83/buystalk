<script setup lang="ts">

const { posts, fetchUserPosts } = usePosts()
const { token } = useAuth()

const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

const newDescription = ref('')
const newImage = ref<File | null>(null)
const isSubmitting = ref(false)


const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    newImage.value = target.files[0]
  }
}

const createPost = async () => {
  if (!newDescription.value.trim()) {
    alert("Veuillez entrer une description.")
    return
  }

  isSubmitting.value = true

  const formData = new FormData()
  formData.append('description', newDescription.value)
  
  if (newImage.value) {
    formData.append('image', newImage.value)
  }

  try {
    await $fetch(`${apiUrl}/api/user/posts`, {
      method: 'POST',
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: formData
    })

    newDescription.value = ''
    newImage.value = null
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ''

    await fetchUserPosts()
    
    alert("Post publié avec succès !")

  } catch (error: any) {
    console.error("Erreur lors de la création :", error.response?._data || error)
    
    const msg = error.response?._data?.message || "Erreur lors de la création."
    alert(`Erreur : ${msg}`)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await fetchUserPosts()
})
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <header class="mb-6 flex justify-between items-baseline">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Mes publications</h1>
        <NuxtLink to="/posts" class="text-blue-500 hover:underline text-sm font-medium">
        Retour au fil d'actualité
        </NuxtLink>
      </div>
    </header>

    <section class="mb-10 p-6 border rounded-xl bg-white shadow-sm border-gray-200">
      <h2 class="text-lg font-bold mb-4 text-gray-700">Créer un nouveau post</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
          <br>
          <textarea 
            v-model="newDescription" 
            class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50" 
            rows="3" 
            placeholder="Quoi de neuf aujourd'hui ?">
          </textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Photo</label>
          <br>
          <input 
            type="file" 
            @change="onFileSelected" 
            accept="image/*" 
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          >
        </div>
        <br>

        <button 
          @click="createPost" 
          :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
        >
          <span v-if="isSubmitting" class="inline-block animate-pulse">Envoi en cours...</span>
          <span v-else>Publier le post</span>
        </button>
      </div>
    </section>
    <br>
    <br>

    <div class="flex items-center mb-6">
      <div class="flex-grow border-t border-gray-200"></div>
      <span class="mx-4 text-gray-400 text-sm font-medium uppercase tracking-widest">Vos posts</span>
      <div class="flex-grow border-t border-gray-200"></div>
    </div>

    <div v-if="posts && posts.length > 0" class="space-y-6">
      <CardPost v-for="p in posts" :key="p.id" :post="p" />
    </div>
    
    <div v-else class="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <p class="text-gray-400">Vous n'avez pas encore publié de contenu.</p>
    </div>
  </div>
</template>
