<script setup>
const { user, logout } = useAuth()
const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL
</script>

<template>
  <div class="space-y-6 mt-2">

    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold mb-1">Bienvenue {{ user?.firstname }} !</h1>
        <p class="text-blue-100 text-sm">Partage tes meilleures ondes aujourd'hui.</p>
      </div>
      <div v-if="user?.avatar" class="hidden sm:block">
        <img :src="user.avatar && (user.avatar.startsWith('http') ? user.avatar : `${apiUrl}/storage/${user.avatar}`)" class="w-20 h-20 rounded-full border-2 border-white shadow-sm object-cover" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink to="/posts" class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col items-center text-center group">
        <div class="bg-blue-50 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-3 transition text-xl">🌍</div>
        <h2 class="text-lg font-semibold text-gray-800">Fil d'actualité</h2>
        <p class="text-gray-500 text-sm mt-1">Découvre ce que les autres ont publié.</p>
      </NuxtLink>

      <NuxtLink to="/account/posts" class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col items-center text-center group">
        <div class="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-3 transition text-xl">📝</div>
        <h2 class="text-lg font-semibold text-gray-800">Mes publications</h2>
        <p class="text-gray-500 text-sm mt-1">Gère tes anciens posts.</p>
      </NuxtLink>

      <NuxtLink to="/map" class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col items-center text-center group">
        <div class="bg-green-50 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-3 transition text-xl">🗺️</div>
        <h2 class="text-lg font-semibold text-gray-800">Carte</h2>
        <p class="text-gray-500 text-sm mt-1">Ouvre une carte Google Maps interactive.</p>
      </NuxtLink>
    </div>

    <div class="text-center mt-6">
      <button @click="logout()" class="text-gray-500 hover:text-red-500 font-medium transition underline">
        Se déconnecter
      </button>
    </div>
  </div>
</template>