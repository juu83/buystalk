<script setup>
import { ref } from 'vue'
const { user, logout } = useAuth()
const isOpen = ref(false)
const closeAndLogout = () => {
  isOpen.value = false
  logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
    <nav class="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
      <div class="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">

        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold">.✦ ݁˖</div>
          <span class="font-extrabold text-base md:text-xl text-blue-600 tracking-tight">BuyStalk</span>
        </NuxtLink>

        <ul class="hidden md:flex items-center gap-4 font-medium text-gray-600 text-sm md:text-base">
          <li><NuxtLink to="/posts" class="hover:text-blue-600 transition px-2 py-1">Fil</NuxtLink></li>
          
          <li><NuxtLink to="/ads" class="hover:text-blue-600 transition">Annonces</NuxtLink></li>
          
          <li v-if="user"><NuxtLink to="/account/posts" class="hover:text-blue-600 transition px-2 py-1">Mes Publications</NuxtLink></li>
          <li><NuxtLink to="/account" class="hover:text-blue-600 transition px-2 py-1">Compte</NuxtLink></li>
          <li><NuxtLink to="/account/posts/create" class="bg-blue-600 text-white px-3 py-2 rounded-full shadow-sm hover:bg-blue-700 transition flex items-center gap-2"><span class="text-lg leading-none">+</span></NuxtLink></li>
          <li>
            <NuxtLink v-if="!user" to="/login" class="text-blue-600 hover:text-blue-800 px-2 py-1">Se connecter</NuxtLink>
            <button v-else @click="logout()" class="text-gray-600 hover:text-red-600 px-2 py-1">Se déconnecter</button>
          </li>
        </ul>

        <div class="flex items-center gap-1 md:hidden">
          <ul class="flex items-center gap-1">
            <li><NuxtLink to="/posts" aria-label="Fil" class="p-2 rounded-md hover:bg-gray-100">🌍</NuxtLink></li>
            
            <li><NuxtLink to="/ads" aria-label="Annonces" class="p-2 rounded-md hover:bg-gray-100">📢</NuxtLink></li>
            
            <li v-if="user"><NuxtLink to="/account/posts" aria-label="Mes" class="p-2 rounded-md hover:bg-gray-100">📝</NuxtLink></li>
            <li><NuxtLink to="/account" aria-label="Compte" class="p-2 rounded-md hover:bg-gray-100">👤</NuxtLink></li>
            <li><NuxtLink to="/account/posts/create" aria-label="Créer" class="p-2 bg-blue-600 text-white rounded-full">+</NuxtLink></li>
            <li v-if="!user"><NuxtLink to="/login" aria-label="Login" class="p-2 rounded-md hover:bg-gray-100">🔐</NuxtLink></li>
            <li v-else><button @click="logout()" aria-label="Logout" class="p-2 rounded-md hover:bg-gray-100">⎋</button></li>
          </ul>

          <button @click="isOpen = !isOpen" aria-label="Menu" class="ml-2 p-2 rounded-md hover:bg-gray-100">
            <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

      </div>

      <div v-if="isOpen" class="md:hidden">
        <div class="max-w-3xl mx-auto px-4 py-2">
          <ul class="bg-white rounded-md shadow-sm divide-y">
            <li><NuxtLink @click="isOpen = false" to="/posts" class="block px-4 py-3 hover:bg-gray-50">Fil d'actualité</NuxtLink></li>
            
            <li><NuxtLink @click="isOpen = false" to="/ads" class="block px-4 py-3 hover:bg-gray-50 text-blue-600 font-medium">Petites Annonces</NuxtLink></li>
            
            <li v-if="user"><NuxtLink @click="isOpen = false" to="/account/posts" class="block px-4 py-3 hover:bg-gray-50">Mes publications</NuxtLink></li>
            <li><NuxtLink @click="isOpen = false" to="/account" class="block px-4 py-3 hover:bg-gray-50">Mon compte</NuxtLink></li>
            <li><NuxtLink @click="isOpen = false" to="/account/posts/create" class="block px-4 py-3 hover:bg-gray-50">Créer une publication</NuxtLink></li>
            <li v-if="!user"><NuxtLink @click="isOpen = false" to="/login" class="block px-4 py-3 hover:bg-gray-50">Se connecter</NuxtLink></li>
            <li v-else><button @click="closeAndLogout" class="w-full text-left px-4 py-3 hover:bg-gray-50">Se déconnecter</button></li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <slot />
    </main>
  </div>
</template>