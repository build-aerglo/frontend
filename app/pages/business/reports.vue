<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Reports</h1>
            <p class="text-sm text-[#008253] mt-0.5">Track your business performance and review analytics</p>
          </div>
          <div class="flex items-right">
            <button class="px-4 py-2 bg-[#008253] text-white text-sm font-medium rounded-lg hover:bg-[#006b44] transition-colors flex items-center gap-2">
              <i class="pi pi-download text-sm"></i>
              Export
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-6">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-gray-600">Total Reviews</span>
            <div class="w-8 h-8 bg-[#008253]/10 rounded-lg flex items-center justify-center">
              <i class="pi pi-star-fill text-[#008253] text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-semibold text-gray-900 mb-1">1,247</div>
          <div class="flex items-center gap-1 text-xs">
            <i class="pi pi-arrow-up text-[#008253]"></i>
            <span class="text-[#008253] font-medium">12.5%</span>
            <span class="text-gray-500">vs last period</span>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-gray-600">Average Rating</span>
            <div class="w-8 h-8 bg-[#008253]/10 rounded-lg flex items-center justify-center">
              <i class="pi pi-chart-line text-[#008253] text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-semibold text-gray-900 mb-1">4.6</div>
          <div class="flex items-center gap-1 text-xs">
            <i class="pi pi-arrow-up text-[#008253]"></i>
            <span class="text-[#008253] font-medium">0.3</span>
            <span class="text-gray-500">vs last period</span>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-gray-600">Response Rate</span>
            <div class="w-8 h-8 bg-[#008253]/10 rounded-lg flex items-center justify-center">
              <i class="pi pi-comment text-[#008253] text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-semibold text-gray-900 mb-1">87%</div>
          <div class="flex items-center gap-1 text-xs">
            <i class="pi pi-arrow-up text-[#008253]"></i>
            <span class="text-[#008253] font-medium">5.2%</span>
            <span class="text-gray-500">vs last period</span>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-gray-600">Profile Views</span>
            <div class="w-8 h-8 bg-[#008253]/10 rounded-lg flex items-center justify-center">
              <i class="pi pi-eye text-[#008253] text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-semibold text-gray-900 mb-1">8,432</div>
          <div class="flex items-center gap-1 text-xs">
            <i class="pi pi-arrow-up text-[#008253]"></i>
            <span class="text-[#008253] font-medium">18.7%</span>
            <span class="text-gray-500">vs last period</span>
          </div>
        </div>
      </div> 
      </div>

      <!-- Response Time Analysis -->

      <div class="bg-white rounded-lg border border-gray-200 mt-1">
        <div class="p-5 border-b border-gray-200">
          <h3 class="text-sm font-semibold text-gray-900">Response Time Analysis</h3>
        </div>
        <div class="p-5">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="text-3xl font-semibold text-gray-900 mb-1">2.4h</div>
              <div class="text-sm text-gray-600">Average Response Time</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-semibold text-gray-900 mb-1">87%</div>
              <div class="text-sm text-gray-600">Within 24 Hours</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-semibold text-gray-900 mb-1">45min</div>
              <div class="text-sm text-gray-600">Fastest Response</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-semibold text-gray-900 mb-1">143</div>
              <div class="text-sm text-gray-600">Total Responses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
</template>

<script setup lang="ts">

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

interface Review {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
}

interface TopPerformingItem {
  id: number;
  name: string;
  rating: number;
  reviews: number;
}
definePageMeta({ layout: 'business' })
</script>

