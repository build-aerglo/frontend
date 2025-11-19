<template>
    <NavDashboard/>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
        <!-- Business Info Header -->
      <div class="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-100">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div class="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
            <div class="relative">
              <img 
                :src="businessInfo.image"
                :alt="businessInfo.name"
                class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md ring-4 ring-white"
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
      
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="metric in keyMetrics" :key="metric.title" 
          class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">{{ metric.title }}</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ metric.value }}</p>
              <p :class="['text-sm mt-2 flex items-center gap-1', metric.trend > 0 ? 'text-green-600' : 'text-red-600']">
                <i :class="metric.trend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                {{ Math.abs(metric.trend) }}% vs last period
              </p>
            </div>
            <div :class="['w-12 h-12 rounded-full flex items-center justify-center', metric.bgColor]">
              <i :class="['text-xl', metric.icon, metric.iconColor]"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Sentiment Highlights -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <i class="pi pi-chart-bar text-[#008253]"></i>
          Sentiment Highlights
        </h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Sentiment Distribution -->
          <div class="space-y-4">
            <h3 class="font-semibold text-gray-700">Sentiment Distribution</h3>
            <div class="space-y-3">
              <div v-for="sentiment in sentimentData" :key="sentiment.name">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">{{ sentiment.name }}</span>
                  <span class="text-sm font-bold text-gray-900">{{ sentiment.value }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    :style="{ width: sentiment.value + '%', backgroundColor: sentiment.color }"
                    class="h-3 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Word Clouds -->
          <div class="space-y-4">
            <div class="bg-green-50 rounded-lg p-4">
              <h4 class="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <i class="pi pi-thumbs-up"></i>
                Positive Keywords
              </h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="word in positiveWords" 
                  :key="word.text"
                  :style="{ fontSize: (word.size / 2.5) + 'px' }"
                  class="text-green-700 font-semibold hover:text-green-900 transition-colors cursor-pointer"
                >
                  {{ word.text }}
                </span>
              </div>
            </div>
            
            <div class="bg-red-50 rounded-lg p-4">
              <h4 class="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <i class="pi pi-thumbs-down"></i>
                Negative Keywords
              </h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="word in negativeWords" 
                  :key="word.text"
                  :style="{ fontSize: (word.size /2.5) + 'px' }"
                  class="text-red-700 font-semibold hover:text-red-900 transition-colors cursor-pointer"
                >
                  {{ word.text }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Insights -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <i class="pi pi-chart-line text-[#008253]"></i>
          Performance Insights
        </h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-900">Average Rating</p>
                <p class="text-3xl font-bold text-blue-900 mt-1">{{ currentStats.avgRating }}</p>
              </div>
              <i class="pi pi-star-fill text-3xl text-[#deae29]"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-purple-900">Total Reviews</p>
                <p class="text-3xl font-bold text-purple-900 mt-1">{{ currentStats.totalReviews }}</p>
              </div>
              <i class="pi pi-comments text-3xl text-purple-600"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-green-900">Profile Clicks</p>
                <p class="text-3xl font-bold text-green-900 mt-1">{{ currentStats.totalClicks }}</p>
              </div>
              <i class="pi pi-eye text-3xl text-green-600"></i>
            </div>
          </div>
        </div>

        <!-- Performance Chart -->
        <div class="mb-6">
          <div class="flex flex-wrap gap-2 mb-4">
            <button 
              v-for="metric in performanceMetrics" 
              :key="metric.value"
              @click="selectedMetric = metric.value"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                selectedMetric === metric.value 
                  ? 'bg-[#008253] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ metric.label }}
            </button>
          </div>
          
          <div class="h-80 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
            <svg class="w-full h-full" viewBox="0 0 800 300">
              <line x1="50" y1="250" x2="750" y2="250" stroke="#e5e7eb" stroke-width="2"/>
              <line x1="50" y1="50" x2="50" y2="250" stroke="#e5e7eb" stroke-width="2"/>
              
              <path 
                :d="chartPath" 
                fill="none" 
                stroke="#008253" 
                stroke-width="3"
                class="transition-all duration-500"
              />
              
              <circle 
                v-for="(point, index) in chartPoints" 
                :key="index"
                :cx="point.x" 
                :cy="point.y" 
                r="5" 
                fill="#008253"
                class="hover:r-7 transition-all cursor-pointer"
              />
              
              <text 
                v-for="(label, index) in performanceData" 
                :key="'label-' + index"
                :x="50 + (index * 700 / (performanceData.length - 1))" 
                y="270" 
                text-anchor="middle" 
                class="text-xs fill-gray-600"
              >
                {{ label.period }}
              </text>
            </svg>
          </div>
        </div>

        <!-- Review Sources -->
        <div>
          <h3 class="font-semibold text-gray-700 mb-4">Review Sources</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div v-for="source in reviewSources" :key="source.name"
              class="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
              <i :class="['text-3xl mb-2', source.icon, source.color]"></i>
              <p class="text-sm font-medium text-gray-700">{{ source.name }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ source.count }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Benchmarking -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <i class="pi pi-chart-pie text-[#008253]"></i>
          Competitive Benchmarking
        </h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Your Business vs Competitor -->
          <div>
            <h3 class="font-semibold text-gray-700 mb-4">Rating Comparison</h3>
            <div class="space-y-4">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Your Business</span>
                  <span class="text-lg font-bold text-[#008253]">4.6<i class="pi pi-star-fill text-[#deae29]"></i></span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-4">
                  <div class="bg-[#008253] h-4 rounded-full" style="width: 92%"></div>
                </div>
              </div>
              
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Competitor Average</span>
                  <span class="text-lg font-bold text-gray-600">4.2<i class="pi pi-star-fill text-[#deae29]"></i></span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-4">
                  <div class="bg-gray-600 h-4 rounded-full" style="width: 84%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3-Month Trend -->
          <div>
            <h3 class="font-semibold text-gray-700 mb-4">3-Month Rating Trend</h3>
            <div class="space-y-3">
              <div v-for="month in monthlyTrend" :key="month.month"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="font-medium text-gray-700">{{ month.month }}</span>
                <div class="flex items-center gap-3">
                  <span class="text-2xl font-bold text-gray-900">{{ month.rating }}</span>
                  <i :class="[
                    'pi', 
                    month.change > 0 ? 'pi-arrow-up text-green-600' : 'pi-arrow-down text-red-600'
                  ]"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Competitor Word Clouds -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-semibold text-blue-900 mb-3">Competitor Positive Keywords</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="word in competitorPositiveWords" 
                :key="word.text"
                :style="{ fontSize: (word.size / 2.5) + 'px' }"
                class="text-blue-700 font-semibold"
              >
                {{ word.text }}
              </span>
            </div>
          </div>
          
          <div class="bg-orange-50 rounded-lg p-4">
            <h4 class="font-semibold text-orange-900 mb-3">Competitor Negative Keywords</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="word in competitorNegativeWords" 
                :key="word.text"
                :style="{ fontSize: (word.size / 2.5) + 'px' }"
                class="text-orange-700 font-semibold"
              >
                {{ word.text }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Suggestions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="pi pi-thumbs-up text-green-600"></i>
            What Improved
          </h2>
          <div class="space-y-4">
            <div v-for="improvement in improvements" :key="improvement.title"
              class="flex gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div class="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <i class="pi pi-check text-white text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-green-900">{{ improvement.title }}</h3>
                <p class="text-sm text-green-800 mt-1">{{ improvement.description }}</p>
                <span class="inline-block mt-2 text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded">
                  +{{ improvement.impact }}% improvement
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="pi pi-exclamation-triangle text-orange-600"></i>
            Needs Improvement
          </h2>
          <div class="space-y-4">
            <div v-for="issue in issues" :key="issue.title"
              class="flex gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <div class="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <i class="pi pi-times text-white text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-orange-900">{{ issue.title }}</h3>
                <p class="text-sm text-orange-800 mt-1">{{ issue.description }}</p>
                <span class="inline-block mt-2 text-xs font-medium text-orange-700 bg-orange-200 px-2 py-1 rounded">
                  Priority: {{ issue.priority }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
import { useSampleAnalytics } from '@/composables/useSampleAnalytics'
const {
  selectedMetric,
  businessInfo,
  performanceMetrics,
  keyMetrics,
  sentimentData,
  positiveWords,
  negativeWords,
  performanceData,

  currentStats,
  chartPoints,
  chartPath,

  reviewSources,
  monthlyTrend,
  competitorPositiveWords,
  competitorNegativeWords,
  improvements,
  issues
} = useSampleAnalytics()
</script>



