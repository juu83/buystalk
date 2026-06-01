# BuyStalk - Projet universitaire Réseau Social & E-Commerce

## À propos du projet
BuyStalk est une application mobile hybride conçue comme un réseau social local orienté vers le commerce de proximité. 
Elle permet aux utilisateurs de partager des posts, de publier des annonces géolocalisées et d'interagir entre eux (likes, commentaires, partages) dans un environnement sécurisé et conteneurisé.

Ce projet a été réalisé dans le cadre du module "Développement d'applications mobiles hybrides" (BUT INFO 2ème année).

## Stack Technique
L'architecture est séparée entre une API backend et un front-end mobile/web hybride :
* **Backend** : Laravel 11 (API REST JSON), Sanctum (Authentification)
* **Base de données** : MySQL/MariaDB
* **Frontend** : Nuxt 4 (Vue.js), TailwindCSS
* **Mobile** : Capacitor (intégration native pour Android/iOS)
* **Infrastructure** : Docker & Docker Compose (pour l'environnement backend)

## Fonctionnalités Principales
* **Authentification & Profil** : Connexion, inscription, mise à jour du profil et prise de photo d'avatar via `@capacitor/camera`.
* **Annonces Géolocalisées** : Création d'annonces avec coordonnées GPS. Affichage des annonces triées par distance par rapport à l'utilisateur (via requêtes SQL et `@capacitor/geolocation`).
* **Cartographie Interactive** : Intégration de l'API Google Maps pour localiser les annonces, avec calcul d'itinéraires et popups d'informations détaillées.
* **Fil d'actualité** : Création de posts, likes, commentaires et partage natif via `@capacitor/share`.
* **Notifications Locales** : Système d'alerte pour les interactions utilisateur (voir détails ci-dessous).

---

## Choix Techniques : Gestion des Notifications Mobiles

La gestion des notifications sur une application mobile implique souvent la mise en place d'une infrastructure lourde côté serveur (connexions WebSockets, configuration Firebase Cloud Messaging ou APNs). Pour répondre aux contraintes du projet (architecture REST simple sans WebSocket) tout en offrant une expérience utilisateur fluide, un choix technique spécifique a été fait : **la simulation de notifications côté front-end couplée au Polling**.

### 1. Stratégie de Polling Local
Plutôt que d'attendre que le serveur "pousse" (Push) la notification vers le téléphone, l'application vérifie d'elle-même (Pull/Polling) l'état des données. 
Dans Nuxt, un composable métier (`useNotifications.ts`) s'occupe de vérifier régulièrement l'API via des intervalles (`setInterval`). Il compare l'état actuel des données (ex. : nombre de likes ou de commentaires sur un post) avec l'état précédent mémorisé.

### 2. Déclenchement via Capacitor Local Notifications
Lorsqu'un différentiel est détecté (ex. un nouveau commentaire est apparu) et que l'interaction concerne le contenu de l'utilisateur connecté (`post.user_id === user.id`), l'application déclenche nativement une notification.

Pour ce faire, le projet utilise le plugin `@capacitor/local-notifications` :
1. **Permissions** : L'application demande l'autorisation système (`requestPermissions()`) de manière préventive.
2. **Scheduling** : L'alerte est programmée pour s'afficher immédiatement (`LocalNotifications.schedule(...)`).

### 3. Avantages et Inconvénients de l'approche
* **Avantages** : 
  * Simplicité architecturale extrême : l'API reste 100% Stateless.
  * Pas de dépendance absolue à un service tiers payant ou complexe comme Firebase pour cette fonctionnalité précise.
  * Autonomie du Frontend : La logique est centralisée côté client. L'utilisateur final perçoit une notification push standard, avec le même comportement UX natif.
* **Inconvénients / Limites** : 
  * L'application doit être active (en premier plan ou en tâche de fond très proche) pour que le setInterval tourne, contrairement aux "vraies" notifications push qui peuvent réveiller l'application.

---

## Installation et Déploiement

### Accès au projet
* Frontend : http://localhost:3000
* API Laravel : http://localhost:8000
* PhpMyAdmin : http://localhost:8080

---

### 1. Prérequis
* Docker & Docker Compose (ou Docker Desktop sur Windows avec intégration WSL2)
* Node.js & npm (pour le frontend)
* Android Studio (pour compiler l'application mobile)

### 2. Backend (API Laravel via Docker)
Le backend est conteneurisée pour fournir l'API localement sur `http://10.0.2.2:8000` (IP spécifique pour l'émulateur Android) ou `localhost`.
```bash
# 1. Lancer les conteneurs Docker
docker-compose up -d

# 2. Exécuter les migrations et peupler la base de données (Seeders)
docker exec -it api php artisan migrate --seed
```

### 3. Frontend 
```bash
cd frontend
npm install

# Lancement en mode développement pour le navigateur
npm run dev
```

### 4. Compilation Mobile (Capacitor vers Android Studio)
Le projet utilise Capacitor pour transcoder l'application web en projet natif Android.
```bash
cd frontend
npm run build

# Synchronisation des assets web vers le dossier android/
npx cap sync android

# Ouverture du projet dans Android Studio
npx cap open android
```
Une fois dans Android Studio :
* Attendez la fin de la synchronisation Gradle.

* Lancez le build.

* Déployez sur l'émulateur (Run 'app').
---
Enseignant encadrant : N. REALE - 2026-2027
