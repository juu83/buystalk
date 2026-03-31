<script setup>
if (process.client) {
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <p class="text-center text-gray-500">Redirection vers la page de connexion...</p>
  </div>
</template>
