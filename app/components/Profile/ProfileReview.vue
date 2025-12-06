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

    <!-- Filter Section -->
    <div v-if="!props.limit" class="mb-6 flex flex-wrap gap-4 items-center">
      <div>
        <label class="text-sm font-medium text-gray-700 mr-2">Filter by rating:</label>
        <select 
          v-model="filterRating" 
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008253]"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>
      
      <div>
        <label class="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
        <select 
          v-model="sortOrder" 
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008253]"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div 
        v-for="(review, index) in filteredAndSortedReviews" 
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
              class="w-5 h-5"
            />
          </div>
          <p class="text-sm text-gray-700 leading-relaxed">
            {{ review.comment }}
          </p>
          
          <!-- Helpful and Flag Actions -->
          <div class="flex items-center gap-4 mt-1">
            <button 
              @click="toggleHelpful(review.id)"
              class="flex items-center gap-1.5 text-sm transition-colors hover:text-[#008253]"
              :class="helpfulReviews.has(review.id) ? 'text-[#008253] font-medium' : 'text-gray-700'"
            >
              <i class="pi pi-thumbs-up"></i>
              <span>Helpful ({{ getHelpfulCount(review.id) }})</span>
            </button>
            
            <button 
              @click="toggleFlag(review.id)"
              class="flex items-center gap-1.5 text-sm transition-colors hover:text-red-600"
              :class="flaggedReviews.has(review.id) ? 'text-red-600 font-medium' : 'text-gray-700'"
            >
              <i class="pi pi-flag"></i>
              <span>{{ flaggedReviews.has(review.id) ? 'Flagged' : 'Flag' }}</span>
            </button>
          </div>
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
  helpfulCount?: number;
}

// Props with limit (optional)
const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 0 })

// Static reviews
const reviews: Review[] = [
  { id: 1, name: 'Emily R.', rating: 5, date: '2025-11-08', comment: 'The best coffee in town! Fast service and the pastries are always fresh.', helpfulCount: 12 },
  { id: 2, name: 'Alex S.', rating: 4, date: '2025-11-06', comment: 'Great atmosphere for working. Strong Wi-Fi.', helpfulCount: 8 },
  { id: 3, name: 'Chloe G.', rating: 5, date: '2025-11-04', comment: 'Absolutely love the outdoor seating area. Perfect spot for a sunny afternoon.', helpfulCount: 15 },
  { id: 4, name: 'Ben K.', rating: 3, date: '2025-11-02', comment: 'Coffee was good, but service was a bit slow today.', helpfulCount: 3 },
  { id: 5, name: 'Mia D.', rating: 5, date: '2025-10-30', comment: 'Best place to relax and enjoy a book.', helpfulCount: 20 },
  { id: 6, name: 'Emma D.', rating: 2, date: '2025-10-30', comment: 'Worse place ever!', helpfulCount: 1 },
]

// Filter and sort state
const filterRating = ref<string>('all')
const sortOrder = ref<string>('newest')
const showFlaggedOnly = ref(false)

// Filtered and sorted reviews
const filteredAndSortedReviews = computed(() => {
  let filtered = props.limit && props.limit > 0 ? reviews.slice(0, props.limit) : [...reviews]
  
  // Apply rating filter
  if (filterRating.value !== 'all') {
    const rating = parseInt(filterRating.value)
    filtered = filtered.filter(r => r.rating === rating)
  }
  
  // Apply flagged filter
  if (showFlaggedOnly.value) {
    filtered = filtered.filter(r => flaggedReviews.value.has(r.id))
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortOrder.value) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })
  
  return filtered
})

// Reactive state to track which reply forms are open
const replyFormVisible = reactive<Record<number, boolean>>({})

// Reactive to hold the reply inputs keyed by review id
const replyInputs = reactive<Record<number, string>>({})

// Reactive to hold submitted replies keyed by review id
const replies = reactive<Record<number, string>>({})

// Reactive set to hold flagged review ids
const flaggedReviews = ref(new Set<number>())

// Reactive set to hold helpful review ids (reviews the user found helpful)
const helpfulReviews = ref(new Set<number>())

// Reactive object to track additional helpful counts per review
const additionalHelpfulCounts = reactive<Record<number, number>>({})

// Toggles reply form visibility per review
function toggleReplyForm(id: number) {
  replyFormVisible[id] = !replyFormVisible[id]
  if (!replyFormVisible[id]) {
    replyInputs[id] = ''  // clear input on cancel
  } else if (replies[id]) {
    // If editing, pre-fill with existing reply
    replyInputs[id] = replies[id]
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

// Edit an existing reply
function editReply(id: number) {
  replyInputs[id] = replies[id]??''
  replyFormVisible[id] = true
}

// Delete a reply
function deleteReply(id: number) {
  if (confirm('Are you sure you want to delete this reply?')) {
    delete replies[id]
    delete replyInputs[id]
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

// Toggle helpful state for a review
function toggleHelpful(id: number) {
  if (helpfulReviews.value.has(id)) {
    helpfulReviews.value.delete(id)
    additionalHelpfulCounts[id] = (additionalHelpfulCounts[id] || 0) - 1
  } else {
    helpfulReviews.value.add(id)
    additionalHelpfulCounts[id] = (additionalHelpfulCounts[id] || 0) + 1
  }
}

// Get the total helpful count for a review
function getHelpfulCount(id: number): number {
  const review = reviews.find(r => r.id === id)
  const baseCount = review?.helpfulCount || 0
  const additionalCount = additionalHelpfulCounts[id] || 0
  return baseCount + additionalCount
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