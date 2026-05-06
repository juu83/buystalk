<script setup>
import { getApiUrl } from '~/composables/useApiUrl'
const apiUrl = getApiUrl()
const { user, token, fetchUser } = useAuth()

// FORMULAIRE PROFIL
const form = reactive({ firstname: '', lastname: '', email: '' })

onMounted(() => {
  if (user.value) {
    form.firstname = user.value.firstname
    form.lastname = user.value.lastname
    form.email = user.value.email
  }
})

const updateProfile = async () => {
  await fetch(`${apiUrl}/api/user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.value}` },
    body: JSON.stringify(form)
  })
  await fetchUser()
  alert('Profil mis à jour !')
}

// FORMULAIRE PASSWORD
const passwordForm = reactive({ current_password: '', password: '', password_confirmation: '' })

const updatePassword = async () => {
  const res = await fetch(`${apiUrl}/api/user/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.value}` },
    body: JSON.stringify(passwordForm)
  })
  if (res.ok) {
    alert('Mot de passe modifié avec succès !')
    passwordForm.current_password = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
  }
}

// AVATAR
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

const uploadAvatar = async (event) => {
  const file = event.target.files[0]
  const formData = new FormData()
  formData.append('avatar', file)
  await fetch(`${apiUrl}/api/user/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.value}` },
    body: formData
  })
  await fetchUser()
}

const takePicture = async () => {
  const photo = await Camera.getPhoto({
    quality: 80, allowEditing: false, resultType: CameraResultType.DataUrl, source: CameraSource.Camera
  })
  const blob = await (await fetch(photo.dataUrl)).blob()
  const formData = new FormData()
  formData.append('avatar', blob, 'avatar.jpg')
  await fetch(`${apiUrl}/api/user/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.value}` },
    body: formData
  })
  await fetchUser()
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 space-y-8">
    
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-extrabold text-gray-800">Mon Compte</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- COLONNE GAUCHE : Profil & Navigation rapide -->
      <div class="md:col-span-1 space-y-6">
        <section class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div class="relative w-32 h-32 mb-4">
            <img v-if="user?.avatar" :src="user.avatar && (user.avatar.startsWith('http') ? user.avatar : `${apiUrl}/storage/${user.avatar}`)" alt="Avatar" class="w-full h-full rounded-full object-cover border-4 border-blue-50 shadow-md"/>
            <div v-else class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl font-bold">
              {{ user?.firstname?.charAt(0) || '?' }}
            </div>
          </div>
          
          <h2 class="text-xl font-bold text-gray-800 mb-1">{{ user?.firstname }} {{ user?.lastname }}</h2>
          <p class="text-gray-500 text-sm mb-6">{{ user?.email }}</p>

          <div v-if="APP_ENV !== 'mobile'" class="w-full">
            <label class="cursor-pointer bg-blue-50 text-blue-600 font-medium py-2 px-4 rounded-xl hover:bg-blue-100 transition block w-full text-center">
              Changer d'avatar
              <input type="file" @change="uploadAvatar" class="hidden" accept="image/*" />
            </label>
          </div>
          <button v-else @click="takePicture" class="bg-blue-50 text-blue-600 font-medium py-2 px-4 rounded-xl hover:bg-blue-100 transition w-full">
            Prendre une photo
          </button>
        </section>

        <NuxtLink to="/account/posts" class="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100 flex flex-col items-center text-center group">
          <div class="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-3 transition text-xl group-hover:scale-110 shadow-inner"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
        </div>
          <h2 class="text-lg font-bold text-gray-800">Mes publications</h2>
          <p class="text-gray-500 text-sm mt-1 leading-tight">Gère tes anciens posts et tes annonces.</p>
        </NuxtLink>
      </div>

      <!-- COLONNE DROITE : Formulaires -->
      <div class="md:col-span-2 space-y-6">
        
        <section class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">Informations</h2>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Prénom</label>
                <input v-model="form.firstname" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                <input v-model="form.lastname" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input v-model="form.email" type="email" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition" />
            </div>
            <div class="flex justify-end pt-2">
              <button type="submit" class="bg-blue-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-blue-700 transition shadow-md">Enregistrer</button>
            </div>
          </form>
        </section>

        <section class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">Sécurité</h2>
          <form @submit.prevent="updatePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe actuel</label>
              <input v-model="passwordForm.current_password" type="password" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Nouveau</label>
                <input v-model="passwordForm.password" type="password" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Confirmer</label>
                <input v-model="passwordForm.password_confirmation" type="password" class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition" />
              </div>
            </div>
            <div class="flex justify-end pt-2">
              <button type="submit" class="bg-gray-800 text-white font-bold py-2 px-6 rounded-xl hover:bg-gray-900 transition shadow-md">Modifier le mot de passe</button>
            </div>
          </form>
        </section>

      </div>
    </div>
  </div>
</template>