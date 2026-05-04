// composables/useNotifications.ts
import { LocalNotifications } from '@capacitor/local-notifications'

export const useNotifications = () => {
  // On ajoute des types pour éviter les erreurs
  const triggerLikeNotification = async (postUserId: any, currentUserId: any) => {
    // Conversion explicite pour être sûr que 123 === "123" soit vrai
    const pId = Number(postUserId)
    const cId = Number(currentUserId)

    console.log(`Comparaison : PostOwner(${pId}) vs Me(${cId})`)

    // LOGIQUE MÉTIER : Uniquement si ce n'est pas mon propre post
    if (pId !== cId) {
      await LocalNotifications.schedule({
        notifications: [{
          title: 'Nouveau like',
          body: "Quelqu'un a aimé votre post",
          id: Math.floor(Math.random() * 100000), // ID unique requis
          schedule: { at: new Date(Date.now() + 1000) }
        }]
      })
    }
  }

  const triggerCommentNotification = async (postUserId: any, currentUserId: any) => {
    const pId = Number(postUserId)
    const cId = Number(currentUserId)

    if (pId !== cId) {
      await LocalNotifications.schedule({
        notifications: [{
          title: 'Nouveau commentaire',
          body: "Quelqu'un a commenté votre post",
          id: Math.floor(Math.random() * 100000),
          schedule: { at: new Date(Date.now() + 1000) }
        }]
      })
    }
  }

  return { triggerLikeNotification, triggerCommentNotification }
}