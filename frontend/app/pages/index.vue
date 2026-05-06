<script setup>
import { getApiUrl } from '~/composables/useApiUrl'

const { user, logout } = useAuth()
const apiUrl = getApiUrl()
</script>

<template>
  <div class="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-10 mt-6">

    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] p-10 text-white shadow-2xl flex items-center justify-between gap-8 border border-white/20">
      <div>
        <h1 class="text-4xl md:text-5xl font-black mb-2 tracking-tight">Bienvenue {{ user?.firstname }} !</h1>
        <p class="text-blue-100 text-xl font-light">Partage tes meilleures ondes aujourd'hui.</p>
      </div>
      <div v-if="user?.avatar" class="hidden md:block">
        <img :src="user.avatar && (user.avatar.startsWith('http') ? user.avatar : `${apiUrl}/storage/${user.avatar}`)" 
             class="w-32 h-32 rounded-3xl border-4 border-white/30 shadow-2xl object-cover rotate-3" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <NuxtLink to="/posts" class="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center text-center group">
        <div class="bg-blue-50 text-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525" />
            </svg>
        </div>
        <h2 class="text-2xl font-black text-gray-800 mb-2">Feed</h2>
        <p class="text-gray-500 text-base leading-relaxed">Découvre ce que les autres ont publié sur le réseau.</p>
      </NuxtLink>

      <NuxtLink to="/ads" class="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center text-center group">
        <div class="bg-orange-50 text-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-orange-500 group-hover:text-white group-hover:rotate-12 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-gray-800 mb-2">Annonces</h2>
        <p class="text-gray-500 text-base leading-relaxed">Trouve les meilleurs deals et opportunités du moment.</p>
      </NuxtLink>

      <NuxtLink to="/map" class="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center text-center group">
        <div class="bg-green-50 text-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-green-600 group-hover:text-white group-hover:rotate-12 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-gray-800 mb-2">Maps</h2>
        <p class="text-gray-500 text-base leading-relaxed">Localise instantanément les annonces près de chez toi.</p>
      </NuxtLink>
    </div>


    <div class="text-center pt-8">
      <button @click="logout()" class="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl hover:bg-red-50 transition-all duration-300">
        <div class="p-2 bg-gray-100 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
        </div>
        <span class="text-gray-600 group-hover:text-red-600 font-bold text-lg">Se déconnecter</span>
      </button>
    </div>
  </div>
</template>