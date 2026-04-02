<template>
  <section class="bg-[#e4faeb] py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="relative mb-8">
        <h2
          class="text-xl md:text-2xl font-semibold text-left text-gray-700 dark:text-white mb-0"
        >
          Top Businesses
        </h2>
        <span class="hidden md:inline-block text-xs text-gray-500 font-semibold"
          >Ranked best on reviews, recency, and customer trust.</span
        >
        <span class="md:hidden text-xs text-gray-500 font-semibold"
          >Ranked by trust and recency.</span
        >
        <NuxtLink
          to="/end-user/landing/explore"
          class="group absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm font-bold text-[#008253] hover:text-slate-900 transition-colors"
        >
          See more
          <i
            class="pi pi-arrow-right text-xs group-hover:translate-x-1.5 transition-transform duration-300"
          ></i>
        </NuxtLink>
      </div>

      <!-- Card Grid -->
      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div
          v-for="(card, index) in _topBusinesses"
          :key="index"
          class="relative bg-gray-50 dark:bg-gray-800 p-2 rounded-xl transform transition-transform duration-150 ease-out hover:-translate-y-1.5"
          :class="[
            colors[index].borderColor,
            colors[index].shadowColor,
            index > 4 ? 'hidden md:block' : 'block',
          ]"
        >
          <!-- Top-left icon -->
          <div
            class="absolute top-3 left-3 p-2 rounded-lg"
            :class="colors[index].iconBg"
          >
            <i :class="`w-5 h-5 pi ${card.categories[0].icon}`"></i>
          </div>

          <!-- Logo -->
          <div class="flex justify-center mt-4 mb-3">
            <NuxtImg
              v-if="card.logo && card.logo.length > 0"
              :src="card.logo"
              alt="logo"
              width="64"
              height="64"
              format="webp"
              class="w-16 h-16 rounded-full object-cover"
              loading="lazy"
              :placeholder="false"
            />
            <img
              v-else
              src="/images/default-business-logo.png"
              loading="lazy"
              class="w-16 h-16 rounded-full object-cover"
              width="64"
              height="64"
            />
          </div>

          <!-- Business name -->
          <h3
            class="text-lg font-semibold text-center text-slate-800 dark:text-white"
          >
            {{ card.businessName }}
          </h3>

          <!-- Star Ratings -->
          <div class="flex items-center justify-center">
            <Star :count="card.avgRating" size="lg" />
          </div>

          <div class="text-center text-[80%]">
            <p class="text-gray-400 dark:text-gray-300">
              ({{ card.reviewCount }} reviews)
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { $topBusinesses } = useNuxtApp();
const _topBusinesses = computed(() => $topBusinesses.value);

const colors = [
  {
    iconBg: "bg-purple-100 text-purple-500",
    borderColor: "border border-purple-200",
    shadowColor: "shadow-[0_4px_12px_rgba(147,51,234,0.25)]",
  },
  {
    iconBg: "bg-red-100 text-red-500",
    borderColor: "border border-red-200",
    shadowColor: "shadow-[0_4px_12px_rgba(220,38,38,0.25)]",
  },
  {
    iconBg: "bg-orange-100 text-orange-600",
    borderColor: "border border-orange-200",
    shadowColor: "shadow-[0_4px_12px_rgba(234,88,12,0.25)]",
  },
  {
    iconBg: "bg-red-100 text-red-600",
    borderColor: "border border-red-200",
    shadowColor: "shadow-[0_4px_12px_rgba(220,38,38,0.25)]",
  },
  {
    iconBg: "bg-sky-100 text-sky-500",
    borderColor: "border border-sky-100",
    shadowColor: "shadow-[0_4px_12px_rgba(22,163,74,0.25)]",
  },
  {
    iconBg: "bg-yellow-100 text-yellow-600",
    borderColor: "border border-yellow-200",
    shadowColor: "shadow-[0_4px_12px_rgba(220,38,38,0.25)]",
  },
  {
    iconBg: "bg-orange-100 text-orange-600",
    borderColor: "border border-orange-200",
    shadowColor: "shadow-[0_4px_12px_rgba(234,88,12,0.25)]",
  },
  {
    iconBg: "bg-purple-100 text-purple-600",
    borderColor: "border border-purple-200",
    shadowColor: "shadow-[0_4px_12px_rgba(147,51,234,0.25)]",
  },
  {
    iconBg: "bg-sky-100 text-sky-500",
    borderColor: "border border-sky-100",
    shadowColor: "shadow-[0_4px_12px_rgba(22,163,74,0.25)]",
  },
  {
    iconBg: "bg-yellow-100 text-yellow-600",
    borderColor: "border border-yellow-200",
    shadowColor: "shadow-[0_4px_12px_rgba(220,38,38,0.25)]",
  },
];

const pageLoaded = ref(false);

onMounted(() => {
  pageLoaded.value = true;
});
</script>
