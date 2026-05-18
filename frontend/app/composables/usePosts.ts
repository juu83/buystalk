import { useCookie, useState } from '#imports'
import { useAuth } from './useAuth'
import { getApiUrl } from './useApiUrl'

const posts = useState<any[]>('posts', () => [])
const post = useState<any>('post', () => null)
const notifications = useState<any[]>('notifications', () => [])
const pollingTimer = useState<NodeJS.Timeout | null>('postsPollingTimer', () => null)

export const usePosts = () => {
  const apiUrl = getApiUrl()
  
  const token = useCookie('token')

  const getHeaders = () => ({
    'Accept': 'application/json',
    ...(token.value ? { 'Authorization': `Bearer ${token.value}` } : {})
  })

  const normalizeArrayResponse = (response: any) => {
    if (Array.isArray(response)) return response
    if (response?.data && Array.isArray(response.data)) return response.data
    if (response?.notifications && Array.isArray(response.notifications)) return response.notifications
    if (response?.posts && Array.isArray(response.posts)) return response.posts
    return []
  }

  const fetchPosts = async (userId = null) => {
    try {
      const url = userId ? `${apiUrl}/api/posts?user=${userId}` : `${apiUrl}/api/posts`
      const res = await $fetch<any>(url, { headers: { 'Accept': 'application/json' } })
      const postsResponse = normalizeArrayResponse(res)

      if (!Array.isArray(res) && !Array.isArray(res?.data) && !Array.isArray(res?.posts)) {
        console.warn('fetchPosts received an unexpected response format, keeping previous posts', res)
      } else {
        posts.value = postsResponse
      }
    } catch (err: any) {
      console.error('Erreur lors du fetch des posts:', err)
      if (err?.response?.status === 401) useAuth().logout()
    }
  }

  const fetchPost = async (id: number) => {
    try {
      post.value = await $fetch(`${apiUrl}/api/posts/${id}`, { headers: { 'Accept': 'application/json' } })
    } catch (err: any) {
      if (err?.response?.status === 401) useAuth().logout()
      throw err
    }
  }

  const fetchUserPosts = async () => {
    try {
      posts.value = await $fetch(`${apiUrl}/api/user/posts`, { headers: getHeaders() })
    } catch (err: any) {
      if (err?.response?.status === 401) useAuth().logout()
      throw err
    }
  }

  const createPost = async (formData: any) => {
    try {
      return await $fetch(`${apiUrl}/api/user/posts`, {
        method: 'POST',
        headers: getHeaders(), // Pas de Content-Type ici pour que FormData gère l'image
        body: formData
      })
    } catch (err: any) {
      if (err?.response?.status === 401) useAuth().logout()
      throw err
    }
  }

  const updatePost = async (id: number, data: any) => {
    try {
      return await $fetch(`${apiUrl}/api/user/posts/${id}`, {
        method: 'PUT',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: data
      })
    } catch (err: any) {
      if (err?.response?.status === 401) useAuth().logout()
      throw err
    }
  }

  const deletePost = async (id: number) => {
    try {
      await $fetch(`${apiUrl}/api/user/posts/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
    } catch (err: any) {
      if (err?.response?.status === 401) useAuth().logout()
      throw err
    }
  }

  // Likes
  const likePost = async (postId: number) => {
    try {
      const response = await $fetch(`${apiUrl}/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' }
      })
      return response
    } catch (error) {
      console.error('Error liking post:', error)
      throw error
    }
  }

  // Comments
  const getComments = async (postId: number) => {
    try {
      const comments = await $fetch(`${apiUrl}/api/posts/${postId}/comments`, {
        headers: getHeaders()
      })
      return comments
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  }

  const addComment = async (postId: number, content: string) => {
    try {
      const response = await $fetch(`${apiUrl}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      return response
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  const updateComment = async (commentId: number, content: string) => {
    try {
      const response = await $fetch(`${apiUrl}/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      return response
    } catch (error) {
      console.error('Error updating comment:', error)
      throw error
    }
  }

  const deleteComment = async (commentId: number) => {
    try {
      await $fetch(`${apiUrl}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }

  // Notifications
  const getNotifications = async () => {
    try {
      const notificationsResponse = await $fetch(`${apiUrl}/api/notifications`, {
        headers: getHeaders()
      })
      return normalizeArrayResponse(notificationsResponse)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      const response = await $fetch(`${apiUrl}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: getHeaders()
      })
      return response
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  // Polling for real-time updates
  const startPolling = (userId = null, onNewNotifications?: (notifications: any[]) => void) => {
    if (pollingTimer.value) return // Already polling

    const auth = useAuth()

    const poll = async () => {
      try {
        const previousNotifications = Array.isArray(notifications.value) ? [...notifications.value] : []

        if (typeof onNewNotifications === 'function' && auth.user.value) {
          await fetchNotifications()

          if (Array.isArray(notifications.value)) {
            const newNotifications = notifications.value.filter((notif) =>
              !notif.read_at && !previousNotifications.some((prev) => prev.id === notif.id)
            )
            if (newNotifications.length) {
              onNewNotifications(newNotifications)
            }
          }
        }

        // Only fetch posts if userId is provided (for page-specific polling)
        // Global notification polling doesn't need to fetch posts
        if (userId !== null || !onNewNotifications) {
          await fetchPosts(userId)
        }
      } catch (error) {
        console.error('Polling error:', error)
      } finally {
        pollingTimer.value = setTimeout(poll, 5000)
      }
    }

    poll()
  }

  const stopPolling = () => {
    if (pollingTimer.value) {
      clearTimeout(pollingTimer.value)
      pollingTimer.value = null
    }
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const oldNotifications = Array.isArray(notifications.value) ? [...notifications.value] : []
      const response = await getNotifications()
      notifications.value = Array.isArray(response) ? response : []
      console.log('Fetched notifications:', notifications.value.length, 'new, previous:', oldNotifications.length)
    } catch (error) {
      console.error('Error fetching notifications in polling:', error)
      notifications.value = []
    }
  }

  return { 
    posts, 
    post,
    notifications,
    apiUrl, 
    fetchPosts, 
    fetchPost, 
    fetchUserPosts, 
    createPost, 
    updatePost, 
    deletePost,
    likePost,
    getComments,
    addComment,
    updateComment,
    deleteComment,
    getNotifications,
    markNotificationAsRead,
    startPolling,
    stopPolling,
    fetchNotifications
  }
}