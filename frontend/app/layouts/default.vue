<script setup>
import { ref } from 'vue'

// Ajout de logout dans le destructuring pour qu'il soit accessible
const { user, logout } = useAuth()
const isOpen = ref(false)

const closeAndLogout = () => {
  isOpen.value = false
  logout()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
    
    <!-- NAVBAR -->
    <nav class="bg-blue-900 shadow-lg sticky top-0 z-50 border-b border-blue-800">
      <div class="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        
        <!-- LOGO -->
        <NuxtLink to="/posts" class="flex items-center gap-4 group">
          <div class="bg-gradient-to-tr from-blue-400 to-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110 shadow-lg overflow-hidden border-2 border-white/20">
            <img class="w-full h-full object-cover" src="../assets/images/logo-BuyStalk - caddie.jpg" alt="logo Buystalk" />
          </div>
          <span class="font-black text-xl md:text-2xl text-white tracking-tighter italic">BuyStalk</span>
        </NuxtLink>

        <!-- MENU DESKTOP -->
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
          <li v-else>
            <button @click="logout" class="text-blue-200 hover:text-red-400 transition-colors font-bold">
              Déconnexion
            </button>
          </li>
        </ul>

        <!-- BOUTON BURGER MOBILE -->
        <div class="md:hidden">
          <button @click="isOpen = !isOpen" class="p-2 text-white transition-transform active:scale-90">
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

    <!-- MENU MOBILE DROPDOWN (OVERLAY) -->
    <Transition name="mobile-menu">
      <div v-if="isOpen" class="md:hidden fixed inset-0 z-40">
        <!-- Fond flouté cliquable pour fermer -->
        <div class="absolute inset-0 bg-blue-900/60 backdrop-blur-md" @click="isOpen = false"></div>
        
        <!-- Panneau latéral -->
        <div class="absolute top-0 right-0 w-4/5 h-full bg-blue-950 shadow-2xl border-l border-white/10 p-8 flex flex-col">
          <div class="flex justify-between items-center mb-10">
             <span class="text-white font-black italic text-xl">Menu</span>
             <button @click="isOpen = false" class="text-white/60 hover:text-white text-sm uppercase tracking-widest">Fermer</button>
          </div>

          <nav class="flex flex-col gap-2">
            <NuxtLink 
              v-for="link in [
                { name: 'Accueil', to: '/' },
                { name: 'Posts', to: '/posts' },
                { name: 'Annonces', to: '/ads' },
                { name: 'Carte', to: '/map' },
                { name: 'Mon compte', to: '/account' }
              ]" 
              :key="link.to"
              :to="link.to" 
              @click="isOpen = false"
              class="group flex items-center justify-between py-4 px-6 rounded-2xl text-xl font-bold text-blue-100 transition-all active:bg-blue-400/20 hover:bg-white/10 hover:translate-x-2"
            >
              {{ link.name }}
              <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </NuxtLink>
          </nav>

          <!-- Bouton de déconnexion/connexion en bas -->
          <div class="mt-auto border-t border-white/10 pt-6">
            <button 
              v-if="user" 
              @click="closeAndLogout" 
              class="w-full py-4 px-6 rounded-2xl bg-blue-500/10 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all active:scale-95"
            >
              Se déconnecter
            </button>
            <NuxtLink 
              v-else 
              to="/login" 
              @click="isOpen = false"
              class="w-full py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold text-center block shadow-lg active:scale-95 transition-transform"
            >
              Se connecter
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col w-full">
      <slot />
    </main>

    <!-- FOOTER -->
    <footer class="bg-blue-900 text-blue-200 border-t border-blue-800 w-full">
      <div class="max-w-7xl mx-auto px-6 py-8 text-center">
        <p class="text-sm font-medium opacity-60 italic">&copy; 2026 Julie DOUBRE. Tous droits réservés.</p>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* Transition pour le menu mobile (Slide + Fade) */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from div:last-child,
.mobile-menu-leave-to div:last-child {
  transform: translateX(100%);
}

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