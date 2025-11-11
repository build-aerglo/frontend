<template>
  <div class="card p-6 bg-white rounded-lg shadow">
    
    <div class="mb-6 border-b pb-4 border-gray-200">
      <h2 class="text-xl font-bold text-contrast mb-1">Review Summary</h2>
      <p class="text-sm text-gray-600">
        Snapshot of customer feedback and overall business rating.
      </p>
    </div>

    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-contrast">Recent Reviews</h3>
      <NuxtLink 
        :to="{ path: $route.path, query: { tab: 'review' } }"
        class="text-sm text-primary hover:text-blue-700 transition"
      >
        See All
      </NuxtLink>
    </div>

    <div class="flex flex-col gap-4">
      <div 
        v-for="(review, index) in limitedReviews" 
        :key="review.id"
      >
        <div class="flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <i class="pi pi-user text-gray-500 text-lg"></i>
              </div>
              <span class="font-medium text-gray-800">{{ review.name }}</span>
            </div>
            <span class="text-xs text-gray-500">{{ review.date }}</span>
          </div>
          <div class="pl-12 flex flex-col gap-2">
            <Rating
              :modelValue="review.rating"
              :stars="5"
              readonly
              style="--p-rating-icon-size: 16px;"
              :ptOptions="{ mergeProps: true }"
              :pt="{
                onIcon: { class: '!text-gold' },
                offIcon: { class: '!text-gray-500' }
              }"
            />
            <p class="text-sm text-gray-700 leading-relaxed">
              {{ review.comment }}
            </p>
          </div>
        </div>

        <hr v-if="index < limitedReviews.length - 1" class="my-4 border-gray-200" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// Assuming Rating component is available

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

const props = withDefaults(defineProps<{
    // New prop to limit the number of reviews shown
    limit?: number; 
}>(), {
    limit: 0, // 0 means show all (no limit)
});

// Full Review Data (can be loaded via API later)
const reviews: Review[] = [
  { id: 1, name: 'Emily R.', rating: 5, date: '2025-11-08', comment: 'The best coffee in town! Fast service and the pastries are always fresh.' },
  { id: 2, name: 'Alex S.', rating: 4, date: '2025-11-06', comment: 'Great atmosphere for working. Strong Wi-Fi.' },
  { id: 3, name: 'Chloe G.', rating: 5, date: '2025-11-04', comment: 'Absolutely love the outdoor seating area. Perfect spot for a sunny afternoon.' },
  { id: 4, name: 'Ben K.', rating: 3, date: '2025-11-02', comment: 'Coffee was good, but service was a bit slow today.' },
  { id: 5, name: 'Mia D.', rating: 5, date: '2025-10-30', comment: 'Best place to relax and enjoy a book.' },
];

// Computed property to apply the limit
const limitedReviews = computed(() => {
    if (props.limit > 0) {
        return reviews.slice(0, props.limit);
    }
    return reviews; 
});
</script>