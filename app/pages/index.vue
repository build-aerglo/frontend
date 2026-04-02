<template>
  <NavBar />
  <section
    id="hero"
    class="relative flex flex-col items-center justify-center text-center min-h-[80vh] py-6"
  >
    <!-- Background image div with loading state -->
    <div
      class="absolute inset-0 bg-cover bg-top brightness-75 md:bg-fixed transition-opacity duration-500"
      :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
      :style="
        imageLoaded
          ? `background-image: url('/images/background/e-user-ldg.png');`
          : ''
      "
    ></div>

    <!-- Fallback background color while image loads -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700 transition-opacity duration-500"
      :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
    ></div>

    <div class="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
    <div class="relative z-10 max-w-3xl font-sans">
      <h1
        class="font-bold text-white drop-shadow-lg mb-0 text-2xl sm:text-2xl md:text-3xl lg:text-4xl"
      >
        Let real experiences guide you
      </h1>

      <p class="mt-1 text-[#008253] text-base sm:text-lg md:text-xl">
        Clear reviews. Confident decisions.
      </p>
    </div>
    <div ref="heroSearchRef" class="w-full flex justify-center">
      <SearchBarHome />
    </div>
  </section>

  <!-- statistics -->
  <ClientOnly>
    <template #fallback>
      <UserLandingStatisticsLoader bgClass="bg-[#e4faeb]" :is-user="true" />
    </template>
    <UserLandingStatistics :statistics="statistics" bgClass="bg-[#e4faeb]" />
  </ClientOnly>

  <section class="pb-10 pt-5">
    <ClientOnly>
      <template #fallback>
        <UserLandingCategoriesLoader />
      </template>
      <UserLandingCategories />
    </ClientOnly>
  </section>

  <section>
    <ClientOnly>
      <template #fallback>
        <UserLandingTopReviewedLoader />
      </template>
      <UserLandingTopReviewed />
    </ClientOnly>
  </section>

  <!--Business CTA Section-->
  <section class="py-10 px-6 md:px-8 overflow-hidden">
    <div class="container mx-auto">
      <div
        class="flex flex-col-reverse md:flex-row items-center justify-between gap-12"
      >
        <div
          class="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 space-y-5"
        >
          <h2
            class="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight"
          >
            Ready to expand your brand?
          </h2>
          <p class="text-slate-600 text-lg max-w-md md:text-left">
            Boost credibility with authentic reviews and manage your reputation
            with our dedicated business dashboard.
          </p>
          <div class="pt-2 w-full flex justify-center md:justify-start">
            <NuxtLink to="/for-business/" class="w-auto">
              <button
                class="group px-8 py-3.5 rounded-xl !bg-primary text-white font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                Get Started
                <i
                  class="pi pi-arrow-right group-hover:translate-x-1 transition-transform"
                ></i>
              </button>
            </NuxtLink>
          </div>

          <div
            class="relative md:w-1/2 w-full flex justify-center items-center"
          >
            <div
              class="absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"
            ></div>

            <div class="relative z-10 animate-float drop-shadow-2xl">
              <img
                src="/images/img/front-pages/landing-page/cta-dashboard.png"
                alt="Business Dashboard"
                class="max-w-full h-auto rounded-lg"
              />
            </div>

            <div
              class="absolute -bottom-4 -right-4 md:right-0 bg-white p-3 rounded-lg shadow-xl animate-float-delayed z-20 hidden sm:flex items-center gap-2 border border-slate-100"
            >
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              <span
                class="text-[10px] font-bold text-slate-700 uppercase tracking-wider"
                >Real-time Analytics</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section>
    <ClientOnly>
      <template #fallback>
        <UserLandingReviewSliderLoader />
      </template>
      <UserLandingReviewSlider />
    </ClientOnly>
  </section>

  <Teleport to="body">
    <AuthUnifiedModal
      v-if="showAuth"
      :hide-back-to-review="true"
      @close="showAuth = false"
      @authenticated="handleGeneralAuthSuccess"
    />

    <div
      v-if="showReviewModal"
      class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        @click="showReviewModal = false"
      ></div>
      <div
        class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 md:p-10 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px]"
      >
        <button
          @click="showReviewModal = false"
          class="absolute top-5 right-5 text-gray-400"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
        <ReviewForm
          @close="showReviewModal = false"
          @open-auth="showAuth = true"
          @success="showReviewModal = false"
        />
      </div>
    </div>
  </Teleport>
  <div
    class="p-[25px] flex sm:flex-row flex-col sm:items-center justify-end bg-gradient-to-r from-[#deae29] to-[#fbd85b]"
  >
    <div class="flex-1">
      <div class="font-bold text-[130%] text-white">Share Your Experience</div>
      <div class="text-white">
        Had an experience? Share your review with businesses and help thousands
        of others discover who they can trust.
      </div>
    </div>
    <div class="sm:mt-0 mt-[20px] md:text-right">
      <button
        @click="handleWriteReviewClick"
        class="rounded-full !bg-[#1B1A1B] text-white px-[25px] py-[15px]"
      >
        Write a review
      </button>
    </div>
  </div>
  <!--Footer-->
  <NavigationFooter @modal-link="handleFooterModal" />
  <!--Footer-->
</template>

<script setup lang="ts">
const { $statistics } = useNuxtApp();
const _statistics = computed(() => $statistics.value);

import { useUserStore } from "~/store/user";
const router = useRouter();
const userStore = useUserStore();
const imageLoaded = ref<boolean>(false);

onBeforeMount((): void => {
  // Preload the background image
  const img: HTMLImageElement = new Image();
  img.src = "/images/background/e-user-ldg.png";

  img.onload = (): void => {
    imageLoaded.value = true;
  };

  // If image is already cached, it loads instantly
  if (img.complete) {
    imageLoaded.value = true;
  }
});

const showAuth = ref(false);
const showReviewModal = ref(false);

const handleFooterModal = (modal: string) => {
  if (modal === "auth") {
    showAuth.value = true;
  }

  if (modal === "write-review") {
    if (userStore.isAuthenticated) {
      router.push("/review/write-review");
    } else {
      showReviewModal.value = true;
    }
  }
};
const handleWriteReviewClick = () => {
  if (userStore.isAuthenticated) {
    router.push("/review/write-review");
  } else {
    showReviewModal.value = true;
  }
};

const isReviewModalOpen = ref(false);
const statistics = computed(() => [
  {
    title: "Registered Businesses",
    count: _statistics.value.registeredBusinesses,
  },
  { title: "Reviewing Users", count: _statistics.value.registeredUsers },
  { title: "Uploaded Reviews", count: _statistics.value.uploadedReviews },
]);

const featuredBusiness = getTopBusinesses(8);

watch(
  () => userStore.isAuthenticated,
  (isLoggedIn) => {
    if (isLoggedIn) {
      const hasDraft = localStorage.getItem("review_draft");

      if (hasDraft) {
        // Automatically open the modal
        isReviewModalOpen.value = true;
      }
    }
  },
);
const showGeneralAuth = ref(false);

const handleGeneralAuthSuccess = () => {
  showGeneralAuth.value = false;
};

const heroSearchRef = ref<HTMLElement | null>(null);
useHeroSearchObserver(heroSearchRef);
</script>
<style scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes float-delayed {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(15px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite;
}
</style>
