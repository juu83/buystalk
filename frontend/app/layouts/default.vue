<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white p-4 shadow-md flex gap-4">
      <NuxtLink to="/posts" class="text-blue-600 hover:underline">Fil d'actualité</NuxtLink>
      <NuxtLink to="/account/posts" class="text-blue-600 hover:underline">Mon compte</NuxtLink>
    </nav>

    <main class="p-8">
      <slot />
    </main>
  </div>
</template>