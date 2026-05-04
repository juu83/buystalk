# Configuration Firebase pour les Notifications Push

## 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet
3. Activez Firebase Cloud Messaging (FCM)

## 2. Configuration côté Backend (Laravel)

### Variables d'environnement (.env)

Ajoutez ces variables dans votre fichier `.env` :

```env
FIREBASE_PROJECT_ID=votre_project_id
FIREBASE_PRIVATE_KEY_ID=votre_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=votre_client_email
FIREBASE_CLIENT_ID=votre_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/votre_client_email
```

### Comment obtenir ces valeurs :

1. Dans Firebase Console, allez dans Project Settings > Service Accounts
2. Générez une nouvelle clé privée (JSON)
3. Copiez les valeurs du JSON dans votre `.env`

## 3. Configuration côté Frontend (Nuxt.js)

### Variables d'environnement (.env)

```env
FIREBASE_API_KEY=votre_api_key
FIREBASE_AUTH_DOMAIN=votre_project.firebaseapp.com
FIREBASE_PROJECT_ID=votre_project_id
FIREBASE_STORAGE_BUCKET=votre_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
FIREBASE_APP_ID=votre_app_id
```

### Comment obtenir ces valeurs :

1. Dans Firebase Console, allez dans Project Settings > General
2. Dans "Your apps", cliquez sur l'icône web (</>) pour ajouter une app web
3. Copiez la configuration JavaScript

## 4. Configuration Android (Capacitor)

### google-services.json

1. Dans Firebase Console, allez dans Project Settings > General > Your apps
2. Cliquez sur l'icône Android pour ajouter votre app
3. Téléchargez le fichier `google-services.json`
4. Placez-le dans `android/app/`

### Variables dans capacitor.config.json

```json
{
  "plugins": {
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
  }
}
```

## 5. Service Worker (pour le web)

Créez un fichier `public/firebase-messaging-sw.js` :

```javascript
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: "votre_api_key",
  authDomain: "votre_project.firebaseapp.com",
  projectId: "votre_project_id",
  storageBucket: "votre_project.appspot.com",
  messagingSenderId: "votre_sender_id",
  appId: "votre_app_id"
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload)
  // Personnalisez la notification
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
```

## 6. Permissions Android

Ajoutez dans `android/app/src/main/AndroidManifest.xml` :

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

## 7. Test

1. Migrez la base de données : `php artisan migrate`
2. Testez l'envoi de like/comment depuis l'app
3. Vérifiez que les notifications arrivent

## Dépannage

- Vérifiez que les tokens FCM sont bien enregistrés côté backend
- Assurez-vous que les permissions de notification sont accordées
- Pour Android, vérifiez que google-services.json est bien placé
- Consultez les logs Laravel pour les erreurs FCM