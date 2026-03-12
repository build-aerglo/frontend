<template>
  <div
    v-if="data"
    class="flex flex-col gap-2.5 p-[10px] cursor-pointer items-center rounded-[10px] hover:shadow-sm hover:border"
    @click="navigateToCategory(data)"
  >
    <i class="pi pi-home"></i>
    <div class="text-[90%]">{{ data.name }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps(["data"]);

const navigateToCategory = (category: any) => {
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
