<template>
  <div>
    <div class="min-h-screen bg-green-50 p-4 md:p-6 lg:p-8">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Business Info Header -->
        <!-- Key Metrics Cards (Clickable) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            v-for="metric in keyMetrics" 
            :key="metric.title"
            @click="handleMetricClick(metric.title)"
            class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all hover:scale-105 text-left cursor-pointer border border-gray-200"
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
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-2xl font-bold text-blue-900 flex items-center gap-2">
              <i class="pi pi-chart-bar text-gray-600"></i>
              Sentiment Highlights
            </h2>
            <button 
              @click="exportCard('sentiment')"
              class="text-gray-600 hover:text-[#008253] transition-colors"
              title="Export"
            >
              <i class="pi pi-file-export text-sm"></i>
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Sentiment Distribution -->
            <div class="space-y-4">
              <h3 class="text-base font-semibold text-blue-900">Sentiment Distribution</h3>
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
                <h3 class="text-base font-semibold text-blue-900">Keywords</h3>
                <div class="inline-flex rounded-lg border mb-4 border-gray-200 p-1">
                  <button
                    @click="wordCloudView = 'positive'"
                    :class="[
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
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
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
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
                  'rounded-lg p-3 min-h-[120px]',
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
        <div id="charts" class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-2xl font-bold text-green-900 flex items-center gap-2">
              <i class="pi pi-chart-line text-gray-600"></i>
              Performance Insights
            </h2>
            <button 
              @click="exportCard('performance')"
              class="text-gray-600 hover:text-[#008253] transition-colors"
              title="Export"
            >
              <i class="pi pi-file-export text-sm"></i>
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Chart Section -->
            <div class="space-y-4">
              <!-- Chart Type Selector -->
              <div class="flex items-center justify-between">
                <select 
                  v-model="selectedChartType"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#008253] focus:outline-none focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all"
                >
                  <option value="ratings">Average Ratings Over Time</option>
                  <option value="volume">Review Volume Over Time</option>
                </select>
              </div>

              <!-- Time Period Toggle -->
              <div class="flex gap-2">
                <button 
                  v-for="period in timePeriods" 
                  :key="period.value"
                  @click="selectedPeriod = period.value"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    selectedPeriod === period.value 
                      ? 'bg-[#008253] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ period.label }}
                </button>
              </div>

              <!-- Chart Display -->
              <div class="h-64 bg-gray-50 rounded-lg p-2">
                <svg class="w-full h-full" viewBox="0 0 400 250">
                  <line x1="40" y1="210" x2="360" y2="210" stroke="#e5e7eb" stroke-width="2"/>
                  <line x1="40" y1="40" x2="40" y2="210" stroke="#e5e7eb" stroke-width="2"/>
                  
                  <path 
                    :d="currentChartPath" 
                    fill="none" 
                    stroke="#008253" 
                    stroke-width="2.5"
                    class="transition-all duration-500"
                  />
        
                  <circle 
                    v-for="(point, index) in currentChartPoints" 
                    :key="index"
                    :cx="point.x" 
                    :cy="point.y" 
                    r="4" 
                    fill="#008253"
                    class="transition-all cursor-pointer hover:r-6"
                  />
                  
                  <text 
                    v-for="(label, index) in currentPerformanceData" 
                    :key="index"
                    :x="40 + (index * 320 / (currentPerformanceData.length - 1))" 
                    y="230" 
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
              <h2 class="text-base font-bold text-center text-green-900 mb-6">Review Sources</h2>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="source in reviewSources" :key="source.name"
                  class="bg-gray-50 rounded-lg p-4 pb-2 text-center hover:bg-gray-100 transition-colors">
                  <i :class="['text-3xl mb-2', source.icon, source.color]"></i>
                  <p class="text-xs font-medium text-gray-700">{{ source.name }}</p>
                  <p class="text-xl font-bold text-gray-900">{{ source.count }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Competitive Benchmarking -->
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <h2 class="text-2xl font-bold text-purple-900 flex items-center gap-2 mb-2">
              <i class="pi pi-chart-pie text-gray-600"></i>
              Competitive Benchmarking
            </h2>
            
            <!-- Competitor Selector -->
            <div class="flex items-center mb-10 gap-2">
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
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-14 mb-10">
            <!-- Average Rating Comparison Table -->
            <div>
              <h4 class="text-base font-semibold text-purple-900 mb-4">Average Rating (Past 3 Months)</h4>
              <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="text-left text-sm font-semibold text-gray-700 p-3 border border-gray-200">Month</th>
                      <th class="text-center text-sm font-semibold text-gray-700 p-3 border border-gray-200">Your Business</th>
                      <th class="text-center text-sm font-semibold text-gray-700 p-3 border border-gray-200">{{ currentCompetitor?.name || 'Competitor' }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(month, index) in monthlyTrend" :key="month.month">
                      <td class="text-sm font-medium text-gray-700 p-3 border border-gray-200">{{ month.month }}</td>
                      <td class="text-center p-3 border border-gray-200">
                        <div class="flex items-center justify-center gap-2">
                          <span class="text-lg font-bold text-[#008253]">{{ month.rating }}</span>
                          <i :class="[
                            'pi text-xs', 
                            month.change > 0 ? 'pi-arrow-up text-green-600' : month.change < 0 ? 'pi-arrow-down text-red-600' : 'pi-minus text-gray-400'
                          ]"></i>
                        </div>
                      </td>
                      <td class="text-center p-3 border border-gray-200">
                        <div class="flex items-center justify-center gap-2">
                          <span class="text-lg font-bold text-gray-700">{{ currentCompetitorMonthlyTrend[index]?.rating || 'N/A' }}</span>
                          <i :class="[
                            'pi text-xs', 
                            (currentCompetitorMonthlyTrend[index]?.change || 0) > 0 ? 'pi-arrow-up text-green-600' : (currentCompetitorMonthlyTrend[index]?.change || 0) < 0 ? 'pi-arrow-down text-red-600' : 'pi-minus text-gray-400'
                          ]"></i>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Competitor Word Cloud with Toggle -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="text-base font-semibold text-purple-900">Competitor Keywords</h4>
                <div class="inline-flex rounded-lg border border-gray-200 p-1">
                  <button
                    @click="competitorWordCloudView = 'positive'"
                    :class="[
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
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
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
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
                  'rounded-lg p-3 min-h-[120px]',
                  competitorWordCloudView === 'positive' ? 'bg-blue-50' : 'bg-orange-50'
                ]"
              >
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="word in currentCompetitorWords" 
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
        </div>

        <!-- Suggestions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-bold text-green-900 flex items-center gap-2">
                <i class="pi pi-thumbs-up text-green-600"></i>
                What Improved
              </h3>
              <button 
                @click="exportCard('improvements')"
                class="text-gray-600 hover:text-[#008253] transition-colors"
                title="Export"
              >
                <i class="pi pi-file-export text-sm"></i>
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="improvement in improvements" :key="improvement.title"
                class="flex gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div class="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <i class="pi pi-check text-white text-xs"></i>
                </div>
                <div>
                  <h4 class="text-base font-semibold text-green-900">{{ improvement.title }}</h4>
                  <p class="text-sm text-green-800 mt-1">{{ improvement.description }}</p>
                  <span class="inline-block mt-2 text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded">
                    +{{ improvement.impact }}% improvement
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-bold text-orange-900 flex items-center gap-2">
                <i class="pi pi-exclamation-triangle text-orange-600"></i>
                Needs Improvement
              </h3>
              <button 
                @click="exportCard('issues')"
                class="text-gray-600 hover:text-[#008253] transition-colors"
                title="Export"
              >
                <i class="pi pi-file-export text-sm"></i>
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="issue in issues" :key="issue.title"
                class="flex gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <div class="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <i class="pi pi-times text-white text-xs"></i>
                </div>
                <div>
                  <h4 class="text-base font-semibold text-orange-900">{{ issue.title }}</h4>
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
  businessInfo,
  keyMetrics,
  sentimentData,
  positiveWords,
  negativeWords,
  reviewSources,
  monthlyTrend,
  improvements,
  issues
} = useSampleAnalytics()

definePageMeta({ layout: 'business' })

// Local state
const wordCloudView = ref<'positive' | 'negative'>('positive')
const competitorWordCloudView = ref<'positive' | 'negative'>('positive')
const selectedCompetitor = ref('competitor1')
const selectedChartType = ref('ratings')
const selectedPeriod = ref('daily')

// Time periods
const timePeriods = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
]

// Performance data by metric and time period
const performanceDataSets = {
  ratings: {
    daily: [
      { period: 'Mon', value: 4.3 },
      { period: 'Tue', value: 4.4 },
      { period: 'Wed', value: 4.2 },
      { period: 'Thu', value: 4.5 },
      { period: 'Fri', value: 4.6 },
      { period: 'Sat', value: 4.5 },
      { period: 'Sun', value: 4.4 }
    ],
    weekly: [
      { period: 'Week 1', value: 4.2 },
      { period: 'Week 2', value: 4.3 },
      { period: 'Week 3', value: 4.5 },
      { period: 'Week 4', value: 4.4 }
    ],
    monthly: [
      { period: 'June', value: 4.1 },
      { period: 'July', value: 4.2 },
      { period: 'Aug', value: 4.3 },
      { period: 'Sept', value: 4.5 },
      { period: 'Oct', value: 4.4 },
      { period: 'Nov', value: 4.6 }
    ]
  },
  volume: {
    daily: [
      { period: 'Mon', value: 12 },
      { period: 'Tue', value: 15 },
      { period: 'Wed', value: 10 },
      { period: 'Thu', value: 18 },
      { period: 'Fri', value: 22 },
      { period: 'Sat', value: 25 },
      { period: 'Sun', value: 20 }
    ],
    weekly: [
      { period: 'Week 1', value: 85 },
      { period: 'Week 2', value: 92 },
      { period: 'Week 3', value: 78 },
      { period: 'Week 4', value: 95 }
    ],
    monthly: [
      { period: 'June', value: 320 },
      { period: 'July', value: 345 },
      { period: 'Aug', value: 380 },
      { period: 'Sept', value: 365 },
      { period: 'Oct', value: 410 },
      { period: 'Nov', value: 395 }
    ]
  }
}

// Competitors data with unique word clouds and monthly trends
const competitors = ref([
  { 
    id: 'competitor1', 
    name: 'The Garden Bistro', 
    rating: 4.2, 
    reviews: 892,
    positiveWords: [
      { text: 'cozy', size: 48 },
      { text: 'garden', size: 44 },
      { text: 'peaceful', size: 40 },
      { text: 'relaxing', size: 36 },
      { text: 'charming', size: 32 }
    ],
    negativeWords: [
      { text: 'slow', size: 48 },
      { text: 'pricey', size: 44 },
      { text: 'small', size: 40 },
      { text: 'parking', size: 36 }
    ],
    monthlyTrend: [
      { month: 'September', rating: 4.1, change: -1 },
      { month: 'October', rating: 4.2, change: 1 },
      { month: 'November', rating: 4.2, change: 0 }
    ]
  },
  { 
    id: 'competitor2', 
    name: 'Sunset Grill', 
    rating: 4.4, 
    reviews: 1103,
    positiveWords: [
      { text: 'view', size: 48 },
      { text: 'sunset', size: 44 },
      { text: 'romantic', size: 40 },
      { text: 'atmosphere', size: 36 },
      { text: 'scenic', size: 32 }
    ],
    negativeWords: [
      { text: 'crowded', size: 48 },
      { text: 'noisy', size: 44 },
      { text: 'expensive', size: 40 },
      { text: 'wait', size: 36 }
    ],
    monthlyTrend: [
      { month: 'September', rating: 4.3, change: -1 },
      { month: 'October', rating: 4.4, change: 1 },
      { month: 'November', rating: 4.5, change: 1 }
    ]
  },
  { 
    id: 'competitor3', 
    name: 'Urban Kitchen', 
    rating: 4.1, 
    reviews: 756,
    positiveWords: [
      { text: 'modern', size: 48 },
      { text: 'trendy', size: 44 },
      { text: 'innovative', size: 40 },
      { text: 'creative', size: 36 },
      { text: 'hip', size: 32 }
    ],
    negativeWords: [
      { text: 'pretentious', size: 48 },
      { text: 'loud', size: 36 },
      { text: 'overpriced', size: 44 },
      { text: 'small portions', size: 30 }
    ],
    monthlyTrend: [
      { month: 'September', rating: 4.0, change: -1 },
      { month: 'October', rating: 4.1, change: 1 },
      { month: 'November', rating: 4.1, change: 0 }
    ]
  }
])

const currentCompetitor = computed(() => 
  competitors.value.find(c => c.id === selectedCompetitor.value)
)

const currentCompetitorWords = computed(() => {
  if (!currentCompetitor.value) return []
  return competitorWordCloudView.value === 'positive' 
    ? currentCompetitor.value.positiveWords 
    : currentCompetitor.value.negativeWords
})

const currentCompetitorMonthlyTrend = computed(() => {
  if (!currentCompetitor.value) return []
  return currentCompetitor.value.monthlyTrend
})

// Current performance data based on selected chart type and period
const currentPerformanceData = computed(() => {
  const dataset = selectedChartType.value === 'ratings' ? performanceDataSets.ratings : performanceDataSets.volume
  return dataset[selectedPeriod.value as keyof typeof dataset]
})

// Chart points calculation
const currentChartPoints = computed(() => {
  const data = currentPerformanceData.value
  const maxValue = selectedChartType.value === 'ratings' ? 5 : Math.max(...data.map((d: { value: number }) => d.value))
  const minValue = 0
  
  return data.map((item: { period: string; value: number }, index: number) => {
    const x = 40 + (index * 320 / (data.length - 1))
    const normalizedValue = (item.value - minValue) / (maxValue - minValue)
    const y = 210 - (normalizedValue * 170)
    return { x, y }
  })
})

// Chart path
const currentChartPath = computed(() => {
  if (currentChartPoints.value.length === 0) return ''
  
  let path = `M ${currentChartPoints.value[0]?.x} ${currentChartPoints.value[0]?.y}`
  for (let i = 1; i < currentChartPoints.value.length; i++) {
    path += ` L ${currentChartPoints.value[i]?.x} ${currentChartPoints.value[i]?.y}`
  }
  return path
})

// Navigation function for clickable metrics
const handleMetricClick = (metricTitle: string) => {
  const router = useRouter()

  const routeMap: Record<string, string> = {
    'Total Reviews': '#charts',
    'Average Rating': '#charts',
    'Response Rate': '/dashboard',
    'New Reviews': '/dashboard',
    'Profile Views': '/dashboard',
    'Engagement Rate': '/dashboard'
  }
  
  const route = routeMap[metricTitle]
  if (route) {
    router.push(route)
  }
}

// Export function
const exportCard = (cardType: string) => {
  console.log(`Exporting ${cardType} data...`)
  alert(`Exporting ${cardType} data...`)
}
</script>