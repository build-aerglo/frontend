<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Enhanced Navbar -->
    <nav class="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Left: Dashboard Title & Menu Toggle -->
          <div class="flex items-center gap-4">
            <span class="text-[#008253] text-xl font-bold">Dashboard</span>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-2 sm:gap-3">
            <button 
              class="p-2 rounded-lg hover:bg-gray-100 transition relative"
              title="Notifications"
            >
              <i class="pi pi-bell text-xl text-gray-600"></i>
              <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              @click="handleSignOut"
              class="px-3 sm:px-4 py-2 text-[#008253] hover:bg-green-50 rounded-lg transition font-medium flex items-center gap-2"
            >
              <i class="pi pi-sign-out"></i>
              <span class="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div 
          v-if="mobileMenuOpen"
          class="lg:hidden py-4 border-t border-gray-200"
        >
          <div class="space-y-2">
            <a href="#insights" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
              <i class="pi pi-chart-bar text-[#008253]"></i>
              <span class="font-medium">Insights</span>
            </a>
            <a href="#performance" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
              <i class="pi pi-chart-line text-[#008253]"></i>
              <span class="font-medium">Performance</span>
            </a>
            <a href="#benchmarking" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
              <i class="pi pi-sitemap text-[#008253]"></i>
              <span class="font-medium">Benchmarking</span>
            </a>
            <a href="#suggestions" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
              <i class="pi pi-lightbulb text-[#deae29]"></i>
              <span class="font-medium">Suggestions</span>
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
      <!-- Business Info Header -->
      <div class="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-100">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div class="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
            <div class="relative">
              <img 
                :src="businessInfo.image"
                :alt="businessInfo.name"
                class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md ring-4 ring-white"
                @error="handleImageError"
              />
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-[#008253] rounded-full flex items-center justify-center">
                <i class="pi pi-check text-white text-xs"></i>
              </div>
            </div>
            <div class="flex-1 sm:flex-none">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{{ businessInfo.name }}</h1>
              <p class="text-sm sm:text-base text-gray-600 font-medium">{{ businessInfo.category }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 bg-gradient-to-br from-[#008253] via-[#007549] to-[#006640] rounded-2xl p-5 sm:p-6 text-white shadow-xl w-full sm:w-auto justify-center sm:justify-start relative overflow-hidden">
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div class="text-center relative z-10">
              <div class="text-3xl sm:text-4xl font-black mb-1">{{ businessInfo.averageRating }}</div>
              <div class="flex items-center justify-center gap-1 mb-2">
                <i 
                  v-for="n in 5" 
                  :key="n" 
                  :class="[
                    'pi text-sm sm:text-base',
                    n <= Math.floor(businessInfo.averageRating) ? 'pi-star-fill text-[#deae29]' : 'pi-star text-white/30'
                  ]"
                ></i>
              </div>
              <p class="text-xs sm:text-sm opacity-90 font-medium">{{ businessInfo.totalReviews }} reviews</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sentiment Insights Section -->
      <div id="insights" class="mb-8 sm:mb-10">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#008253] to-[#006640] rounded-xl flex items-center justify-center shadow-lg">
              <i class="pi pi-chart-bar text-white text-lg sm:text-xl"></i>
            </div>
            Sentiment Insights
          </h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
          <!-- Positive Word Cloud -->
          <div class="bg-gradient-to-br from-white to-green-50/30 rounded-3xl shadow-lg p-5 sm:p-7 hover:shadow-2xl transition-all duration-300 border border-green-100">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
              <i class="pi pi-thumbs-up text-green-600 text-xl"></i>
              Positive Keywords
            </h3>
            <div class="flex flex-wrap gap-3 justify-center p-8 sm:p-12 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-2xl min-h-[180px] sm:min-h-[220px] items-center shadow-inner">
              <span 
                v-for="(word, idx) in positiveWords" 
                :key="idx"
                :style="{ fontSize: `${word.size * 0.85}px` }"
                class="font-black text-green-700 hover:text-green-900 cursor-pointer transition-all hover:scale-125 drop-shadow-sm"
              >
                {{ word.text }}
              </span>
            </div>
          </div>

          <!-- Negative Word Cloud -->
          <div class="bg-gradient-to-br from-white to-red-50/30 rounded-3xl shadow-lg p-5 sm:p-7 hover:shadow-2xl transition-all duration-300 border border-red-100">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
              <i class="pi pi-thumbs-down text-red-600 text-xl"></i>
              Negative Keywords
            </h3>
            <div class="flex flex-wrap gap-3 justify-center p-8 sm:p-12 bg-gradient-to-br from-red-50 via-rose-50 to-red-100 rounded-2xl min-h-[180px] sm:min-h-[220px] items-center shadow-inner">
              <span 
                v-for="(word, idx) in negativeWords" 
                :key="idx"
                :style="{ fontSize: `${word.size * 0.85}px` }"
                class="font-black text-red-700 hover:text-red-900 cursor-pointer transition-all hover:scale-125 drop-shadow-sm"
              >
                {{ word.text }}
              </span>
            </div>
          </div>
        </div>

        <!-- Sentiment Bar Chart -->
        <div class="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">Sentiment Distribution</h3>
          <div class="space-y-5">
            <div>
              <div class="flex justify-between mb-3">
                <span class="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                  <i class="pi pi-thumbs-up text-green-600"></i>
                  Positive
                </span>
                <span class="text-sm sm:text-base font-black text-gray-900">{{ sentimentData.positive }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4 sm:h-5 overflow-hidden shadow-inner">
                <div 
                  class="bg-gradient-to-r from-green-500 via-green-600 to-green-700 h-full rounded-full transition-all duration-1000 ease-out shadow-md"
                  :style="{ width: `${sentimentData.positive}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-3">
                <span class="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                  <i class="pi pi-minus-circle text-gray-600"></i>
                  Neutral
                </span>
                <span class="text-sm sm:text-base font-black text-gray-900">{{ sentimentData.neutral }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4 sm:h-5 overflow-hidden shadow-inner">
                <div 
                  class="bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 h-full rounded-full transition-all duration-1000 ease-out shadow-md"
                  :style="{ width: `${sentimentData.neutral}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-3">
                <span class="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                  <i class="pi pi-thumbs-down text-red-600"></i>
                  Negative
                </span>
                <span class="text-sm sm:text-base font-black text-gray-900">{{ sentimentData.negative }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4 sm:h-5 overflow-hidden shadow-inner">
                <div 
                  class="bg-gradient-to-r from-red-500 via-red-600 to-red-700 h-full rounded-full transition-all duration-1000 ease-out shadow-md"
                  :style="{ width: `${sentimentData.negative}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Insights Section -->
      <div id="performance" class="mb-8 sm:mb-10">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#008253] to-[#006640] rounded-xl flex items-center justify-center shadow-lg">
              <i class="pi pi-chart-line text-white text-lg sm:text-xl"></i>
            </div>
            Performance Insights
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <!-- Average Ratings Over Time -->
          <div class="bg-gradient-to-br from-white to-green-50/30 rounded-3xl shadow-lg p-5 sm:p-7 hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">Average Ratings Over Time</h3>
            <div class="space-y-4">
              <div 
                v-for="(point, idx) in ratingOverTime" 
                :key="idx"
                class="flex items-center gap-3"
              >
                <span class="text-xs sm:text-sm text-gray-600 w-20 sm:w-24 font-semibold">{{ point.label }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-8 sm:h-9 relative overflow-hidden shadow-inner">
                  <div 
                    class="bg-gradient-to-r from-[#008253] via-[#007549] to-[#006640] h-full rounded-full flex items-center justify-end pr-3 transition-all duration-1000 ease-out shadow-md"
                    :style="{ width: `${(point.rating??0 / 5) * 10}%` }"
                  >
                    <span class="text-xs font-black text-white drop-shadow">{{ point.rating }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Review Volume Over Time -->
          <div class="bg-gradient-to-br from-white to-amber-50/30 rounded-3xl shadow-lg p-5 sm:p-7 hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">Review Volume Over Time</h3>
            <div class="space-y-4">
              <div 
                v-for="(point, idx) in reviewVolume" 
                :key="idx"
                class="flex items-center gap-3"
              >
                <span class="text-xs sm:text-sm text-gray-600 w-20 sm:w-24 font-semibold">{{ point.label }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-8 sm:h-9 relative overflow-hidden shadow-inner">
                  <div 
                    class="bg-gradient-to-r from-[#deae29] via-[#d4a526] to-[#c99a1f] h-full rounded-full flex items-center justify-end pr-3 transition-all duration-1000 ease-out shadow-md"
                    :style="{ width: `${(point.count??0 / getMaxReviewCount()) * 0.8}%` }"
                  >
                    <span class="text-xs font-black text-gray-900 drop-shadow">{{ point.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Clicks Over Time -->
          <div class="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-lg p-5 sm:p-7 hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">Profile Clicks Over Time</h3>
            <div class="space-y-4">
              <div 
                v-for="(point, idx) in profileClicks" 
                :key="idx"
                class="flex items-center gap-3"
              >
                <span class="text-xs sm:text-sm text-gray-600 w-20 sm:w-24 font-semibold">{{ point.label }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-8 sm:h-9 relative overflow-hidden shadow-inner">
                  <div 
                    class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-1000 ease-out shadow-md"
                    :style="{ width: `${(point.clicks??0 / getMaxClicks()) * 0.3}%` }"
                  >
                    <span class="text-xs font-black text-white drop-shadow">{{ point.clicks }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Review Sources -->
          <div class="bg-gradient-to-br from-white to-purple-50/30 rounded-3xl shadow-lg p-5 sm:p-7 hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">Review Sources</h3>
            <div class="space-y-3">
              <div 
                v-for="(source, idx) in reviewSources" 
                :key="idx"
                class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div class="flex items-center gap-3">
                  <i :class="[source.icon, 'text-xl', source.color]"></i>
                  <span class="font-semibold text-gray-700 text-sm sm:text-base">{{ source.name }}</span>
                </div>
                <span class="text-sm sm:text-base font-black text-gray-900">{{ source.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Benchmarking Section -->
      <div id="benchmarking" class="mb-6 sm:mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <i class="pi pi-sitemap text-[#008253]"></i>
          Benchmarking
        </h2>

        <!-- Competitor Ratings Comparison -->
        <div class="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 hover:shadow-xl transition-shadow">
          <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Compare Average Ratings</h3>
          <div class="space-y-4">
            <div 
              v-for="(competitor, idx) in competitorRatings" 
              :key="idx"
              class="space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700 text-sm sm:text-base">{{ competitor.name }}</span>
                <span class="text-xs sm:text-sm font-bold text-gray-900">{{ competitor.rating }}/5</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-5 sm:h-6 overflow-hidden">
                <div 
                  :class="[
                    'h-full rounded-full flex items-center justify-center transition-all duration-1000 ease-out',
                    competitor.isYou ? 'bg-gradient-to-r from-[#008253] to-[#006640]' : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  ]"
                  :style="{ width: `${(competitor.rating / 5) * 100}%` }"
                >
                  <span v-if="competitor.isYou" class="text-xs font-bold text-white">You</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Competitor Word Cloud Comparison -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div class="bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Competitor Positive Keywords</h3>
            <div class="flex flex-wrap gap-2 justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl min-h-[150px] sm:min-h-[180px] items-center">
              <span 
                v-for="(word, idx) in competitorPositiveWords" 
                :key="idx"
                :style="{ fontSize: `${word.size * 0.75}px` }"
                class="font-bold text-green-600 hover:text-green-800 cursor-pointer transition-all hover:scale-110"
              >
                {{ word.text }}
              </span>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Competitor Negative Keywords</h3>
            <div class="flex flex-wrap gap-2 justify-center p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl min-h-[150px] sm:min-h-[180px] items-center">
              <span 
                v-for="(word, idx) in competitorNegativeWords" 
                :key="idx"
                :style="{ fontSize: `${word.size * 0.75}px` }"
                class="font-bold text-red-600 hover:text-red-800 cursor-pointer transition-all hover:scale-110"
              >
                {{ word.text }}
              </span>
            </div>
          </div>
        </div>

        <!-- 3-Month Comparison -->
        <div class="bg-white rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-xl transition-shadow">
          <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Rating Trend (Last 3 Months)</h3>
          <div class="grid grid-cols-3 gap-3 sm:gap-4">
            <div 
              v-for="(month, idx) in monthlyComparison" 
              :key="idx"
              class="text-center p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow"
            >
              <div class="text-xs sm:text-sm font-medium text-gray-600 mb-2">{{ month.month }}</div>
              <div class="text-2xl sm:text-3xl font-bold text-[#008253] mb-2">{{ month.rating }}</div>
              <div class="flex items-center justify-center gap-1 text-xs sm:text-sm">
                <i :class="[
                  'pi',
                  month.change > 0 ? 'pi-arrow-up text-green-600' : month.change < 0 ? 'pi-arrow-down text-red-600' : 'pi-minus text-gray-600'
                ]"></i>
                <span :class="[
                  'font-bold',
                  month.change > 0 ? 'text-green-600' : month.change < 0 ? 'text-red-600' : 'text-gray-600'
                ]">
                  {{ Math.abs(month.change) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Suggestions Section -->
      <div id="suggestions" class="mb-8 sm:mb-10">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#deae29] to-[#c99a1f] rounded-xl flex items-center justify-center shadow-lg">
              <i class="pi pi-lightbulb text-white text-lg sm:text-xl"></i>
            </div>
            Suggestions
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <!-- What Improved -->
          <div class="bg-gradient-to-br from-white to-green-50/30 rounded-3xl shadow-lg p-6 sm:p-8 border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6 flex items-center gap-2">
              <i class="pi pi-check-circle text-green-600 text-xl"></i>
              What Improved
            </h3>
            <ul class="space-y-4">
              <li 
                v-for="(item, idx) in improvements" 
                :key="idx"
                class="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-md transition-all"
              >
                <i class="pi pi-arrow-up text-green-600 mt-1 text-lg"></i>
                <div>
                  <p class="font-bold text-gray-900 text-sm sm:text-base mb-1">{{ item.title }}</p>
                  <p class="text-xs sm:text-sm text-gray-600">{{ item.description }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- What Needs Improvement -->
          <div class="bg-gradient-to-br from-white to-orange-50/30 rounded-3xl shadow-lg p-6 sm:p-8 border-l-4 border-orange-500 hover:shadow-2xl transition-all duration-300">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6 flex items-center gap-2">
              <i class="pi pi-exclamation-triangle text-orange-600 text-xl"></i>
              What Needs Improvement
            </h3>
            <ul class="space-y-4">
              <li 
                v-for="(item, idx) in needsImprovement" 
                :key="idx"
                class="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100 hover:shadow-md transition-all"
              >
                <i class="pi pi-arrow-down text-orange-600 mt-1 text-lg"></i>
                <div>
                  <p class="font-bold text-gray-900 text-sm sm:text-base mb-1">{{ item.title }}</p>
                  <p class="text-xs sm:text-sm text-gray-600 mb-2">{{ item.description }}</p>
                  <div class="flex items-start gap-2 p-3 bg-white rounded-xl border border-[#008253]/20">
                    <i class="pi pi-lightbulb text-[#deae29] mt-0.5 text-sm"></i>
                    <p class="text-xs sm:text-sm text-[#008253] font-semibold">{{ item.suggestion }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBusinessDashboard } from '@/composables/useBusinessDashboard'

const mobileMenuOpen = ref(false)

const {
  selectedPeriod,
  timePeriods,
  businessInfo,
  positiveWords,
  negativeWords,
  sentimentData,
  ratingOverTime,
  reviewVolume,
  profileClicks,
  reviewSources,
  competitorRatings,
  competitorPositiveWords,
  competitorNegativeWords,
  monthlyComparison,
  improvements,
  needsImprovement,
  handleSignOut,
  handleImageError,
  getMaxReviewCount,
  getMaxClicks
} = useBusinessDashboard()
</script>

<style scoped>
/* Smooth animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>