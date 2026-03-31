
export const useSocial = () => {
  const sharePost = async (post: any) => {
    const { Share } = await import('@capacitor/share')
    const shareOptions = {
      title: `Post de ${post.user?.firstname || 'un ami'}`,
      text: post.description,
      url: window.location.origin + '/posts/' + post.id,
      dialogTitle: 'Partager cette publication',
    }

    try {
      const canShare = await Share.canShare()
      
      if (canShare.value) {
        await Share.share(shareOptions)
      } 
      else if (navigator.share) {
        await navigator.share(shareOptions)
      } 
      else {
        alert("Le partage n'est pas disponible sur ce navigateur.")
      }
    } catch (error) {
      console.error("Erreur de partage:", error)
    }
  }
  return { sharePost }
}