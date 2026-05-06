import { useCookie, navigateTo } from '#imports'
import { getApiUrl } from './useApiUrl'

export const useAuth = () => {
  // Le cookie remplace le localStorage pour marcher sur Web ET Mobile
  const token = useCookie('token')
  const user = useState<any>('user', () => null)

  const apiUrl = getApiUrl()

  const login = async (email: string, password: string) => {
    try {
      // $fetch gère automatiquement les erreurs et le format JSON
      const res: any = await $fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: { email, password }
      })

      // Sauvegarde automatique du cookie
      token.value = res.token
      user.value = res.user
      
      return true
    } catch (e) {
      console.error('Erreur login:', e)
      return false
    }
  }

  const fetchUser = async () => {
    if (!token.value) return
    try {
      const res: any = await $fetch(`${apiUrl}/api/user`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json'
        }
      })
      user.value = res
    } catch (e) {
      console.error('Erreur fetch user', e)
      token.value = null
      user.value = null
    }
  }

  const logout = async () => {
    if (token.value) {
      try {
        await $fetch(`${apiUrl}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Accept': 'application/json'
          }
        })
      } catch (e) {
        console.error("Erreur API logout", e)
      }
    }
    // Suppression du cookie et déconnexion
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return { user, token, login, logout, fetchUser }
}