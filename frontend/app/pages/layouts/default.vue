<template>
  <div class="min-h-screen bg-slate-50">
    <header class="sticky top-0 z-40 border-b border-blue-500 bg-blue-600 backdrop-blur">
      <div class="mx-auto max-w-6xl px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <span class="text-xl font-black">S</span>
            </div>
            <div>
              <NuxtLink to="/posts" class="text-xl font-semibold text-white hover:text-blue-200 transition">SocialApp</NuxtLink>
              <p class="text-sm text-blue-200">Un vrai réseau social pour vos posts</p>
            </div>
          </div>

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400 bg-white text-blue-600 shadow-sm transition hover:bg-blue-50 sm:hidden"
            aria-label="Ouvrir le menu"
          >
            <span v-if="!mobileMenuOpen">☰</span>
            <span v-else>✕</span>
          </button>

          <div class="hidden flex-1 sm:block">
            <label class="relative block w-full">
              <span class="sr-only">Rechercher</span>
              <input
                type="search"
                placeholder="Rechercher posts, amis, hashtags..."
                class="w-full rounded-2xl border border-blue-400 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-200 placeholder:text-slate-400"
              />
              <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">🔎</span>
            </label>
          </div>

          <div class="hidden items-center gap-3 sm:flex">
            <button type="button" class="rounded-2xl border border-blue-400 bg-white px-4 py-2 text-sm text-blue-600 transition hover:bg-blue-50">
              Notifications
            </button>
            <div class="flex items-center gap-3 rounded-full border border-blue-400 bg-white px-3 py-2 shadow-sm">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
                {{ user?.firstname?.charAt(0) || 'U' }}
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ user?.firstname }} {{ user?.lastname }}</p>
                <p class="text-xs text-slate-500">{{ user?.email }}</p>
              </div>
            </div>
            <button @click="logout" class="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
              Déconnexion
            </button>
          </div>
        </div>

        <transition name="fade-slide">
          <div v-if="mobileMenuOpen" class="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:hidden">
            <nav class="space-y-3">
              <NuxtLink
                to="/posts"
                class="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                active-class="bg-blue-50 text-blue-600"
              >
                Accueil
              </NuxtLink>
              <NuxtLink
                to="/account"
                class="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                active-class="bg-blue-50 text-blue-600"
              >
                Profil
              </NuxtLink>
            </nav>

            <div class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-sm font-semibold text-slate-900">{{ user?.firstname }} {{ user?.lastname }}</p>
              <p class="text-xs text-slate-500">{{ user?.email }}</p>
            </div>

            <button @click="logout" class="mt-4 w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
              Déconnexion
            </button>
          </div>
        </transition>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const mobileMenuOpen = ref(false)
const { logout, user } = useAuth()
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 200ms ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
