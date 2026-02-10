import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: [
    "primeicons/primeicons.css",
    "@/assets/style.css",
    "@/assets/css/bundle.css",
  ],
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@nuxt/image",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-qrcode",
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          prefix: "p",
          darkModeSelector: "none",
          cssLayer: false,
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL!,
      businessApiUrl: process.env.BUSINESS_API_URL!,
      reviewApiUrl: process.env.REVIEW_API_URL,
      notification_url: process.env.NOTIFICATION_API_URL!,
      QR_API_BASE: "https://api.qrserver.com/v1/create-qr-code/",
      QR_SIZE: "400x400",
      encrypt_key: process.env.ENCODE_KEY!,
      app_url: process.env.APP_URL!,
    },
  },
  // routeRules: {
  //   "/business/**": {
  //     appMiddleware: ["businessauth"],
  //   },
  //   "/end-user/**": {
  //     appMiddleware: ["userauth"],
  //   },
  // },
  // nitro: {
  //   devProxy : {
  //     '/api/' : {
  //       target: 'http://aerglotechnology.com',
  //       changeOrigin : true
  //     }
  //   }
  // }
});
