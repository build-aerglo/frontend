import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["primeicons/primeicons.css","@/assets/style.css", "@/assets/css/bundle.css","swiper/css", "swiper/css/navigation"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@nuxt/image",
    "@pinia/nuxt",
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
    },
  },
});
