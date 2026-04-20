<script setup lang="ts">
const { ads, loading, fetchUserAds, createAd } = useAds()
const { token } = useAuth()

const newTitle = ref('')
const newDescription = ref('')
const newCity = ref('')
const newImage = ref<File | null>(null)
const isSubmitting = ref(false)

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) newImage.value = target.files[0]
}
const handleCreate = async () => {
  isSubmitting.value = true
  
  const success = await createAd({
    title: newTitle.value,
    description: newDescription.value,
    city: newCity.value,
    image: newImage.value
  })

  if (success) {
    newTitle.value = ''
    newDescription.value = ''
    newCity.value = ''
    newImage.value = null
    alert("Annonce publiée !")
  }
  
  isSubmitting.value = false
  catch (error) {
        console.error("Détail de l'erreur création :", error) 
        return false
    }
}

onMounted(() => fetchUserAds())
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Mes petites annonces</h1>
      <NuxtLink to="/ads" class="text-blue-500 hover:underline text-sm font-medium">
        Retour aux annonces à proximité
      </NuxtLink>
    </header>

    <section class="mb-10 p-6 border rounded-xl bg-white shadow-sm border-gray-200">
      <h2 class="text-lg font-bold mb-4 text-gray-700">Publier une nouvelle annonce</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Titre de l'annonce</label>
          <input 
            v-model="newTitle" 
            type="text"
            class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
            placeholder="Ex: Super promo sur les vélos"
          >
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
          <textarea 
            v-model="newDescription" 
            class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50" 
            rows="3" 
            placeholder="Détails de votre offre...">
          </textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Photo</label>
          <input 
            type="file" 
            @change="onFileSelected" 
            accept="image/*" 
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          >
        </div>

        <button 
          @click="handleCreate" 
          :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-gray-400 flex justify-center items-center"
        >
          <span v-if="isSubmitting">Envoi en cours...</span>
          <span v-else>Créer l'annonce</span>
        </button>
      </div>
    </section>

    <div class="flex items-center mb-6">
      <div class="flex-grow border-t border-gray-200"></div>
      <span class="mx-4 text-gray-400 text-sm font-medium uppercase tracking-widest">Vos annonces</span>
      <div class="flex-grow border-t border-gray-200"></div>
    </div>

    <div v-if="ads && ads.length > 0" class="space-y-6">
      <CardAd v-for="a in ads" :key="a.id" :ad="a" />
    </div>
    
    <div v-else class="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <p class="text-gray-400">Aucune annonce publiée pour le moment.</p>
    </div>
  </div>
</template>