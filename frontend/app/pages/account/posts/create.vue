<script setup>
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

definePageMeta({ middleware: ['auth'] })

const { createPost } = usePosts()
const { public: { APP_ENV } } = useRuntimeConfig()

const form = reactive({ description: '' })
const isSubmitting = ref(false)

const imageBlob = ref(null)
const imagePreview = ref(null)

const takePicture = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    })
    
    imageBlob.value = await (await fetch(photo.dataUrl)).blob()
    imagePreview.value = photo.dataUrl // On stocke l'URL pour afficher l'aperçu
  } catch (error) {
    console.error('Erreur appareil photo', error)
  }
}

const uploadImageWeb = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  imageBlob.value = file
  imagePreview.value = URL.createObjectURL(file) 
}

const submitPost = async () => {
  if (!form.description) return alert('La description est obligatoire')
  
  isSubmitting.value = true
  
  const formData = new FormData()
  formData.append('description', form.description)
  
  // Si une image a été sélectionnée, on l'ajoute !
  if (imageBlob.value) {
    formData.append('image', imageBlob.value, 'post_image.jpg')
  }

  try {
    await createPost(formData) // Envoie le FormData au backend Laravel
    alert('Post publié avec succès !')
    navigateTo('/account/posts')
  } catch (error) {
    alert('Erreur lors de la publication')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6 text-blue-900">Créer une publication</h1>

    <p class="mb-6">
      <NuxtLink to="/account/posts" class="text-gray-700 hover:text-blue-700 font-medium">
        &larr; Annuler
      </NuxtLink>
    </p>

    <form @submit.prevent="submitPost" class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      
      <div class="mb-4">
        <label class="block text-blue-900 font-bold mb-2">Exprimez-vous :</label>
        <textarea 
          v-model="form.description" 
          rows="4" 
          class="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Que voulez-vous partager ?"
        ></textarea>
      </div>

      <div class="mb-8">
    <!-- ÉTAT : IMAGE DÉJÀ SÉLECTIONNÉE (PREVIEW) -->
    <div v-if="imagePreview" class="group relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 aspect-video">
      <img :src="imagePreview" alt="Aperçu" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
      
      <!-- Overlay de suppression au survol -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
        <button 
          @click="imagePreview = null; imageBlob = null" 
          type="button" 
          class="bg-red-500 text-white rounded-2xl px-6 py-3 font-black flex items-center gap-2 hover:bg-red-600 transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Supprimer la photo
        </button>
      </div>
    </div>

    <!-- ÉTAT : AUCUNE IMAGE (ZONE D'UPLOAD) -->
    <div v-if="!imagePreview">
      <!-- VERSION WEB : Zone de clic/drop stylisée -->
      <div v-if="APP_ENV !== 'mobile'" class="relative group">
        <input 
          type="file" 
          @change="uploadImageWeb" 
          accept="image/*" 
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
        />
        <div class="border-4 border-dashed border-white/30 bg-white/10 backdrop-blur-md rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center transition-all group-hover:border-[#4c5cb1]/50 group-hover:bg-white/20">
          <div class="bg-white text-[#4c5cb1] w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p class="text-white font-bold text-lg">Ajouter une photo</p>
          <p class="text-gray-400 text-sm mt-1">Cliquez ou glissez une image ici</p>
        </div>
      </div>

      <!-- VERSION MOBILE : Gros bouton action -->
      <div v-else>
        <button 
          @click="takePicture" 
          type="button" 
          class="bg-white text-[#4c5cb1] font-black py-6 px-4 rounded-[2rem] shadow-xl flex items-center justify-center gap-4 w-full active:scale-95 transition-all"
        >
          <div class="bg-indigo-50 p-3 rounded-xl">
            📸
          </div>
          <span class="text-xl">Prendre une photo</span>
        </button>
      </div>
    </div>
  </div>

      <button 
        type="submit" 
        :disabled="isSubmitting"
        class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 w-full"
      >
        {{ isSubmitting ? 'Publication en cours...' : 'Publier' }}
      </button>
      
    </form>
  </div>
</template>