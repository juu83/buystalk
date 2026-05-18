<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { usePosts } from '~/composables/usePosts'
import { navigateTo } from '#imports'

const { user } = useAuth()
const { getNotifications, markNotificationAsRead, startPolling, stopPolling } = usePosts()

const notifications = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchNotifications = async () => {
  loading.value = true
  error.value = ''

  try {
    notifications.value = await getNotifications()
  } catch (e) {
    error.value = 'Impossible de récupérer les notifications.'
    console.error('Erreur notifications:', e)
  } finally {
    loading.value = false
  }
}

const markAsRead = async (notification) => {
  try {
    await markNotificationAsRead(notification.id)
    notification.read_at = new Date().toISOString()
  } catch (e) {
    console.error('Erreur lecture notification:', e)
  }
}

onMounted(async () => {
  if (!user.value) {
    return navigateTo('/login')
  }

  await fetchNotifications()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-black mb-6 text-blue-900">Notifications</h1>

    <div v-if="loading" class="text-blue-900">Chargement des notifications...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <div v-if="notifications.length === 0" class="text-blue-900 italic">
        Vous n'avez aucune notification pour le moment.
      </div>

      <div class="space-y-4">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="border rounded-xl p-4 shadow-sm"
          :class="notification.read_at ? 'bg-white' : 'bg-blue-50 border-blue-200'"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="font-semibold text-blue-900 mb-1">
                {{ notification.fromUser?.firstname || notification.from_user?.firstname ? `${(notification.fromUser || notification.from_user).firstname} ${(notification.fromUser || notification.from_user).lastname}` : 'Utilisateur inconnu' }}
                <span v-if="notification.type === 'like'">a aimé votre publication</span>
                <span v-else> a commenté votre publication</span>
              </p>
              <p class="text-sm text-gray-600">{{ formatDate(notification.created_at) }}</p>
            </div>
            <button
              v-if="!notification.read_at"
              @click="markAsRead(notification)"
              class="text-sm text-blue-600 hover:underline"
            >
              Marquer comme lu
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
