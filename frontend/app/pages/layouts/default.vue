<template>
  <div class="min-h-screen bg-gray-50 flex justify-center">
    <div class="w-full max-w-6xl flex flex-col md:flex-row">
      
      <aside class="w-full md:w-64 md:h-screen md:sticky md:top-0 p-4 border-r border-gray-200 bg-white">
        <div class="mb-8 px-2">
          <h1 class="text-2xl font-bold text-blue-600">SocialApp</h1>
        </div>
        
        <nav class="space-y-2">
          <NuxtLink to="/posts" class="flex items-center p-3 rounded-xl hover:bg-gray-100 transition" active-class="bg-blue-50 text-blue-600 font-bold">
            <span class="mr-3">🏠</span> Fil d'actualité
          </NuxtLink>
          <NuxtLink to="/account/posts" class="flex items-center p-3 rounded-xl hover:bg-gray-100 transition" active-class="bg-blue-50 text-blue-600 font-bold">
            <span class="mr-3">📄</span> Mes Posts
          </NuxtLink>
          <NuxtLink to="/account" class="flex items-center p-3 rounded-xl hover:bg-gray-100 transition" active-class="bg-blue-50 text-blue-600 font-bold">
            <span class="mr-3">👤</span> Mon Compte
          </NuxtLink>
        </nav>

        <div class="mt-10 pt-6 border-t px-2">
          <button @click="logout()" class="text-red-500 hover:font-bold transition">
            Déconnexion
          </button>
        </div>
      </aside>

      <main class="flex-1 p-4 md:p-8 max-w-2xl mx-auto w-full">
        <slot /> </main>

    </div>
  </div>
</template>

<script setup>
const { logout } = useAuth()
</script>