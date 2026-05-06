<script setup>
const props = defineProps({
  ad: { type: Object, required: true },
  apiUrl: { type: String, required: true }
})
</script>

<template>
  <NuxtLink :to="`/ads/${ad.id}`" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 hover:shadow-md transition block">
    <div class="p-6">
      
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold text-blue-900">{{ ad.title }}</h3>
          <p class="text-sm text-gray-500 mt-1">
            📍 {{ ad.city }}
            <span v-if="ad.distance !== undefined" class="ml-2 font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
              à {{ Math.round(ad.distance) }} km de vous
            </span>
          </p>
        </div>
        <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
          {{ ad.user?.firstname?.charAt(0) }}
        </div>
      </div>

      <p class="text-blue-900 leading-relaxed mb-4">{{ ad.description }}</p>

      <div v-if="ad.image" class="rounded-xl overflow-hidden border border-gray-50">
        <img :src="`${apiUrl}/storage/${ad.image}`" class="w-full object-cover max-h-64" />
      </div>

    </div>
  </NuxtLink>
</template>