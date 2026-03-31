<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const { login } = useAuth()
const email = ref('')
const password = ref('')
const message = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  const success = await login(email.value, password.value)
  isLoading.value = false

  if (success) {
    navigateTo('/posts')
  } else {
    message.value = 'Email ou mot de passe incorrect'
  }
}
</script>

<template>
  <div class="py-10">
    <h1 class="text-3xl font-black text-center mb-8">Connexion</h1>
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
      <input v-model="email" type="email" placeholder="Email" class="p-4 border rounded-2xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
      <input v-model="password" type="password" placeholder="Mot de passe" class="p-4 border rounded-2xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" />

    <button 
      type="submit" 
      :disabled="isLoading"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:bg-gray-400"
    >
      <span v-if="!isLoading">Se connecter</span>
      <span v-else class="animate-pulse">Connexion...</span>
    </button>

    <p v-if="message" class="text-red-500 text-center text-sm font-medium animate-bounce">
      {{ message }}
    </p>
  </form>
  </div>
</template>