<script setup>
import { ensurePermissions, getCurrentPosition } from '~/utils/geolocation'

definePageMeta({ middleware: ['auth'] })
const { createAd } = useAds()

const form = reactive({ title: '', description: '', city: '', lat: null, lng: null })
const isSubmitting = ref(false)
const imageBlob = ref(null)
const gpsStatus = ref('Non localisé')

const uploadImage = (event) => {
  imageBlob.value = event.target.files[0]
}

const getLocation = async () => {
  gpsStatus.value = 'Demande au GPS...'
  try {
    await ensurePermissions()
    const position = await getCurrentPosition({ enableHighAccuracy: true, timeout: 20000 })
    form.lat = position.coords.latitude
    form.lng = position.coords.longitude
    gpsStatus.value = `OK (${form.lat.toFixed(4)}, ${form.lng.toFixed(4)})`
  } catch (error) {
    console.error("Erreur GPS détaillée :", error)
    gpsStatus.value = 'Erreur de localisation'
    alert('Position indisponible. Vérifiez les réglages de l\'émulateur ou les autorisations de l\'application (Paramètres -> Applications).')
  }
}

const submitAd = async () => {
  if (!form.title || !form.city || !form.lat || !form.lng) {
    return alert('Veuillez remplir tous les champs texte ET vous géolocaliser.')
  }
  
  isSubmitting.value = true
  const formData = new FormData()
  formData.append('title', form.title)
  formData.append('description', form.description)
  formData.append('city', form.city)
  formData.append('lat', form.lat)
  formData.append('lng', form.lng)
  
  if (imageBlob.value) {
    formData.append('image', imageBlob.value, 'ad_image.jpg')
  }

  try {
    await createAd(formData)
    alert('Annonce publiée !')
    navigateTo('/ads')
  } catch (error) {
    alert('Erreur lors de la publication.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6 text-blue-900">Publier une annonce</h1>

    <p class="mb-6">
      <NuxtLink to="/account/posts" class="text-gray-700 hover:text-blue-700 font-medium">
        &larr; Annuler
      </NuxtLink>
    </p>

    <form @submit.prevent="submitAd" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      
      <div>
        <label class="block text-sm font-semibold text-blue-900 mb-1">Titre de l'annonce</label>
        <input v-model="form.title" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" required />
      </div>

      <div>
        <label class="block text-sm font-semibold text-blue-900 mb-1">Description</label>
        <textarea v-model="form.description" rows="3" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" required></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-blue-900 mb-1">Ville</label>
          <input v-model="form.city" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Toulon" required />
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-blue-900 mb-1">Position GPS</label>
          <button @click="getLocation" type="button" class="w-full bg-indigo-50 text-indigo-600 font-bold py-2 px-4 rounded-xl hover:bg-indigo-100 transition">
            Me localiser
          </button>
          <p class="text-xs text-gray-500 mt-1 text-center">{{ gpsStatus }}</p>
        </div>
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

      <button type="submit" :disabled="isSubmitting" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition mt-4">
        {{ isSubmitting ? 'Publication en cours...' : 'Publier l\'annonce' }}
      </button>
      
    </form>
  </div>
</template>