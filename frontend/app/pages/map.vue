<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ensurePermissions, getCurrentPosition } from '../utils/geolocation'

const { public: { GOOGLE_MAPS_API_KEY } } = useRuntimeConfig()
const { ads, fetchAds, apiUrl } = useAds()
const mapContainer = ref<HTMLDivElement | null>(null)
const status = ref('Chargement de la carte...')
const position = ref<{ lat: number; lng: number } | null>(null)
const mapInstance = ref<any>(null)
const infoWindow = ref<any>(null)
const directionsService = ref<any>(null)
const directionsRenderer = ref<any>(null)
const currentRoute = ref<any>(null)

const markers = []

const loadGoogleMapsScript = async () => {
  if (!process.client) return

  if ((window as any).google?.maps) {
    return
  }

  const existingScript = document.querySelector('script[data-google-maps]')
  if (existingScript) {
    if ((window as any).google?.maps) return
    await new Promise<void>((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', () => reject(new Error('Impossible de charger Google Maps')))
    })
    return
  }

  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('La clé GOOGLE_MAPS_API_KEY est manquante dans le fichier .env')
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}&libraries=places`
    script.async = true
    script.defer = true
    script.dataset.googleMaps = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Impossible de charger Google Maps'))
    document.head.appendChild(script)
  })
}

const initMap = () => {
  if (!mapContainer.value || !position.value) return

  const google = (window as any).google
  if (!google?.maps) {
    status.value = 'Google Maps n’est pas disponible.'
    return
  }

  mapInstance.value = new google.maps.Map(mapContainer.value, {
    center: position.value,
    zoom: 13,
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
  })

  // Créer une info window pour afficher les détails des annonces
  infoWindow.value = new google.maps.InfoWindow()

  // Initialiser les services d'itinéraire
  directionsService.value = new google.maps.DirectionsService()
  directionsRenderer.value = new google.maps.DirectionsRenderer({
    suppressMarkers: true, // Ne pas afficher les marqueurs par défaut
    polylineOptions: {
      strokeColor: '#EF4444',
      strokeWeight: 5,
      strokeOpacity: 0.8
    }
  })
  directionsRenderer.value.setMap(mapInstance.value)

  // Marqueur de la position actuelle
  new google.maps.Marker({
    position: position.value,
    map: mapInstance.value,
    title: 'Ma position',
    label: { text: '📍', color: '#fff', fontSize: '16px' },
    icon: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="white"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(24, 24),
      anchor: new google.maps.Point(12, 12)
    }
  })

  // Marqueurs des annonces
  ads.value.forEach((ad: any) => {
    if (ad.lat && ad.lng) {
      const marker = new google.maps.Marker({
        position: { lat: parseFloat(ad.lat), lng: parseFloat(ad.lng) },
        map: mapInstance.value,
        title: ad.title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C11.6 2 8 5.6 8 10c0 8 8 18 8 18s8-10 8-18c0-4.4-3.6-8-8-8z" fill="#EF4444"/>
              <circle cx="16" cy="10" r="4" fill="white"/>
              <text x="16" y="13" text-anchor="middle" font-family="Arial" font-size="8" fill="#EF4444" font-weight="bold">€</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      })

      // Contenu de l'info window
      const content = `
        <div style="max-width: 250px; font-family: system-ui, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${ad.title}</h3>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${ad.description}</p>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="color: #374151; font-weight: 500;">📍 ${ad.city}</span>
          </div>
          ${ad.distance ? `<div style="color: #059669; font-weight: 500; font-size: 13px;">📏 à ${Math.round(ad.distance)} km de vous</div>` : ''}
          ${ad.image ? `<img src="${apiUrl}/storage/${ad.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-top: 8px;" />` : ''}
          <div style="margin-top: 12px; display: flex; gap: 8px; flex-direction: column;">
            <a href="/ads/${ad.id}" style="background: #ef4444; color: white; text-decoration: none; display: inline-block; padding: 8px 16px; border-radius: 6px; font-weight: 500; text-align: center;">
              📋 Voir cette annonce
            </a>
            <button onclick="window.calculateRouteFromMarker && window.calculateRouteFromMarker(${ad.lat}, ${ad.lng})" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer;">
              🚗 Calculer l'itinéraire
            </button>
          </div>
        </div>
      `

      marker.addListener('click', () => {
        infoWindow.value.setContent(content)
        infoWindow.value.open(mapInstance.value, marker)
      })
    }
  })

  status.value = `Carte prête avec ${ads.value.length} annonce(s) visible(s). Cliquez sur les marqueurs verts pour voir les détails.`
}
const calculateRoute = (destination: { lat: number; lng: number }) => {
  if (!directionsService.value || !directionsRenderer.value || !position.value) {
    alert('Service d\'itinéraire non disponible')
    return
  }

  const request = {
    origin: position.value,
    destination: destination,
    travelMode: (window as any).google.maps.TravelMode.DRIVING
  }

  directionsService.value.route(request, (result: any, status: any) => {
    if (status === (window as any).google.maps.DirectionsStatus.OK) {
      directionsRenderer.value.setDirections(result)
      currentRoute.value = result

      // Calculer le temps de trajet
      const route = result.routes[0]
      const duration = route.legs[0].duration.text
      const distance = route.legs[0].distance.text

      status.value = `Itinéraire calculé : ${distance} - ${duration}. Utilisez le bouton "Effacer l'itinéraire" pour revenir à la vue normale.`
    } else {
      alert('Impossible de calculer l\'itinéraire : ' + status)
    }
  })
}

const clearRoute = () => {
  if (directionsRenderer.value) {
    directionsRenderer.value.setDirections({ routes: [] })
    currentRoute.value = null
    status.value = `Carte prête avec ${ads.value.length} annonce(s) visible(s). Cliquez sur les marqueurs rouges pour voir les détails.`
  }
}
onMounted(async () => {
  try {
    if (!process.client) return
    const permission = await ensurePermissions()
    if (permission.location !== 'granted') {
      status.value = 'Permission de localisation refusée ou non accordée. Chargement des annonces sans géolocalisation.'
      await fetchAds()
      return
    }

    const pos = await getCurrentPosition() as GeolocationPosition
    position.value = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    }

    // Récupérer les annonces avec géolocalisation
    await fetchAds(pos.coords.latitude, pos.coords.longitude)

    await loadGoogleMapsScript()
    initMap()

    // Exposer la fonction globalement pour les popups
    if (process.client) {
      (window as any).calculateRouteFromMarker = (lat: number, lng: number) => {
        calculateRoute({ lat, lng })
      }
    }
  } catch (error: any) {
    status.value = error?.message || 'Erreur lors du chargement de la carte.'
    // Essayer de charger les annonces sans géolocalisation en fallback
    try {
      await fetchAds()
    } catch (adsError) {
      console.error('Erreur chargement annonces:', adsError)
    }
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">Carte interactive Google Maps</h1>
        <p class="text-gray-500 mt-2">Accède à une carte, visualise ta position et explore directement depuis l’application.</p>
      </div>
      <div class="flex gap-3">
        <NuxtLink to="/ads" class="bg-green-600 text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-green-700 transition">
          📢 Voir les annonces
        </NuxtLink>
        <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 font-medium">Retour à l'accueil</NuxtLink>
      </div>
    </div>

    <div class="space-y-4">
      <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-4">
        <p class="text-sm text-gray-600"><strong>Statut :</strong> {{ status }}</p>
        <div v-if="currentRoute" class="mt-3">
          <button @click="clearRoute" class="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition">
            🗺️ Effacer l'itinéraire
          </button>
        </div>
      </div>

      <div v-if="position" ref="mapContainer" class="w-full h-[520px] rounded-3xl border border-gray-200 overflow-hidden bg-gray-100" />
      <div v-else class="w-full h-[520px] rounded-3xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500">
        En attente de la position...
      </div>
    </div>
  </div>
</template>
