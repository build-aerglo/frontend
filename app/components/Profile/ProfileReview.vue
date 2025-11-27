<template>
  <div class="card p-6 bg-white rounded-lg shadow">
    <!-- Rating Summary only shown if on 'review' tab -->
    <div v-if="isReviewTab" class="bg-green-50 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-4">
        <div class="text-center">
          <div class="text-4xl font-bold text-gray-900">{{ businessData.rating }}</div>
          <div class="flex">
            <Star
              v-for="n in 5"
              :key="n"
              :value="businessData.rating - (n - 1)"
              :color-level="Math.ceil(businessData.rating)"
              class="w-4 h-4"
            />
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ businessData.reviewCount }} reviews</p>
        </div>
        <div class="flex-1 space-y-1">
          <div v-for="star in [5,4,3,2,1]" :key="star" class="flex items-center gap-2">
            <span class="text-sm text-gray-600 w-8">{{ star }}★</span>
            <div class="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                class="bg-gold h-2 rounded-full" 
                :style="{ width: `${getStarPercentage(star)}%` }"
              ></div>
            </div>
            <span class="text-sm text-gray-600 w-12">{{ getStarCount(star) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="props.limit" class="flex justify-between items-center mb-4">
      <span class="text-[130%] font-semibold text-contrast">Recent Reviews</span>
      <NuxtLink 
        :to="{ path: $route.path, query: { tab: 'review' } }"
        class="text-xs !text-link hover:underline transition"
      >
        See All
      </NuxtLink>
    </div>

    <div class="flex flex-col gap-4">
      <div 
        v-for="(review, index) in limitedReviews" 
        :key="review.id"
        class="border-b pb-4"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <i class="pi pi-user text-gray-500 text-lg"></i>
            </div>
            <span class="font-medium text-gray-800">{{ review.name }}</span>
          </div>
          <span class="text-xs text-gray-500">{{ review.date }}</span>
        </div>

        <div class="pl-12 flex flex-col gap-2 mb-2">
          <div class="flex">
            <Star
              v-for="n in 5"
              :key="n"
              :filled="n <= review.rating"
              :colorLevel="n <= review.rating ? review.rating : 0"
              class="w-6 h-6"
            />
          </div>
          <p class="text-sm text-gray-700 leading-relaxed">
            {{ review.comment }}
          </p>
        </div>

        <!-- Replies -->
        <div class="pl-12 mb-2">
          <div v-if="replies[review.id]" class="mb-2">
            <strong>Your reply:</strong>
            <p class="text-gray-600">{{ replies[review.id] }}</p>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="pl-12 flex gap-4 text-sm">
          <button
            class="text-blue-600 hover:underline"
            @click="toggleReplyForm(review.id)"
          >
            {{ replyFormVisible[review.id] ? 'Cancel' : 'Reply' }}
          </button>

          <button
            :class="flaggedReviews.has(review.id) ? 'text-red-600 font-semibold' : 'text-gray-600 hover:text-red-600'"
            @click="toggleFlag(review.id)"
          >
            {{ flaggedReviews.has(review.id) ? 'Flagged' : 'Flag' }}
          </button>
        </div>

        <!-- Reply form -->
        <div v-if="replyFormVisible[review.id]" class="pl-12 mt-2">
          <textarea
            v-model="replyInputs[review.id]"
            placeholder="Reply Review..."
            rows="3"
            class="w-full p-2 border rounded"
          ></textarea>
          <button
            class="mt-2 px-4 py-1 bg-[#008253] text-white rounded hover:bg-[#008253] disabled:opacity-50"
            :disabled="!replyInputs[review.id]?.trim()"
            @click="submitReply(review.id)"
          >
            Post Reply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import Star from '~/components/Stars.vue'
import { useBusinessData } from '@/composables/useBusinessSampleData'

const { 
  businessData,  
} = useBusinessData()


// Review interface
interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

// Props with limit (optional)
const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 0 })

// Static reviews
const reviews: Review[] = [
  { id: 1, name: 'Emily R.', rating: 5, date: '2025-11-08', comment: 'The best coffee in town! Fast service and the pastries are always fresh.' },
  { id: 2, name: 'Alex S.', rating: 4, date: '2025-11-06', comment: 'Great atmosphere for working. Strong Wi-Fi.' },
  { id: 3, name: 'Chloe G.', rating: 5, date: '2025-11-04', comment: 'Absolutely love the outdoor seating area. Perfect spot for a sunny afternoon.' },
  { id: 4, name: 'Ben K.', rating: 3, date: '2025-11-02', comment: 'Coffee was good, but service was a bit slow today.' },
  { id: 5, name: 'Mia D.', rating: 5, date: '2025-10-30', comment: 'Best place to relax and enjoy a book.' },
  { id: 6, name: 'Emma D.', rating: 2, date: '2025-10-30', comment: 'Worse place ever!' },
]

// Limited reviews computed
const limitedReviews = computed(() =>
  props.limit && props.limit > 0 ? reviews.slice(0, props.limit) : reviews
)

// Reactive state to track which reply forms are open
const replyFormVisible = reactive<Record<number, boolean>>({})

// Reactive to hold the reply inputs keyed by review id
const replyInputs = reactive<Record<number, string>>({})

// Reactive to hold submitted replies keyed by review id
const replies = reactive<Record<number, string>>({})

// Reactive set to hold flagged review ids
const flaggedReviews = ref(new Set<number>())

// Toggles reply form visibility per review
function toggleReplyForm(id: number) {
  replyFormVisible[id] = !replyFormVisible[id]
  if (!replyFormVisible[id]) {
    replyInputs[id] = ''  // clear input on cancel
  }
}

// Submit a reply for a given review id
function submitReply(id: number) {
  if (replyInputs[id]?.trim()) {
    replies[id] = replyInputs[id].trim()
    replyInputs[id] = ''
    replyFormVisible[id] = false
  }
}

// Toggle flagged state for a review
function toggleFlag(id: number) {
  if (flaggedReviews.value.has(id)) {
    flaggedReviews.value.delete(id)
  } else {
    flaggedReviews.value.add(id)
  }
}

// Route for tab detection
const route = useRoute()
const isReviewTab = computed(() => route.query.tab === 'review')


// Calculate percentage of each star count for the bar widths
function getStarPercentage(star: number): number {
  const counts = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1
    return acc
  }, {} as Record<number, number>)
  const total = reviews.length
  return ((counts[star] || 0) / total) * 100
}

// Get count of reviews with given star rating
function getStarCount(star: number): number {
  const counts = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1
    return acc
  }, {} as Record<number, number>)
  return counts[star] || 0
}
</script>
