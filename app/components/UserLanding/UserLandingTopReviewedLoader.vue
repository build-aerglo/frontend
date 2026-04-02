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

      <div class="grid sm:grid-cols-5 grid-cols-1 gap-[20px]">
        <div
          v-for="i in isMobile() ? 3 : 10"
          :key="i"
          class="gap-[10px] p-[15px] flex flex-col items-center justify-center relative bg-gray-50 dark:bg-gray-800 rounded-xl transform transition-transform duration-150 ease-out hover:-translate-y-1.5"
        >
          <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
          <Skeleton
            height="2rem"
            width="7rem"
            class="mb-2"
            borderRadius="16px"
          ></Skeleton>
          <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
          <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
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
</script>
