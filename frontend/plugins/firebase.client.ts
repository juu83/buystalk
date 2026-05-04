// plugins/firebase.client.ts
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  const app = initializeApp(firebaseConfig)

  // Initialize messaging only in browser and if supported
  if (process.client && 'serviceWorker' in navigator) {
    const messaging = getMessaging(app)

    // Handle incoming messages when app is in foreground
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload)
      // You can show a notification or update UI here
    })

    // Make messaging available globally
    return {
      provide: {
        firebaseMessaging: messaging
      }
    }
  }
})