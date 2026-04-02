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
        class="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6 border border-gray-200 shadow-md p-4 rounded-xl mt-5"
      >
        <div
          v-for="(category, index) in categories"
          :key="index"
          :class="[
            'flex flex-col items-center justify-center space-y-2 cursor-pointer hover:scale-110 transition-transform duration-200',
            index >= 4 ? 'hidden md:flex' : '',
          ]"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: string; // ✅ Added id
  icon: any;
  name: string;
  color: string;
}

const { $categories } = useNuxtApp();
const _categories = computed(() => $categories.value);

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

// Initialize with 8 skeletons
const categories = ref<Category[]>(
  Array(8)
    .fill(null)
    .map(() => ({
      id: "",
      icon: "pi-spin pi-spinner-dotted",
      name: "...",
      color: "text-gray-300",
    })),
);

onMounted(async () => {
  try {
    const data = _categories.value;

    if (data && Array.isArray(data)) {
      const mappedData = data.slice(0, 8).map((item: any, index: number) => {
        return {
          id: item.id,
          name: item.name,
          icon: item.icon,
          color: colors[index]?.color || "text-gray-400",
        };
      });

      while (mappedData.length < 8) {
        mappedData.push({
          id: "",
          name: "More",
          icon: "pi pi-plus",
          color: "text-gray-400",
        });
      }

      categories.value = mappedData;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});

const navigateToCategory = (category: Category) => {
  if (!category.id) return; // Don't navigate for skeleton/More items

  navigateTo({
    path: "/end-user/landing/explore",
    query: {
      categoryId: category.id,
      category: category.name.toLowerCase(),
    },
  });
};
</script>
