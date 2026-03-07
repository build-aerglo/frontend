<template>
  <Card class="shadow-md border border-primary">
    <template #content>
      <div>
        <!-- header -->
        <div class="flex gap-[10px]">
          <div
            :style="{ backgroundColor: getColorCode(initials) }"
            :class="`rounded-full h-[44px] w-[44px] font-bold flex justify-center items-center`"
          >
            {{ initials }}
          </div>
          <div class="flex flex-col flex-1 justify-center">
            <div class="text-[90%] mb-[2px]">
              {{ data.anonymous ? "Anonymous" : data.email }}
            </div>
            <div>
              <NuxtLink :to="`/biz/${data.businessId}`"
                >@{{ data.businessName }}</NuxtLink
              >
            </div>
          </div>
          <div class="w-[100px]">
            <Star :count="data.starRating" :rounded="false" />
            <small>{{ timeAgo(data.uploadedDate) }}</small>
          </div>
        </div>

        <!-- body -->
        <Divider />

        <div class="my-[20px]">
          <div v-html="data.reviewBody"></div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { ReviewSummary } from "~/types/review";

const props = defineProps<{
  data: ReviewSummary;
}>();

const initials = getInitials(props.data.email);
</script>
