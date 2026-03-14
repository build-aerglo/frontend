<template>
  <Card
    class="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transform transition-transform duration-150 ease-out hover:-translate-y-1.5"
  >
    <template #content>
      <div class="flex flex-col gap-4">
        <div class="flex justify-center">
          <img
            :src="data.logo ?? '/images/default-business-logo.png'"
            :alt="data.name"
            class="w-24 h-24 object-contain rounded-full border border-gray-200"
          />
        </div>
        <div class="text-center">
          <div class="font-semibold text-[120%] mb-1 text-gray-800">
            {{ data.name }}
          </div>
          <NuxtLink>
            <Chip
              :label="data.categories[0]?.name"
              class="cursor-pointer !py-[4px] !bg-primary text-white"
            >
              <span class="!text-[80%]">{{ data.categories[0]?.name }}</span>
            </Chip>
          </NuxtLink>
          <div
            class="flex justify-center items-center gap-1 mt-2 text-gray-600 text-sm"
          >
            <Star :count="data.avgRating" :rounded="true" />
            <span>{{ data.avgRating }} - {{ data.reviewCount }} rating(s)</span>
          </div>
          <div class="mt-2 text-gray-500 text-sm">
            {{
              `${data.businessStreet ?? "-"}, ${data.businessCityTown ?? "-"}, ${data.businessState ?? "-"}`
            }}
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { BusinessSummary } from "~/types/business";

const props = defineProps<{
  data: BusinessSummary;
}>();
</script>
