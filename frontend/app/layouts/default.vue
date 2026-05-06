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
  <!-- Conteneur principal en Flexbox pour pousser le footer en bas -->
  <div class="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
    
    <!-- Navbar Bleu Marine -->
    <nav class="bg-blue-900 shadow-lg sticky top-0 z-50 border-b border-blue-800">
      <div class="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        
        <!-- Logo avec animation au survol -->
        <NuxtLink to="/posts" class="flex items-center gap-3 group">
          <div class="bg-gradient-to-tr from-blue-400 to-indigo-500 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
            S
          </div>
          <span class="font-extrabold text-base md:text-xl text-white tracking-tight">BuyStalk</span>
        </NuxtLink>

        <!-- Liens Desktop avec soulignement animé -->
        <ul class="hidden md:flex items-center gap-6 font-medium text-blue-100 text-sm md:text-base">
          <li v-for="link in [
            { name: 'Fil', to: '/posts' },
            { name: 'Annonces', to: '/ads' },
            { name: 'Carte', to: '/map' },
            { name: 'Compte', to: '/account' }
          ]" :key="link.to">
            <NuxtLink :to="link.to" class="relative py-1 transition-colors duration-300 hover:text-white group">
              {{ link.name }}
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </NuxtLink>
          </li>
          
          <li v-if="!user">
            <NuxtLink to="/login" class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full transition-all duration-300 hover:shadow-lg active:scale-95 font-semibold">
              Se connecter
            </NuxtLink>
          </li>
          <li v-else>
            <button @click="logout()" class="text-red-300 hover:text-red-400 transition-colors duration-300 font-medium">
              Se déconnecter
            </button>
          </li>
        </ul>

        <!-- Menu Mobile : Bouton Hamburger uniquement -->
        <div class="md:hidden">
          <button @click="isOpen = !isOpen" aria-label="Menu" class="p-2 rounded-md hover:bg-blue-800 text-white transition-all duration-300 active:scale-90">
            <div class="relative w-6 h-6">
              <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute inset-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute inset-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Animation du Dropdown Mobile -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-if="isOpen" class="md:hidden border-t border-blue-800 bg-blue-900">
          <div class="max-w-3xl mx-auto px-4 py-3 pb-6">
            <ul class="bg-blue-800 text-white rounded-2xl shadow-2xl overflow-hidden divide-y divide-blue-700/50 border border-blue-700">
              
              <!-- Items avec animation de glissement au survol -->
              <li v-for="item in [
                { name: 'Fil d\'actualité', to: '/posts' },
                { name: 'Petites Annonces', to: '/ads' },
                { name: 'Carte interactive', to: '/map' },
                { name: 'Mon compte', to: '/account' }
              ]" :key="item.to">
                <NuxtLink 
                  @click="isOpen = false" 
                  :to="item.to" 
                  class="block px-6 py-4 hover:bg-blue-700 hover:pl-9 transition-all duration-300 ease-in-out group"
                >
                  <span class="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    {{ item.name }}
                  </span>
                </NuxtLink>
              </li>

              <!-- Actions Auth -->
              <li v-if="!user">
                <NuxtLink 
                  @click="isOpen = false" 
                  to="/login" 
                  class="block px-4 py-4 bg-blue-600 hover:bg-blue-500 text-center font-bold transition-all duration-300 active:brightness-90"
                >
                  Se connecter
                </NuxtLink>
              </li>
              <li v-else>
                <button 
                  @click="closeAndLogout" 
                  class="w-full text-left px-6 py-4 hover:bg-red-900/40 text-red-300 hover:text-red-200 hover:pl-9 transition-all duration-300 ease-in-out group"
                >
                  <span class="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    Se déconnecter
                  </span>
                </button>
              </li>
              
            </ul>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Contenu principal -->
    <main class="flex-grow w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <slot />
    </main>

    <!-- Footer Bleu Marine -->
    <footer class="bg-blue-900 text-blue-200 border-t border-blue-800">
      <div class="max-w-3xl mx-auto px-4 py-10 text-center">
        <div class="flex justify-center gap-3 mb-4">
           <div class="bg-blue-800 p-2 rounded-lg text-white font-bold text-xs">BuyStalk</div>
        </div>
        <p class="text-sm opacity-70">&copy; 2026 BuyStalk. Tous droits réservés.</p>
        <div class="flex justify-center gap-6 mt-6 text-xs font-medium">
          <NuxtLink to="/terms" class="hover:text-white transition-colors duration-300">Conditions</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-white transition-colors duration-300">Confidentialité</NuxtLink>
          <a href="#" class="hover:text-white transition-colors duration-300">Contact</a>
        </div>
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