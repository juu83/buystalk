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
  <div class="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
    
    <nav class="bg-blue-900 shadow-lg sticky top-0 z-50 border-b border-blue-800">
      <div class="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        
        <NuxtLink to="/posts" class="flex items-center gap-4 group">
          <div class="bg-gradient-to-tr from-blue-400 to-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110 shadow-lg overflow-hidden border-2 border-white/20">
            <img class="w-full h-full object-cover" src="../assets/images/logo-BuyStalk - caddie.jpg" alt="logo Buystalk" />
          </div>
          <span class="font-black text-xl md:text-2xl text-white tracking-tighter italic">BuyStalk</span>
        </NuxtLink>

        <ul class="hidden md:flex items-center gap-12 font-semibold text-blue-100 text-base">
          <li v-for="link in [
            { name: 'Accueil', to: '/' },
            { name: 'Posts', to: '/posts' },
            { name: 'Annonces', to: '/ads' },
            { name: 'Carte', to: '/map' },
            { name: 'Mon compte', to: '/account' }
          ]" :key="link.to">
            <NuxtLink :to="link.to" class="relative py-1 transition-colors duration-300 hover:text-white group">
              {{ link.name }}
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </NuxtLink>
          </li>
          
          <li v-if="!user">
            <NuxtLink to="/login" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-blue-500/20 active:scale-95 font-bold">
              Se connecter
            </NuxtLink>
          </li>
        </ul>

        <!-- Menu Mobile -->
        <div class="md:hidden">
          <button @click="isOpen = !isOpen" class="p-2 text-white">
            <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <main class="flex-1 flex flex-col w-full">
      <slot />
    </main>


    <footer class="bg-blue-900 text-blue-200 border-t border-blue-800 w-full">
      <div class="max-w-7xl mx-auto px-6 py-8 text-center">
        <p class="text-sm font-medium opacity-60 italic">&copy; 2026 Julie DOUBRE. Tous droits réservés.</p>
      </div>
    </footer>

  </div>
</template>

<style scoped>
.min-h-screen {
  transition: background-color 0.3s ease;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #1e3a8a;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #1e40af;
}
</style>