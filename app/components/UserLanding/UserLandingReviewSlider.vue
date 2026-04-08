<template>
  <section class="bg-[#e4faeb] py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="relative mb-8">
        <h2
          class="text-xl md:text-2xl font-semibold text-left text-gray-700 dark:text-white"
        >
          Recent Reviews
        </h2>
        <div class="absolute right-0 top-1/2 -translate-y-1/2">
          <div class="flex gap-3">
            <button
              @click="prevSlide"
              class="p-3 rounded-full border border-slate-900 hover:bg-[#008253]/10 text-slate-800 transition"
            >
              <i class="pi pi-chevron-left text-sm"></i>
            </button>
            <button
              @click="nextSlide"
              class="p-3 rounded-full border border-slate-900 hover:bg-[#008253]/10 text-slate-800 transition"
            >
              <i class="pi pi-chevron-right text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Review Slider -->
      <div class="relative w-full overflow-hidden">
        <div
          class="flex ease-in-out"
          :class="isTransitioning ? 'transition-transform duration-700' : ''"
          :style="{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }"
        >
          <div
            v-for="(review, index) in reviews"
            :key="index"
            :class="slideWidthClass"
            class="px-3"
          >
            <div
              class="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md p-7 h-full flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <p
                  class="text-lg text-slate-800 dark:text-gray-100 font-semibold"
                >
                  {{ review.businessName }}
                </p>
                <div class="flex mb-3">
                  <Star :count="review.starRating" size="md" />
                </div>
                <p class="text-gray-500 dark:text-gray-200 italic line-clamp-4">
                  “{{ review.reviewBody }}”
                </p>
              </div>
              <div class="flex items-center mt-2">
                <div
                  :style="{
                    backgroundColor: getColorCode(getInitials(review.email)),
                  }"
                  :class="`rounded-full w-12 h-12 font-bold flex justify-center items-center  mr-2`"
                >
                  {{ getInitials(review.email) }}
                </div>
                <div class="mt-4">
                  <h6 class="font-semibold mb-0 text-gray-700 dark:text-white">
                    {{ review.anonymous ? "Anonymous" : review.email }}
                  </h6>
                  <p class="text-gray-400 text-sm">
                    {{ timeAgo(review.uploadedDate) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $reviews } = useNuxtApp();

const baseReviews = computed(() =>
  Array.isArray($reviews.value) ? $reviews.value : [],
);

const visibleCount = ref(4);
const currentIndex = ref(0);
const isTransitioning = ref(true);
let interval: NodeJS.Timeout;

const updateVisibleCount = () => {
  if (window.innerWidth < 640) visibleCount.value = 1;
  else if (window.innerWidth < 1024) visibleCount.value = 2;
  else visibleCount.value = 4;
};

// Clone slides for infinite looping
const reviews = computed(() => {
  if (baseReviews.value.length === 0) return [];

  const cloneSize = Math.min(visibleCount.value, baseReviews.value.length);

  return [
    ...baseReviews.value.slice(-cloneSize),
    ...baseReviews.value,
    ...baseReviews.value.slice(0, cloneSize),
  ];
});

const slideWidthClass = computed(() => {
  if (visibleCount.value === 1) return "min-w-full";
  if (visibleCount.value === 2) return "min-w-[50%]";
  return "min-w-[25%]";
});

const nextSlide = async () => {
  if (baseReviews.value.length <= visibleCount.value) return;

  const cloneSize = Math.min(visibleCount.value, baseReviews.value.length);

  isTransitioning.value = true;
  currentIndex.value++;
  if (currentIndex.value === baseReviews.value.length + cloneSize) {
    // jump instantly back to real first slide
    await new Promise((r) => setTimeout(r, 700)); // wait for transition
    isTransitioning.value = false;
    currentIndex.value = cloneSize;
  }
};

const prevSlide = async () => {
  if (baseReviews.value.length <= visibleCount.value) return;

  const cloneSize = Math.min(visibleCount.value, baseReviews.value.length);

  isTransitioning.value = true;
  currentIndex.value--;
  if (currentIndex.value === 0) {
    await new Promise((r) => setTimeout(r, 700));
    isTransitioning.value = false;
    currentIndex.value = baseReviews.value.length;
  } else if (currentIndex.value < cloneSize) {
    await new Promise((r) => setTimeout(r, 700));
    isTransitioning.value = false;
    currentIndex.value = baseReviews.value.length;
  }
};

watch(
  [baseReviews, visibleCount],
  () => {
    const cloneSize = Math.min(visibleCount.value, baseReviews.value.length);
    currentIndex.value = cloneSize;
  },
  { immediate: true },
);

onMounted(() => {
  updateVisibleCount();
  window.addEventListener("resize", updateVisibleCount);
  interval = setInterval(nextSlide, 3000);
});

onBeforeUnmount(() => {
  clearInterval(interval);
  window.removeEventListener("resize", updateVisibleCount);
});
</script>
