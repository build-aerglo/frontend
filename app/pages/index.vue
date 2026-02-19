<template>
  <!--Header-->
  <NavBar />
  <!--Header-->

  <!--First Section Start-->
  <section id="hero"
    class="relative flex flex-col items-center justify-center text-center min-h-[80vh] py-6">
    <!-- Background image div with loading state -->
    <div 
      class="absolute inset-0 bg-cover bg-top brightness-75 md:bg-fixed transition-opacity duration-500"
      :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
      :style="imageLoaded ? `background-image: url('/images/background/e-user-ldg.png');` : ''"
    ></div>
    
    <!-- Fallback background color while image loads -->
    <div 
      class="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700 transition-opacity duration-500"
      :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
    ></div>
    
    <div class="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
    
    <!-- Beginning content -->
    <div class="relative z-10 max-w-3xl font-sans">
      <h1 class="font-bold text-white drop-shadow-lg mb-0
                text-2xl
                sm:text-2xl
                md:text-3xl
                lg:text-4xl">
        Let real experiences guide you
      </h1>

      <p class="mt-1 text-[#008253]
                text-base
                sm:text-lg
                md:text-xl">
        Clear reviews. Confident decisions.
      </p>
    </div>
    <div ref="heroSearchRef" class="w-full flex justify-center">
      <SearchBarHome />
    </div>
  </section>
  <!--First Section Ends-->

  <!--Second Section begins-->
  <section class="bg-white pb-10 pt-5">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="relative mb-2">
        <h2 class="text-xl md:text-2xl font-demibold text-left text-gray-700 dark:text-white">
          Categories
        </h2>
        <a href="/end-user/landing/categories"
          class="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-blue-600 hover:text-gray-900 dark:text-gray-300">
          ...
        </a>
      </div>
      <LandingCategories />
    </div>
  </section>
  <!--Second Section ends-->

  <!--Third Section Starts-->
  <section >
    <TopReviewed />
  </section>
  <!--Third Section Ends-->

  <!--Call to Action Section-->
  <section class="bg-gradient-to-r from-fuchsia-50 to-fuchsia-200 py-10 px-6 md:px-8">
      <div class="container mx-auto px-6 text-center">
          <h2 class="text-lg md:text-xl font-semibold text-slate-900">
            Ready to expand your brand?
          </h2>
          <p class="text-slate-600 mt-2">
            Boost credibility with authentic reviews.
          </p>
          <div class="flex justify-center space-x-4">
          <NuxtLink to="/business/landing">
          <button
          class="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium
                hover:opacity-90 transition"
          >
            Get Started
          </button>
        </NuxtLink>
        </div>
      </div>
  </section>

  <!--Fourth Section Begins-->
  <section class="my-0">
    <ReviewSlider />
  </section>
  <!--Fourth Section Ends-->

  <!--Fifth Section begins-->
  <section id="add-voice" class="bg-gradient-to-r from-fuchsia-50 to-fuchsia-200 py-10 mb-0">
    <div class="container mx-auto px-6 text-center">
      <h2 class="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-6">
        Add Your Voice
      </h2>
      <p class="text-gray-800 dark:text-gray-300 max-w-2xl mx-auto mb-8">
        Become part of a growing network of individuals who value transparency and trust. By joining our platform, you
        contribute to shaping authentic conversations, helping others make informed choices while discovering new and
        better experiences every day.
      </p>
      <div class="flex justify-center space-x-4">
        <button 
          @click="showGeneralAuth = true"
          class="flex items-center space-x-2 bg-slate-900 hover:opacity-90 text-white px-6 py-3 rounded-xl transition-all duration-300"
        >
          <span>Login/Register</span>
        </button>
      </div>

      <Teleport to="body">
        <AuthUnifiedModal 
          v-if="showGeneralAuth" 
          :hide-back-to-review="true"
          @close="showGeneralAuth = false" 
          @authenticated="handleGeneralAuthSuccess"
        />
      </Teleport>
    </div>
  </section>
  <!--Fifth Section Ends-->

  <!--Footer-->
  <NavFooter />
  <!--Footer-->

</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
const router = useRouter()
const userStore = useUserStore()
const imageLoaded = ref<boolean>(false);
const toast = useToast()
onMounted((): void => {
  // Preload the background image
  const img: HTMLImageElement = new Image();
  img.src = '/images/background/e-user-ldg.png';
  
  img.onload = (): void => {
    imageLoaded.value = true;
  };
  
  // If image is already cached, it loads instantly
  if (img.complete) {
    imageLoaded.value = true;
  }
});
const isReviewModalOpen = ref(false)

// Watch for the login event
watch(() => userStore.isAuthenticated, (isLoggedIn) => {
  if (isLoggedIn) {
    // Check if there is a pending draft in localStorage or your store
    const hasDraft = localStorage.getItem('review_draft')
    
    if (hasDraft) {
      // Automatically open the modal
      isReviewModalOpen.value = true;
      
      // Optional: Small toast notification
      // toast.success("Welcome back! You can now finish your review.")
    }
  }
})
const showGeneralAuth = ref(false)

const handleGeneralAuthSuccess = () => {
  showGeneralAuth.value = false;  
  
}

const heroSearchRef = ref<HTMLElement | null>(null)
useHeroSearchObserver(heroSearchRef)
</script>