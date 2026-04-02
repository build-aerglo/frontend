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
              class="p-3 rounded-full border border-slate-900 hover:bg-[#008253]/10 text-slate-800 transition"
            >
              <i class="pi pi-chevron-left text-sm"></i>
            </button>
            <button
              class="p-3 rounded-full border border-slate-900 hover:bg-[#008253]/10 text-slate-800 transition"
            >
              <i class="pi pi-chevron-right text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Review Slider -->
      <div class="grid sm:grid-cols-4 grid-cols-1 gap-[10px]">
        <div
          v-for="i in isMobile() ? 1 : 4"
          :key="i"
          class="p-[15px] relative bg-white rounded-xl transform transition-transform duration-150 ease-out hover:-translate-y-1.5"
        >
          <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
          <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
          <Skeleton fluid height="4rem" borderRadius="16px"></Skeleton>

          <div class="flex items-center gap-[5px] mt-[20px]">
            <Skeleton shape="circle" size="4rem"></Skeleton>
            <div>
              <Skeleton
                width="5rem"
                borderRadius="16px"
                class="mb-2"
              ></Skeleton>
              <Skeleton width="5rem" borderRadius="16px"></Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
