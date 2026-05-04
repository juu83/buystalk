import { useRuntimeConfig, useCookie } from '#imports'
import { useAuth } from './useAuth'

export const usePosts = () => {
  const posts = ref<any[]>([]) 
  const post = ref<any>(null)  

  const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
  const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL
  
  const token = useCookie('token')

  const getHeaders = () => ({
    'Accept': 'application/json',
    ...(token.value ? { 'Authorization': `Bearer ${token.value}` } : {})
  })

  // Dans usePosts.ts
const fetchPosts = async (userId = null) => {
    try {
      const url = userId ? `${apiUrl}/api/posts?user=${userId}` : `${apiUrl}/api/posts`
      const res = await $fetch<any>(url, { headers: { 'Accept': 'application/json' } })
      
      // On s'assure de ne pas mettre "null" dans posts si l'API répond bizarrement
      posts.value = res?.data || res || [] 
    } 
    catch (err: any) {
      console.error('Erreur lors du fetch des posts:', err)
      posts.value = [] // On vide le tableau pour éviter l'erreur never[]
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
      const notifications = await $fetch(`${apiUrl}/api/notifications`, {
        headers: getHeaders()
      })
      return notifications
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

  return { 
    posts, 
    post, 
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
    markNotificationAsRead
  }
}