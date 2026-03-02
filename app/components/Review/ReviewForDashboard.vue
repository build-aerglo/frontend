<template>
  <Card>
    <template #content>
      <div class="flex gap-[10px]">
        <div
          :style="{ backgroundColor: getColorCode(initials) }"
          :class="`rounded-full h-[44px] w-[44px] font-bold flex justify-center items-center`"
        >
          {{ initials }}
        </div>
        <div
          class="flex flex-col flex-1"
          :class="isProfile ? 'justify-center' : ''"
        >
          <div class="text-[90%] mb-[2px]">
            {{ data.anonymous ? "Anonymous" : data.email }}
          </div>
          <ReviewStatusPill v-if="!isProfile" :status="data.status" />
        </div>
        <div class="w-[100px]">
          <Star :count="data.starRating" :rounded="false" />
          <small>{{ timeAgo(data.uploadedDate) }}</small>
        </div>
      </div>
      <Divider />
      <div class="my-[20px]">
        <div>{{ data.reviewBody }}</div>
      </div>
      <div
        v-if="data.photoUrls && data.photoUrls.length > 0"
        class="grid grid-cols-2 sm:grid-cols-4 gap-[20px] w-full sm:max-w-[40%]"
      >
        <div
          v-for="(img, index) in displayedImages"
          :key="index"
          class="relative cursor-pointer"
        >
          <img
            :src="img"
            class="w-full h-[100px] object-contain rounded-full"
          />
          <div
            v-if="showOverlay && index === 3"
            class="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold rounded-md"
          >
            +{{ remainingImages }}
          </div>
        </div>
      </div>
      <Divider v-if="data.replyBody && showReply" />

      <!-- reply -->
      <div
        class="border-l-[5px] border-l-primary p-[20px] bg-[#f3f0ec] rounded-[5px] mt-[20px]"
        v-if="data.replyBody && showReply"
      >
        <div class="mt-[20px]" v-html="data.replyBody"></div>
      </div>

      <!-- errors and warnings -->
      <div v-if="data.status.toLowerCase() !== 'approved' && showReply">
        <div v-if="data.warnings && data.warnings?.length > 0">
          <Divider />
          <div class="text-[110%] font-bold mb-[20px]">Flagged reasons:</div>
          <div class="flex flex-col gap-2.5">
            <ol>
              <li v-for="(i, idx) in data.warnings" :key="idx">
                {{ i }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { ReviewDashboard } from "~/types/review";
const props = withDefaults(
  defineProps<{
    data: ReviewDashboard;
    showReply: boolean;
    isProfile?: boolean;
  }>(),
  {
    isProfile: false,
  },
);

const initials = getInitials(props.data.email);

const images = ref();

const displayedImages = computed(() =>
  props.data.photoUrls ? props.data.photoUrls.slice(0, 4) : [],
);

const remainingImages = computed(() =>
  props.data.photoUrls ? props.data.photoUrls.length - 4 : 0,
);

const showOverlay = computed(() =>
  props.data.photoUrls
    ? props.data.photoUrls.length > 4
      ? true
      : false
    : false,
);

onBeforeMount(() => {
  if (props.data.photoUrls && props.data.photoUrls.length > 0) {
    images.value = props.data.photoUrls;
  }
});
</script>
