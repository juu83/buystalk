export const usePosts = () => {
  const posts = ref([])
  const post = ref(null)

  const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
  const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL
  
  const token = useCookie('token')

  const getHeaders = () => ({
    'Accept': 'application/json',
    ...(token.value ? { 'Authorization': `Bearer ${token.value}` } : {})
  })

  const fetchPosts = async (userId = null) => {
    try {
      const url = userId ? `${apiUrl}/api/posts?user=${userId}` : `${apiUrl}/api/posts`
      posts.value = await $fetch(url, { headers: { 'Accept': 'application/json' } })
    } catch (err: any) {
      if (err?.response?.status === 401) useAuth().logout()
      throw err
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

  return { posts, post, apiUrl, fetchPosts, fetchPost, fetchUserPosts, createPost, updatePost, deletePost }
}