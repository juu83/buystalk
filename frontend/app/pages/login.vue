<script setup lang="ts">
const { login } = useAuth()


const email = ref('')
const password = ref('')
const message = ref('')


const handleLogin = async () => {
  const success = await login(email.value, password.value)


  if (success) {
    message.value = 'Connexion réussie !'
    navigateTo('/')
  } else {
    message.value = 'Email ou mot de passe incorrect'
  }
}
</script>


<template>
  <div class="flex items-center justify-center min-h-[80vh]">
    <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
      <h1 class="text-3xl font-extrabold text-center text-gray-800 mb-8">Bon retour 👋</h1>
      
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Adresse Email</label>
          <input v-model="email" type="email" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="jean@exemple.com" required />
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
          <input v-model="password" type="password" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="••••••••" required />
        </div>
        
        <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 mt-4">
          Se connecter
        </button>
      </form>
      
      <div v-if="message" class="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium border border-red-100">
        {{ message }}
      </div>
    </div>
  </div>
</template>