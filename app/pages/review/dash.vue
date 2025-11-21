<template>
  <div>
    <NavDashboard />
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
                  <Star 
                    v-for="n in 5" 
                    :key="n"
                    :filled="n <= Math.floor(businessInfo.averageRating)"
                    :color-level="n <= Math.floor(businessInfo.averageRating) ? 5 : 0"
                    :class="'w-5 h-5'"
                  />
                </div>
                <p class="text-xs sm:text-sm opacity-90 font-medium">{{ businessInfo.totalReviews }} reviews</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Key Metrics Cards (Clickable) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            v-for="metric in keyMetrics" 
            :key="metric.title"
            @click="handleMetricClick(metric.title)"
            class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all hover:scale-105 text-left cursor-pointer"
          >
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
          </button>
        </div>

        <!-- Sentiment Highlights -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="pi pi-chart-bar text-[#008253]"></i>
            Sentiment Highlights
          </h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

            <!-- Word Cloud with Toggle -->
            <div class="space-y-2">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-semibold text-gray-700">Keywords</h3>
                <div class="inline-flex rounded-lg border mb-4 border-gray-200 p-1">
                  <button
                    @click="wordCloudView = 'positive'"
                    :class="[
                      'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                      wordCloudView === 'positive' 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    <i class="pi pi-thumbs-up mr-1"></i>
                    Positive
                  </button>
                  <button
                    @click="wordCloudView = 'negative'"
                    :class="[
                      'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                      wordCloudView === 'negative' 
                        ? 'bg-red-100 text-red-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    <i class="pi pi-thumbs-down mr-1"></i>
                    Negative
                  </button>
                </div>
              </div>
              
              <div 
                :class="[
                  'rounded-lg p-4 min-h-[200px]',
                  wordCloudView === 'positive' ? 'bg-green-50' : 'bg-red-50'
                ]"
              >
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="word in (wordCloudView === 'positive' ? positiveWords : negativeWords)" 
                    :key="word.text"
                    :style="{ fontSize: (word.size / 2.5) + 'px' }"
                    :class="[
                      'font-semibold hover:opacity-70 transition-opacity cursor-pointer',
                      wordCloudView === 'positive' ? 'text-green-700' : 'text-red-700'
                    ]"
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

        <!-- Competitive Benchmarking -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <i class="pi pi-chart-pie text-[#008253]"></i>
              Competitive Benchmarking
            </h2>
            
            <!-- Competitor Selector -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">Compare with:</label>
              <select 
                v-model="selectedCompetitor"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#008253] focus:outline-none focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all"
              >
                <option 
                  v-for="competitor in competitors" 
                  :key="competitor.id"
                  :value="competitor.id"
                >
                  {{ competitor.name }} ({{ competitor.rating }}★)
                </option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Your Business vs Competitor -->
            <div>
              <h3 class="font-semibold text-gray-700 mb-4">Rating Comparison</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">Your Business</span>
                    <span class="text-lg font-bold text-[#008253] flex items-center gap-1">
                      {{ businessInfo.averageRating }}
                      <i class="pi pi-star-fill text-[#deae29]"></i>
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-4">
                    <div class="bg-[#008253] h-4 rounded-full transition-all duration-500" :style="{ width: (businessInfo.averageRating / 5 * 100) + '%' }"></div>
                  </div>
                </div>
                
                <div v-if="currentCompetitor">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">{{ currentCompetitor.name }}</span>
                    <span class="text-lg font-bold text-gray-600 flex items-center gap-1">
                      {{ currentCompetitor.rating }}
                      <i class="pi pi-star-fill text-[#deae29]"></i>
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-4">
                    <div class="bg-gray-600 h-4 rounded-full transition-all duration-500" :style="{ width: (currentCompetitor.rating / 5 * 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3-Month Trend -->
            <div>
              <h3 class="font-semibold text-gray-700 mb-4">Previous 3 months</h3>
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

          <!-- Competitor Word Cloud with Toggle -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-700">Competitor Keywords</h3>
              <div class="inline-flex rounded-lg border border-gray-200 p-1">
                <button
                  @click="competitorWordCloudView = 'positive'"
                  :class="[
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    competitorWordCloudView === 'positive' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  <i class="pi pi-thumbs-up mr-1"></i>
                  Positive
                </button>
                <button
                  @click="competitorWordCloudView = 'negative'"
                  :class="[
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    competitorWordCloudView === 'negative' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  <i class="pi pi-thumbs-down mr-1"></i>
                  Negative
                </button>
              </div>
            </div>
            
            <div 
              :class="[
                'rounded-lg p-4 min-h-[200px]',
                competitorWordCloudView === 'positive' ? 'bg-blue-50' : 'bg-orange-50'
              ]"
            >
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="word in (competitorWordCloudView === 'positive' ? competitorPositiveWords : competitorNegativeWords)" 
                  :key="word.text"
                  :style="{ fontSize: (word.size / 2.5) + 'px' }"
                  :class="[
                    'font-semibold hover:opacity-70 transition-opacity cursor-pointer',
                    competitorWordCloudView === 'positive' ? 'text-blue-700' : 'text-orange-700'
                  ]"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSampleAnalytics } from '@/composables/useSampleAnalytics'
import Star from '~/components/Stars.vue'

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

// Local state
const wordCloudView = ref<'positive' | 'negative'>('positive')
const competitorWordCloudView = ref<'positive' | 'negative'>('positive')
const selectedCompetitor = ref('competitor1')

// Competitors data
const competitors = ref([
  { id: 'competitor1', name: 'The Garden Bistro', rating: 4.2, reviews: 892 },
  { id: 'competitor2', name: 'Sunset Grill', rating: 4.4, reviews: 1103 },
  { id: 'competitor3', name: 'Urban Kitchen', rating: 4.1, reviews: 756 }
])

const currentCompetitor = computed(() => 
  competitors.value.find(c => c.id === selectedCompetitor.value)
)

// Navigation function for clickable metrics
const handleMetricClick = (metricTitle: string) => {
  const router = useRouter()
  
  // Define routes based on metric titles
  const routeMap: Record<string, string> = {
    'Total Reviews': '/',
    'Average Rating': '/',
    'Response Rate': '/',
    'New Reviews': '/',
    'Profile Views': '/',
    'Engagement Rate': '/'
  }
  
  const route = routeMap[metricTitle]
  if (route) {
    router.push(route)
  }
}
</script>