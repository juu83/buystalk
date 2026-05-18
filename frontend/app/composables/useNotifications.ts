import { LocalNotifications } from '@capacitor/local-notifications'

const showBrowserNotification = async (title: string, body: string) => {
  if (process.server || typeof window === 'undefined') return

  try {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body })
        return
      }

      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          new Notification(title, { body })
          return
        }
      }
    }
  } catch (error) {
    console.error('Erreur notification navigateur:', error)
  }

  alert(`${title}\n\n${body}`)
}

const isPermissionGranted = (permission: any) => {
  if (!permission) return false
  if (permission.display === 'granted') return true
  if (permission.granted === true) return true
  if (permission.value === 'granted') return true
  if (permission.state === 'granted') return true
  if (permission.status === 'granted') return true
  return false
}

const ensureNotificationChannel = async () => {
  try {
    await LocalNotifications.createChannel({
      id: 'buyStalk-channel',
      name: 'BuyStalk notifications',
      importance: 5,
      description: 'Notifications de likes et commentaires',
      visibility: 1
    })
  } catch (error) {
    console.warn('Impossible de créer le canal de notifications:', error)
  }
}

const sendLocalNotification = async (title: string, body: string) => {
  if (process.server) return

  try {
    const permission = await LocalNotifications.requestPermissions()
    const granted = isPermissionGranted(permission)

    if (!granted) {
      await showBrowserNotification(title, body)
      return
    }

    await ensureNotificationChannel()
    const notificationId = Math.abs(Math.floor(Date.now() % 2147483647))

    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: notificationId,
          channelId: 'buyStalk-channel',
          schedule: { at: new Date(Date.now() + 100) }
        }
      ]
    })
  } catch (error) {
    console.error('Erreur notification locale:', error)
    await showBrowserNotification(title, body)
  }
}

export const useNotifications = () => {
  const triggerLikeNotification = async (recipientId: number, senderId: number, senderName?: string) => {
    console.log('Triggering like notification for recipient:', recipientId, 'sender:', senderId, 'senderName:', senderName)
    if (recipientId === senderId) {
      console.log('Skipping notification: recipient is sender')
      return
    }

    const body = senderName
      ? `${senderName} a aimé votre publication !`
      : 'Quelqu’un a aimé votre publication !'
    await sendLocalNotification('Nouveau like 👍', body)
  }

  const triggerCommentNotification = async (recipientId: number, senderId: number, senderName?: string) => {
    console.log('Triggering comment notification for recipient:', recipientId, 'sender:', senderId, 'senderName:', senderName)
    if (recipientId === senderId) {
      console.log('Skipping notification: recipient is sender')
      return
    }
    const body = senderName
      ? `${senderName} a commenté votre publication !`
      : 'Quelqu’un a commenté votre publication !'
    await sendLocalNotification('Nouveau commentaire 💬', body)
  }

  return {
    triggerLikeNotification,
    triggerCommentNotification
  }
}
