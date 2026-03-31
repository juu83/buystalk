export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
 
  nitro: {
    preset: 'static'
  },

  // router: {
  //   options: {
  //     hashMode: true
  //   }
  // },

  // app: {
  //   baseURL: '',
  //   buildAssetsDir: '_nuxt'
  // },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    public: {
      APP_NAME: process.env.APP_NAME,
      APP_ENV: process.env.APP_ENV,
      WEBAPI_URL: process.env.WEBAPI_URL,
      APPAPI_URL: process.env.APPAPI_URL
    }
  },

  devtools: { enabled: true },

  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost', // Le navigateur cherchera en local
        port: 24678,       // Le port interne
        clientPort: 24678  // Le port externe exposé par Docker
      },
      watch: {
        usePolling: true
      }
    }
  }
})