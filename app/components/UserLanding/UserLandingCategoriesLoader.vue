<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div class="mx-auto">
      <div class="relative mb-2">
        <h2
          class="text-xl md:text-2xl font-semibold text-left text-gray-700 dark:text-white"
        >
          Explore categories
        </h2>
        <NuxtLink
          to="/end-user/landing/categories"
          class="group absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm font-bold text-[#008253] hover:text-slate-900 transition-colors"
        >
          See more
          <i
            class="pi pi-arrow-right text-xs group-hover:translate-x-1.5 transition-transform duration-300"
          ></i>
        </NuxtLink>
      </div>
      <div
        class="grid sm:grid-cols-8 grid-cols-4 gap-[20px] border border-gray-200 shadow-md p-4 rounded-xl mt-5"
      >
        <div
          class="flex justify-center items-center"
          v-for="i in isMobile() ? 4 : 8"
          :key="i"
        >
          <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
