<script setup lang="ts">
import { computed } from 'vue'

// Récupération des variables d'environnement
const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()
const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL

// Importation de tes composables
const { sharePost } = useSocial()
const route = useRoute()

// Définition de la propriété "post" passée par le parent
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

// Petite astuce pour savoir si on est sur la page "Mon compte"
// Si oui, on affiche les boutons de gestion, sinon on affiche le bouton "Voir"
const isMyPost = computed(() => route.path.includes('/account'))
</script>

<template>
  <div>
    <div v-if="isMyPost" style="border: 1px solid black; padding: 10px; margin: 10px 0; border-radius: 8px;">
      <strong>{{ post.user?.firstname || 'Moi' }}</strong>
      <img v-if="post.image" :src="`${apiUrl}/storage/${post.image}`" alt="Mon image" style="max-width: 100%; margin: 10px 0;" />
      <p>{{ post.description }}</p>

      <div style="display: flex; gap: 15px; margin-top: 10px;">
        <NuxtLink :to="`/account/posts/${post.id}`" style="color: blue;">Gérer mon post</NuxtLink>
        <button @click="sharePost(post)" style="color: green; cursor: pointer;">
            Partager
        </button>
      </div>
    </div>

    <div v-else style="border: 1px solid black; padding: 10px; margin: 10px 0; border-radius: 8px;">
      <strong>{{ post.user?.firstname || 'Utilisateur inconnu' }}</strong>
      <img v-if="post.image" :src="`${apiUrl}/storage/${post.image}`" alt="Image du post" style="max-width: 100%; margin: 10px 0;" />
      <p>{{ post.description }}</p>
      
      <div style="display: flex; gap: 15px; margin-top: 10px;">
        <NuxtLink :to="`/posts/${post.id}`" style="color: blue;">Voir</NuxtLink>
        <button @click="sharePost(post)" style="color: green; cursor: pointer;">
            Partager
        </button>
      </div>
    </div>
  </div>
</template>