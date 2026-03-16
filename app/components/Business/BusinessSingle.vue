<template>
  <NuxtLink :to="`/biz/${data.id}`">
    <Card
      class="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transform transition-transform duration-150 ease-out hover:-translate-y-1.5 cursor-pointer"
    >
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex justify-center">
            <img
              :src="data.logo ?? '/images/default-business-logo.png'"
              :alt="data.name"
              class="w-24 h-24 object-contain rounded-full border border-gray-200"
              @error="handleImageError"
            />
          </div>
          <div class="text-center">
            <div class="font-semibold text-[120%] mb-1 text-gray-800">
              {{ data.name }}
            </div>
            <Chip
              :label="data.categories[0]?.name"
              class="cursor-pointer !py-[4px] !bg-primary text-white"
            >
              <span class="!text-[80%]">{{ data.categories[0]?.name }}</span>
            </Chip>            
          </div>
        </div>
      </template>
    </Card>

  </NuxtLink>
</template>

<script setup lang="ts">
import type { BusinessSummary } from "~/types/business";

const props = defineProps<{
  data: BusinessSummary;
}>();

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/default-business-logo.png';
};
</script>
