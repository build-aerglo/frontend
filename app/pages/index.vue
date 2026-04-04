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
      <div class="flex flex-col md:flex-row items-center justify-between gap-12">

        <!-- Right: Mock UI card (comes first on mobile via order) -->
        <div class="w-full md:w-1/2 md:order-2 relative flex justify-center items-center">
          <div class="absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>

          <div class="relative z-10 w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl animate-float overflow-hidden">
            <!-- Window chrome -->
            <div class="bg-slate-800 px-5 py-3 flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              <div class="ml-3 text-xs text-slate-400 font-mono">Clereview · Business Profile</div>
            </div>

            <div class="p-5 space-y-4">
              <!-- Business header -->
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <i class="pi pi-building text-primary text-xl"></i>
                </div>
                <div>
                  <div class="font-bold text-slate-800 text-sm">Adaeze Fashion House</div>
                  <div class="text-xs text-slate-400">Lagos, Nigeria · Fashion & Retail</div>
                </div>
                <div class="ml-auto">
                  <span class="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">Verified ✓</span>
                </div>
              </div>

              <!-- Review count + rating -->
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <div class="font-bold text-lg text-primary">4.9</div>
                  <div class="text-[10px] text-slate-400">Avg Rating</div>
                </div>
                <div class="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <div class="font-bold text-lg text-slate-800">842</div>
                  <div class="text-[10px] text-slate-400">Reviews</div>
                </div>
                <div class="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <div class="font-bold text-lg text-slate-800">2.1k</div>
                  <div class="text-[10px] text-slate-400">Profile Visits</div>
                </div>
              </div>

              <!-- Recent reviews -->
              <div class="space-y-2">
                <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Reviews</div>
                <div v-for="review in mockReviews" :key="review.name"
                  class="flex items-start gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                    {{ review.name[0] }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1 mb-0.5">
                      <span class="text-[10px] font-semibold text-slate-700">{{ review.name }}</span>
                      <div class="flex gap-0.5 ml-1">
                        <i v-for="n in review.rating" :key="n" class="pi pi-star-fill text-gold text-[8px]"></i>
                      </div>
                    </div>
                    <p class="text-[11px] text-slate-500 truncate">{{ review.text }}</p>
                  </div>
                </div>
              </div>

              <!-- Action row -->
              <div class="flex gap-2">
                <div class="flex-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg px-3 py-2 text-center">
                  📣 Respond
                </div>
                <div class="flex-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg px-3 py-2 text-center">
                  📊 Analytics
                </div>
                <div class="flex-1 bg-gold/10 text-amber-600 text-xs font-semibold rounded-lg px-3 py-2 text-center">
                  🔗 Share
                </div>
              </div>
            </div>
          </div>

          <!-- Floating badge -->
          <div class="absolute -bottom-2 -right-2 md:right-4 bg-white border border-slate-100 p-3 rounded-xl shadow-xl animate-float-delayed z-20 hidden sm:flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-green-500"></div>
            <span class="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Real-time Analytics</span>
          </div>
        </div>

        <!-- Left: Marketing text (comes second on mobile via order) -->
        <div class="w-full md:w-1/2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left space-y-5">
          <h2 class="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
            Ready to expand your brand?
          </h2>
          <p class="text-slate-600 text-lg max-w-md md:text-left">
            Boost credibility with authentic reviews and manage your reputation
            with our dedicated business dashboard.
          </p>
          <div class="pt-2 w-full flex justify-center md:justify-start">
            <NuxtLink to="/for-business/" class="w-auto">
              <button class="group px-8 py-3.5 rounded-xl !bg-primary text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                Get Started
                <i class="pi pi-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>
            </NuxtLink>
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
const mockReviews = [
  { name: 'Chidi N.', rating: 5, text: 'Absolutely love the quality. Best purchase this year!' },
  { name: 'Fatima B.', rating: 4, text: 'Great service, delivered faster than expected.' },
]
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
