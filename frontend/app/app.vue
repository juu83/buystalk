<script setup>
const { token, fetchUser } = useAuth()

onMounted(async () => {
  if (token.value) {
    await fetchUser()
  } else {
    navigateTo('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex justify-center">
    
    <div class="w-full max-w-md bg-white min-h-screen shadow-2xl border-x border-gray-200">
      
      <header class="sticky top-0 bg-white/80 backdrop-blur-md border-b p-4 z-50 flex justify-between items-center">
        <h1 class="font-black text-blue-600 text-xl tracking-tighter">BuyStalk</h1>
        <NuxtLink v-if="token" to="/account" class="text-xs font-bold uppercase text-gray-400">Compte</NuxtLink>
      </header>

      <main class="p-4">
        <NuxtPage />
      </main>

    </div>
  </div>
</template>