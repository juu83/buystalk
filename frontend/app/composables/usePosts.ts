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

const config = useRuntimeConfig()
const WEBAPI_URL = config.public.WEBAPI_URL

export const usePosts = () => {
    const posts = ref<Post[]>([])

    const fetchPosts = async () => {
    try {
        const response = await $fetch<LaravelResponse>(`${WEBAPI_URL}/api/posts`)
        posts.value = response.data
    }
    catch(error) {
        console.error("Erreur lors de la récupération des posts :", error)
    }
}

    return {
        posts, 
        fetchPosts
    }
}

const post = ref<Post | null>(null)

const fetchPostById = async (id: string) => {
    try {
        const response = await $fetch<Post>(`${WEBAPI_URL}/api/posts/${id}`)
        post.value = response
    } catch (error) {
        console.error("Erreur lors de la récupération du post :", error)
    }
}