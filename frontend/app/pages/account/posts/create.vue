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
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Créer une publication</h1>

    <p class="mb-6">
      <NuxtLink to="/account/posts" class="text-blue-500 hover:text-blue-700 font-medium">
        &larr; Annuler
      </NuxtLink>
    </p>

    <form @submit.prevent="submitPost" class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2">Exprimez-vous :</label>
        <textarea 
          v-model="form.description" 
          rows="4" 
          class="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Que voulez-vous partager ?"
        ></textarea>
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 font-bold mb-2">Ajouter une photo (optionnel) :</label>
        
        <div v-if="imagePreview" class="mb-4 relative">
          <img :src="imagePreview" alt="Aperçu" class="rounded-lg max-h-64 object-cover w-full">
          <button 
            @click="imagePreview = null; imageBlob = null" 
            type="button" 
            class="absolute top-2 right-2 bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-red-600"
          >
            X
          </button>
        </div>

        <div v-if="!imagePreview">
          <div v-if="APP_ENV !== 'mobile'">
            <input type="file" @change="uploadImageWeb" accept="image/*" class="w-full text-gray-700" />
          </div>
          <div v-else>
            <button @click="takePicture" type="button" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full font-medium">
              📸 Prendre une photo
            </button>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        :disabled="isSubmitting"
        class="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 w-full"
      >
        {{ isSubmitting ? 'Publication en cours...' : 'Publier' }}
      </button>
      
    </form>
  </div>
</template>