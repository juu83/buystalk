<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePosts } from '~/composables/usePosts'

// 1. On définit la structure pour que TypeScript comprenne
interface Notification {
  id: number
  type: 'like' | 'comment'
  read_at: string | null
  created_at: string
  fromUser: {
    firstname: string
    lastname: string
    avatar: string | null
  }
}

const { getNotifications, markNotificationAsRead } = usePosts()

// 2. On précise le type ici : ref<Notification[]>
const notifications = ref<Notification[]>([])
const loading = ref(true)

const loadNotifications = async () => {
  try {
    loading.value = true
    const data = await getNotifications()
    // On s'assure de bien recevoir un tableau
    notifications.value = (Array.isArray(data) ? data : []) as Notification[]
  } catch (error) {
    console.error('Failed to load notifications:', error)
  } finally {
    loading.value = false
  }
}

const markAsRead = async (id: number) => {
  try {
    // TypeScript sait maintenant que 'n' possède 'id' et 'read_at'
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read_at) {
      notification.read_at = new Date().toISOString()
      await markNotificationAsRead(id)
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

const markAllAsRead = async () => {
  const unread = notifications.value.filter(n => !n.read_at)
  await Promise.all(unread.map(n => markAsRead(n.id)))
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

  if (diffInMs < 60000) return "À l'instant"
  if (diffInHours < 24) return `Il y a ${diffInHours}h`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

onMounted(() => {
  loadNotifications()
})
</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-md mx-auto bg-white min-h-screen">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h1 class="text-xl font-semibold">Notifications</h1>
        <button v-if="notifications.length > 0" 
                @click="markAllAsRead"
                class="text-blue-500 text-sm font-medium hover:underline">
          Tout marquer comme lu
        </button>
      </div>

      <!-- Notifications List -->
      <div class="divide-y">
        <div v-for="notification in notifications"
             :key="notification.id"
             @click="markAsRead(notification.id)"
             class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
             :class="{ 'bg-blue-50': !notification.read_at }">

          <!-- Sécurité : on vérifie que fromUser existe avant d'accéder à ses propriétés -->
          <div v-if="notification.fromUser" class="flex items-start space-x-3">
            <img :src="notification.fromUser.avatar || '/default-avatar.png'"
                 :alt="notification.fromUser.firstname"
                 class="w-10 h-10 rounded-full object-cover border">

            <div class="flex-1">
              <p class="text-sm text-gray-900">
                <span class="font-bold">
                  {{ notification.fromUser.firstname }} {{ notification.fromUser.lastname }}
                </span>
                <span v-if="notification.type === 'like'" class="text-gray-600">
                  a aimé votre publication
                </span>
                <span v-else-if="notification.type === 'comment'" class="text-gray-600">
                  a commenté votre publication
                </span>
              </p>

              <p class="text-xs text-gray-500 mt-1">
                {{ formatDate(notification.created_at) }}
              </p>
            </div>

            <!-- Indicateur de non-lu -->
            <div v-if="!notification.read_at"
                 class="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5"></div>
          </div>
        </div>

        <!-- État vide -->
        <div v-if="notifications.length === 0 && !loading"
             class="p-12 text-center">
          <div class="text-gray-400 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p class="text-gray-500">Aucune notification pour le moment</p>
        </div>
      </div>
    </div>
  </div>
</template>