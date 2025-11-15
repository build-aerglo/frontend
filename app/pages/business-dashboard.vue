<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <span class="text-[#008253] text-xl font-semibold">Dashboard</span>
          <!-- Logo -->
            <img
              src="~/assets/images/e-user-logo.png"
              alt="Logo"
              class="h-10 w-auto object-contain"
            />
          <button 
            @click="handleSignOut"
            class="px-4 py-2 text-[#008253] hover:bg-green-50 rounded-lg transition font-medium flex items-center gap-1"
          >
            <i class="pi pi-sign-out"></i>
            <span class="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Business Info Header -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img 
              :src="businessInfo.image"
              :alt="businessInfo.name"
              class="w-16 h-16 rounded-lg object-cover"
              @error="handleImageError"
            />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ businessInfo.name }}</h1>
              <p class="text-gray-600">{{ businessInfo.category }}</p>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-[#008253]">{{ businessInfo.averageRating }}</div>
              <div class="flex items-center justify-center mt-1">
                <i 
                  v-for="n in 5" 
                  :key="n" 
                  :class="[
                    'pi text-sm',
                    n <= Math.floor(businessInfo.averageRating) ? 'pi-star-fill text-[#deae29]' : 'pi-star text-gray-300'
                  ]"
                ></i>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ businessInfo.totalReviews }} reviews</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Time Period Selector -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div class="flex flex-wrap gap-3">
          <button
            v-for="period in timePeriods"
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              selectedPeriod === period.value
                ? 'bg-[#008253] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ period.label }}
          </button>
        </div>
      </div>

      <!-- Sentiment Insights Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="pi pi-chart-bar text-[#008253]"></i>
          Sentiment Insights
        </h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Positive Word Cloud -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="pi pi-thumbs-up text-green-600"></i>
              Positive Keywords
            </h3>
            <div class="flex flex-wrap gap-2 justify-center p-10 bg-green-50 rounded-[50%] min-h-[200px] items-center">
              <span 
                v-for="(word, idx) in positiveWords" 
                :key="idx"
                :style="{ fontSize: `${word.size}px` }"
                class="font-semibold text-green-700 hover:text-green-900 cursor-pointer transition"
              >
                {{ word.text }}
              </span>
            </div>
          </div>

          <!-- Negative Word Cloud -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="pi pi-thumbs-down text-red-600"></i>
              Negative Keywords
            </h3>
            <div class="flex flex-wrap gap-2 justify-center p-10 bg-red-50 rounded-[50%] min-h-[200px] items-center">
              <span 
                v-for="(word, idx) in negativeWords" 
                :key="idx"
                :style="{ fontSize: `${word.size}px` }"
                class="font-semibold text-red-700 hover:text-red-900 cursor-pointer transition"
              >
                {{ word.text }}
              </span>
            </div>
          </div>
        </div>

        <!-- Sentiment Bar Chart -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Sentiment Distribution</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <i class="pi pi-thumbs-up text-green-600"></i>
                  Positive
                </span>
                <span class="text-sm font-semibold text-gray-900">{{ sentimentData.positive }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div 
                  class="bg-green-600 h-4 rounded-full transition-all duration-500"
                  :style="{ width: `${sentimentData.positive}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <i class="pi pi-minus-circle text-gray-600"></i>
                  Neutral
                </span>
                <span class="text-sm font-semibold text-gray-900">{{ sentimentData.neutral }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div 
                  class="bg-gray-600 h-4 rounded-full transition-all duration-500"
                  :style="{ width: `${sentimentData.neutral}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <i class="pi pi-thumbs-down text-red-600"></i>
                  Negative
                </span>
                <span class="text-sm font-semibold text-gray-900">{{ sentimentData.negative }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div 
                  class="bg-red-600 h-4 rounded-full transition-all duration-500"
                  :style="{ width: `${sentimentData.negative}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Insights Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="pi pi-chart-line text-[#008253]"></i>
          Performance Insights
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Average Ratings Over Time -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Average Ratings Over Time</h3>
            <div class="space-y-2">
              <div 
                v-for="(point, idx) in ratingOverTime" 
                :key="idx"
                class="flex items-center gap-3"
              >
                <span class="text-sm text-gray-600 w-24">{{ point.label }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div 
                    class="bg-[#008253] h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    :style="{ width: `${(point.rating??0 / 5) * 20}%` }"
                  >
                    <span class="text-xs font-semibold text-white">{{ point.rating }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Review Volume Over Time -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Review Volume Over Time</h3>
            <div class="space-y-2">
              <div 
                v-for="(point, idx) in reviewVolume" 
                :key="idx"
                class="flex items-center gap-3"
              >
                <span class="text-sm text-gray-600 w-24">{{ point.label }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div 
                    class="bg-[#deae29] h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    :style="{ width: `${(point.count??0 / getMaxReviewCount()) * 1}%` }"
                  >
                    <span class="text-xs font-semibold text-gray-900">{{ point.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Clicks Over Time -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Profile Clicks Over Time</h3>
            <div class="space-y-2">
              <div 
                v-for="(point, idx) in profileClicks" 
                :key="idx"
                class="flex items-center gap-3"
              >
                <span class="text-sm text-gray-600 w-24">{{ point.label }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div 
                    class="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    :style="{ width: `${(point.clicks??0 / getMaxClicks()) * 0.3}%` }"
                  >
                    <span class="text-xs font-semibold text-white">{{ point.clicks }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Review Sources -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Review Sources</h3>
            <div class="space-y-3">
              <div 
                v-for="(source, idx) in reviewSources" 
                :key="idx"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <i :class="[source.icon, 'text-xl', source.color]"></i>
                  <span class="font-medium text-gray-700">{{ source.name }}</span>
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ source.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Benchmarking Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="pi pi-sitemap text-[#008253]"></i>
          Benchmarking
        </h2>

        <!-- Competitor Ratings Comparison -->
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Compare Average Ratings</h3>
          <div class="space-y-4">
            <div 
              v-for="(competitor, idx) in competitorRatings" 
              :key="idx"
              class="space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700">{{ competitor.name }}</span>
                <span class="text-sm font-semibold text-gray-900">{{ competitor.rating }}/5</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-6">
                <div 
                  :class="[
                    'h-6 rounded-full flex items-center justify-center transition-all duration-500',
                    competitor.isYou ? 'bg-[#008253]' : 'bg-gray-400'
                  ]"
                  :style="{ width: `${(competitor.rating / 5) * 100}%` }"
                >
                  <span v-if="competitor.isYou" class="text-xs font-semibold text-white">Your Business</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Competitor Word Cloud Comparison -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Competitor Positive Keywords</h3>
            <div class="flex flex-wrap gap-2 justify-center p-4 bg-green-50 rounded-lg min-h-[180px] items-center">
              <span 
                v-for="(word, idx) in competitorPositiveWords" 
                :key="idx"
                :style="{ fontSize: `${word.size}px` }"
                class="font-semibold text-green-600 hover:text-green-800 cursor-pointer transition"
              >
                {{ word.text }}
              </span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Competitor Negative Keywords</h3>
            <div class="flex flex-wrap gap-2 justify-center p-4 bg-red-50 rounded-lg min-h-[180px] items-center">
              <span 
                v-for="(word, idx) in competitorNegativeWords" 
                :key="idx"
                :style="{ fontSize: `${word.size}px` }"
                class="font-semibold text-red-600 hover:text-red-800 cursor-pointer transition"
              >
                {{ word.text }}
              </span>
            </div>
          </div>
        </div>

        <!-- 3-Month Comparison -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Rating Trend (Last 3 Months)</h3>
          <div class="grid grid-cols-3 gap-4">
            <div 
              v-for="(month, idx) in monthlyComparison" 
              :key="idx"
              class="text-center p-4 bg-gray-50 rounded-lg"
            >
              <div class="text-sm font-medium text-gray-600 mb-2">{{ month.month }}</div>
              <div class="text-3xl font-bold text-[#008253] mb-2">{{ month.rating }}</div>
              <div class="flex items-center justify-center gap-1 text-sm">
                <i :class="[
                  'pi',
                  month.change > 0 ? 'pi-arrow-up text-green-600' : month.change < 0 ? 'pi-arrow-down text-red-600' : 'pi-minus text-gray-600'
                ]"></i>
                <span :class="[
                  'font-medium',
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
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="pi pi-lightbulb text-[#deae29]"></i>
          Suggestions
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- What Improved -->
          <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="pi pi-check-circle text-green-600"></i>
              What Improved
            </h3>
            <ul class="space-y-3">
              <li 
                v-for="(item, idx) in improvements" 
                :key="idx"
                class="flex items-start gap-3"
              >
                <i class="pi pi-arrow-up text-green-600 mt-1"></i>
                <div>
                  <p class="font-medium text-gray-900">{{ item.title }}</p>
                  <p class="text-sm text-gray-600">{{ item.description }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- What Needs Improvement -->
          <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="pi pi-exclamation-triangle text-orange-600"></i>
              What Needs Improvement
            </h3>
            <ul class="space-y-3">
              <li 
                v-for="(item, idx) in needsImprovement" 
                :key="idx"
                class="flex items-start gap-3"
              >
                <i class="pi pi-arrow-down text-orange-600 mt-1"></i>
                <div>
                  <p class="font-medium text-gray-900">{{ item.title }}</p>
                  <p class="text-sm text-gray-600">{{ item.description }}</p>
                  <p class="text-xs text-[#008253] font-medium mt-1">
                    <i class="pi pi-lightbulb mr-1"></i>
                    {{ item.suggestion }}
                  </p>
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
import { useBusinessDashboard } from '@/composables/useBusinessDashboard'

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

</style>