interface Post {
  id: number
  description: string
  image: string | null
  user?: {
    firstname: string
  }
}

interface LaravelResponse {
  data: Post[] 
  current_page: number
  last_page: number
}



export const usePosts = () => {
    const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
    const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

    const posts = ref<Post[]>([])
    const post = ref<Post | null>(null)

    const { token } = useAuth()

    const fetchPosts = async () => {
        try {
            const response = await $fetch<LaravelResponse>(`${apiUrl}/api/posts`)
            posts.value = response.data
        } catch(error) {
            console.error("Erreur lors de la récupération des posts :", error)
        }
    }

    const fetchPostById = async (id: string) => {
        try {
            const response = await $fetch<Post>(`${apiUrl}/api/posts/${id}`)
            post.value = response
        } catch (error) {
            console.error("Erreur lors de la récupération du post :", error)
        }
    }

    const fetchUserPosts = async () => {
        try {
            const response = await $fetch<LaravelResponse>(`${apiUrl}/api/user/posts`, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })
            posts.value = response.data
        } catch(error) {
            console.error("Erreur (posts utilisateur) :", error)
        }
    }

    const createPost = async (formData: FormData) => {
        try {
            const data = await $fetch(`${apiUrl}/api/user/posts`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.value}`,
                'Accept': 'application/json' 
            },
            body: formData,
            })
            return data
        } catch (error) {
            console.error("Erreur lors de la création du post", error)
            throw error
        }
    }

    return {
        posts, 
        post, 
        fetchPosts,
        fetchPostById,
        fetchUserPosts,
        createPost
    }
}