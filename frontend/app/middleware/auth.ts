export default defineNuxtRouteMiddleware((to, from) => {
  // On lit le token depuis le cookie universel
  const token = useCookie('token')

  // Si aucun token n'existe, retour à la case départ
  if (!token.value) {
    return navigateTo('/login')
  }
})