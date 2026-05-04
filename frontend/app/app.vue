<script setup>
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth'
import { navigateTo } from '#imports'

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
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>