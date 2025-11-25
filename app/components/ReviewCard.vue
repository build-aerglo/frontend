<template>
  <div class="flex items-start gap-3">
    <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
      {{ review.author.charAt(0) }}
    </div>
    <div class="flex-1">
      <div class="flex items-center justify-between mb-1">
        <p class="font-semibold text-gray-900">{{ review.author }}</p>
        <span class="text-sm text-gray-500">{{ review.date }}</span>
      </div>
      <div class="flex mb-2">
        <i
          v-for="n in 5"
          :key="n"
          :class="['pi', n <= review.rating ? 'pi-star-fill' : 'pi-star', 'text-gold']"
        ></i>
      </div>
      <p class="text-gray-700 mb-3">{{ review.body }}</p>
      
      <div v-if="review.response" class="bg-green-50 border-l-4 border-[#008253] p-3 mb-3">
        <p class="text-sm font-semibold text-gray-900 mb-1">Response from owner:</p>
        <p class="text-sm text-gray-700">{{ review.response }}</p>
      </div>

      <div class="flex items-center gap-4 text-sm">
        <button class="text-gray-600 hover:text-[#008253] flex items-center gap-1">
          <i class="pi pi-thumbs-up"></i>
          <span>Helpful ({{ review.helpful }})</span>
        </button>
        
        <template v-if="viewMode === 'owner'">
          <button 
            @click="$emit('respond', review)"
            class="text-gray-600 hover:text-[#008253] flex items-center gap-1"
          >
            <i class="pi pi-reply"></i>
            <span>{{ review.response ? 'Edit Response' : 'Respond' }}</span>
          </button>
          <button 
            @click="$emit('flag', review.id)"
            :class="[
              'flex items-center gap-1',
              review.flagged ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
            ]"
          >
            <i class="pi pi-flag"></i>
            <span>{{ review.flagged ? 'Flagged' : 'Flag' }}</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  review: any
  viewMode: string
  showFull?: boolean
}>()

defineEmits<{
  respond: [review: any]
  flag: [reviewId: number]
}>()
</script>
```

Then import and use it in the main component by adding:
```typescript
import ReviewCard from '~/components/ReviewCard.vue'
```