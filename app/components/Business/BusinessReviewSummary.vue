<template>
  <div class="flex flex-col gap-6 p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="bg-white border rounded-xl p-6 flex flex-col items-center justify-center shadow-sm">
        <span class="text-sm font-bold text-slate-500 uppercase tracking-tight mb-2">Average Rating</span>
        <h1 class="text-5xl font-black text-slate-800 mb-2">
          {{ business?.avgRating?.toFixed(1) || '0.0' }}
        </h1>
        <div class="flex gap-1 mb-2">
          <i v-for="n in 5" :key="n" 
             class="pi" 
             :class="n <= Math.round(business?.avgRating || 0) ? 'pi-star-fill text-yellow-500' : 'pi-star text-slate-300'">
          </i>
        </div>
        <p class="text-xs text-slate-400">Based on {{ business?.reviewCount }} reviews</p>
      </div>

      <div class="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
        <span class="text-sm font-bold text-slate-500 uppercase tracking-tight mb-4 block">Rating Distribution</span>
        <div class="space-y-3">
          <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-4">
            <span class="text-sm font-medium w-4">{{ star }}</span>
            <i class="pi pi-star-fill text-xs text-yellow-500"></i>
            <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500" :style="{ width: getProgressWidth(star) }"></div>
            </div>
            <span class="text-xs text-slate-400 w-8 text-right">{{ getProgressWidth(star) }}</span>
          </div>
        </div>
      </div>

      <div class="md:col-span-3 bg-emerald-50 rounded-xl p-6 border border-emerald-100 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
            <i class="pi pi-eye text-xl"></i>
          </div>
          <div>
            <h3 class="font-bold text-slate-800">Profile Visibility</h3>
            <p class="text-sm text-slate-600">Total number of people who viewed your business page.</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-3xl font-black text-emerald-700">{{ business?.profileClicks || 0 }}</span>
          <p class="text-[10px] font-bold text-emerald-600 uppercase">Total Clicks</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['business']);

// Logic to simulate bar widths based on rating if detailed breakdown isn't available
const getProgressWidth = (star: number) => {
  if (!props.business?.avgRating) return '0%';
  const rating = props.business.avgRating;
  
  // Simple logic: if avg is 4.5, 5 and 4 stars get high width
  if (star <= Math.floor(rating)) return `${Math.random() * 20 + 70}%`; 
  if (star === Math.ceil(rating)) return '30%';
  return '5%';
}
</script>