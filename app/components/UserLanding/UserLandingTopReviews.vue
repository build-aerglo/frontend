<template>
  <Card class="section-mg p-[20px]" v-if="reviews.length > 0">
    <template #content>
      <div class="mb-[20px] flex justify-between">
        <div class="text-3xl font-bold">Recent Reviews</div>
        <div class="flex gap-2">
          <button
            class="pi pi-chevron-left rounded-full p-[10px] hover:bg-primary cursor-pointer bg-light"
            :disabled="isPrevDisabled"
            @click="review_prev"
          >
            <i></i>
          </button>
          <button
            class="pi pi-chevron-right rounded-full p-[10px] hover:bg-primary cursor-pointer bg-light"
            :disabled="isNextDisabled"
            @click="review_next"
          >
            <i></i>
          </button>
        </div>
      </div>
      <div class="mx-[-10px]">
        <Carousel
          v-model:page="review_page"
          :value="groupedCategories"
          :numVisible="1"
          :numScroll="1"
          :showNavigators="false"
          :autoplayInterval="4000"
          circular
          :showIndicators="false"
        >
          <template #item="slotProps">
            <div class="grid-container">
              <div
                v-for="item in slotProps.data"
                :key="item.id"
                class="grid-item"
              >
                <ReviewForLandingPage :data="item" />
              </div>
            </div>
          </template>
        </Carousel>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { ReviewSummary } from "~/types/review";
import useSocketInstances from "~/composables/websocket/useSocketInstances";

const { useRecentReviewsSocket } = useSocketInstances();
const connection = useRecentReviewsSocket();

const reviews = ref<ReviewSummary[]>([]);

const review_page = ref(0);
const numPages = computed(() => {
  return Math.ceil(reviews.value.length / 2); // 2 = numVisible
});

const isPrevDisabled = computed(() => review_page.value <= 0);
const isNextDisabled = computed(() => review_page.value >= numPages.value - 1);

const review_next = () => {
  if (review_page.value < numPages.value - 1) review_page.value++;
};

const review_prev = () => {
  if (review_page.value > 0) review_page.value--;
};

const groupedCategories = computed(() => {
  const groups = [];
  for (let i = 0; i < reviews.value.length; i += 4) {
    groups.push(reviews.value.slice(i, i + 4));
  }
  return groups;
});

connection.on("ReceiveTopReviews", async (reviews) => {
  console.log("fetched reviews");
  await $fetch("/api/page", {
    method: "POST",
    body: {
      key: "recentReviews",
      data: reviews,
    },
  });
});

connection.onclose(() => console.log("WebSocket disconnected"));
connection.onreconnected(() => console.log("WebSocket reconnected"));

onMounted(async () => {
  try {
    console.log("WebSocket connected");
    const res = await $fetch("/api/page?key=recentReviews", {
      method: "GET",
    });
    if (res.recentReviews) {
      reviews.value = res.recentReviews;
    }

    // start
    await connection.start();
  } catch (err) {
    console.error("Connection failed:", err);
  }
});

onUnmounted(async () => {
  await connection.stop();
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 items per row on desktop */
  gap: 1rem;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr; /* 1 item per row on mobile */
  }
}
button:disabled {
  cursor: not-allowed;
}
</style>
