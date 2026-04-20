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
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Publier une annonce</h1>

    <form @submit.prevent="submitAd" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Titre de l'annonce</label>
        <input v-model="form.title" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" required />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
        <textarea v-model="form.description" rows="3" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" required></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Ville</label>
          <input v-model="form.city" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Toulon" required />
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Position GPS</label>
          <button @click="getLocation" type="button" class="w-full bg-indigo-50 text-indigo-600 font-bold py-2 px-4 rounded-xl hover:bg-indigo-100 transition">
            Me localiser
          </button>
          <p class="text-xs text-gray-500 mt-1 text-center">{{ gpsStatus }}</p>
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Photo (optionnelle)</label>
        <input type="file" @change="uploadImage" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      <button type="submit" :disabled="isSubmitting" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition mt-4">
        {{ isSubmitting ? 'Publication en cours...' : 'Publier l\'annonce' }}
      </button>
      
    </form>
  </div>
</template>