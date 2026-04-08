<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div class="mx-auto">
      <div class="relative mb-2 flex justify-between items-center">
        <h2
          class="text-xl md:text-2xl font-semibold text-left text-gray-700 dark:text-white"
        >
          Explore categories
        </h2>
        <div class="flex gap-[20px] items-center">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="h-8 w-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
              @click="slideCategories(-1)"
            >
              <i class="pi pi-angle-left"></i>
            </button>
            <button
              type="button"
              class="h-8 w-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
              @click="slideCategories(1)"
            >
              <i class="pi pi-angle-right"></i>
            </button>
          </div>
          <NuxtLink
            to="/end-user/landing/categories"
            class="group flex items-center gap-2 text-sm font-bold text-[#008253] hover:text-slate-900 transition-colors"
          >
            See more
            <i
              class="pi pi-arrow-right text-xs group-hover:translate-x-1.5 transition-transform duration-300"
            ></i>
          </NuxtLink>
        </div>
      </div>
      <div
        class="mt-5 relative border border-gray-200 shadow-md p-4 rounded-xl"
      >
        <div
          ref="sliderRef"
          class="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        >
          <div
            v-for="(category, index) in categories"
            :key="index"
            class="flex-none basis-[30%] sm:basis-[18.5%] lg:basis-[15.5%] min-h-[90px] flex flex-col items-center justify-center space-y-2 cursor-pointer hover:scale-105 transition-transform duration-200 snap-start"
            @click="navigateToCategory(category)"
          >
            <i
              :class="`pi ${category.icon} ${category.color}`"
              class="w-6 h-6 md:w-6 md:h-6 cursor-pointer hover:scale-110 transition-transform"
            ></i>
            <span
              class="text-[13px] md:text-xs text-gray-600 text-center leading-tight"
            >
              {{ category.name }}
            </span>
          </div>

          <div
            v-if="!categories.length"
            class="w-full text-center text-gray-500 py-3"
          >
            No categories available right now.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: string;
  icon: string;
  name: string;
  color: string;
}

const { $categories } = useNuxtApp();
const _categories = computed(() =>
  Array.isArray($categories.value) ? $categories.value : [],
);
const sliderRef = ref<HTMLElement | null>(null);

// const colors = [
//   {color: 'text-yellow-500'},
//   {color: 'text-sky-400'},
//   {color: 'text-red-600'},
//   {color: 'text-orange-500'},
//   {color: 'text-emerald-600'},
//   {color: 'text-pink-400'},
//   {color: 'text-teal-500'},
//   {color: 'text-purple-500'},
//   {color: 'text-indigo-500'},
// ]

const colors = [
  { color: "text-red-500" }, // bright red
  { color: "text-orange-400" }, // orange
  { color: "text-yellow-400" }, // yellow
  { color: "text-lime-500" }, // lime green
  { color: "text-green-500" }, // green
  { color: "text-emerald-500" }, // emerald
  { color: "text-teal-500" }, // teal
  { color: "text-cyan-500" }, // cyan
  { color: "text-sky-500" }, // sky blue
  { color: "text-blue-500" }, // blue
  { color: "text-indigo-500" }, // indigo
  { color: "text-violet-500" }, // violet
  { color: "text-purple-500" }, // purple
  { color: "text-fuchsia-500" }, // fuchsia
  { color: "text-pink-500" }, // pink
  { color: "text-rose-500" }, // rose
  { color: "text-orange-600" }, // darker orange
  { color: "text-green-700" }, // darker green
  { color: "text-blue-700" }, // darker blue
  { color: "text-purple-700" }, // darker purple
];

const categories = computed<Category[]>(() =>
  _categories.value.map((item: any, index: number) => ({
    id: item?.id ?? "",
    name: item?.name ?? "Unknown",
    icon: item?.icon ?? "pi-tag",
    color: colors[index % colors.length]?.color || "text-gray-400",
  })),
);

const slideCategories = (direction: 1 | -1) => {
  if (!sliderRef.value) return;

  const offset = sliderRef.value.clientWidth * 0.85;
  sliderRef.value.scrollBy({
    left: direction * offset,
    behavior: "smooth",
  });
};

const navigateToCategory = (category: Category) => {
  if (!category.id) return;

  navigateTo({
    path: "/end-user/landing/explore",
    query: {
      categoryId: category.id,
      category: category.name.toLowerCase(),
    },
  });
};
</script>
<style scoped>
/* Hide scrollbar but keep scrolling */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
</style>
