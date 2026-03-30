<template>
  <div>
    <div class="min-h-screen bg-green-50 p-4 md:p-6 lg:p-8">
      <AnnouncementHandler />

      <div class="max-w-7xl mx-auto space-y-6">

        <!-- ═══════════════════════════════════════════════════
             HEADER — last calculated + manual trigger
        ═══════════════════════════════════════════════════ -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p v-if="lastCalculatedAt" class="text-xs text-gray-500">
              <i class="pi pi-clock mr-1"></i>
              Last updated: {{ lastCalculatedAt }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <!-- Success banner -->
            <transition name="fade">
              <span v-if="triggerSuccess"
                class="text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                <i class="pi pi-check-circle"></i>
                Analytics refreshed at {{ lastTriggeredAt }}
              </span>
            </transition>

            <!-- Error banner -->
            <transition name="fade">
              <span v-if="triggerError"
                class="text-xs text-red-700 bg-red-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                <i class="pi pi-exclamation-circle"></i>
                {{ triggerError }}
              </span>
            </transition>

            <!-- Trigger button -->
            <button @click="triggerAndRefresh" :disabled="triggering || loading"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#008253] hover:text-[#008253] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
              <i class="pi text-sm" :class="triggering ? 'pi-spin pi-spinner' : 'pi-refresh'"></i>
              {{ triggering ? 'Refreshing…' : 'Refresh Analytics' }}
            </button>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════
             LOADING STATE
        ═══════════════════════════════════════════════════ -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
          <i class="pi pi-spin pi-spinner text-4xl text-[#008253]"></i>
          <p class="text-gray-600 text-sm">Loading analytics…</p>
        </div>

        <!-- ═══════════════════════════════════════════════════
             ERROR STATE
        ═══════════════════════════════════════════════════ -->
        <div v-else-if="error" class="bg-white rounded-lg border border-orange-200 p-8 text-center space-y-3">
          <i class="pi pi-chart-bar text-4xl text-orange-400"></i>
          <p class="text-gray-700 font-medium">{{ error }}</p>
          <button @click="triggerAndRefresh" :disabled="triggering"
            class="mt-2 px-5 py-2 bg-[#008253] text-white rounded-lg text-sm font-medium hover:bg-[#006b43] transition-colors disabled:opacity-50">
            <i class="pi pi-refresh mr-2" :class="{ 'pi-spin': triggering }"></i>
            {{ triggering ? 'Running…' : 'Run Analysis Now' }}
          </button>
        </div>

        <!-- ═══════════════════════════════════════════════════
             MAIN DASHBOARD CONTENT
        ═══════════════════════════════════════════════════ -->
        <template v-else-if="hasData">

          <!-- Key Metrics Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button v-for="metric in keyMetrics" :key="metric.title" @click="handleMetricClick(metric.title)"
              class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all hover:scale-105 text-left cursor-pointer border border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm font-medium">{{ metric.title }}</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ metric.value }}</p>
                  <p v-if="metric.subtitle" class="text-xs text-gray-400 mt-0.5">{{ metric.subtitle }}</p>
                  <p v-if="metric.trend !== 0" :class="[
                    'text-sm mt-2 flex items-center gap-1',
                    metric.trend > 0 ? 'text-green-600' : 'text-red-600',
                  ]">
                    <i :class="metric.trend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                    {{ Math.abs(metric.trend) }}% vs last period
                  </p>
                  <p v-else class="text-xs mt-2 text-gray-400">No previous data</p>
                </div>
                <div :class="['w-12 h-12 rounded-full flex items-center justify-center', metric.bgColor]">
                  <i :class="['text-xl', metric.icon, metric.iconColor]"></i>
                </div>
              </div>
            </button>
          </div>

          <!-- ══════════════════════════════════════════
               SENTIMENT HIGHLIGHTS
          ══════════════════════════════════════════ -->
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <i class="pi pi-chart-bar text-gray-600"></i>
                Sentiment Highlights
              </h2>
              <button @click="exportCard('sentiment')" class="text-gray-600 hover:text-[#008253] transition-colors"
                title="Export">
                <i class="pi pi-file-export text-sm"></i>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <!-- Sentiment Distribution bars -->
              <div class="space-y-4">
                <h3 class="text-base font-semibold text-blue-900">Sentiment Distribution</h3>
                <div class="space-y-3">
                  <div v-for="s in sentimentData" :key="s.name">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-sm font-medium text-gray-700">{{ s.name }}</span>
                      <span class="text-sm font-bold text-gray-900">{{ s.value.toFixed(1) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                      <div :style="{ width: s.value + '%', backgroundColor: s.color }"
                        class="h-3 rounded-full transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Keyword cloud with toggle -->
              <div class="space-y-2">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-base font-semibold text-blue-900">Keywords</h3>
                  <div class="inline-flex rounded-lg border mb-4 border-gray-200 p-1">
                    <button @click="wordCloudView = 'positive'"
                      :class="['px-3 py-1.5 rounded-md text-xs font-medium transition-all', wordCloudView === 'positive' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900']">
                      <i class="pi pi-thumbs-up mr-1"></i>Positive
                    </button>
                    <button @click="wordCloudView = 'negative'"
                      :class="['px-3 py-1.5 rounded-md text-xs font-medium transition-all', wordCloudView === 'negative' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:text-gray-900']">
                      <i class="pi pi-thumbs-down mr-1"></i>Negative
                    </button>
                  </div>
                </div>

                <div
                  :class="['rounded-lg p-3 min-h-[120px]', wordCloudView === 'positive' ? 'bg-green-50' : 'bg-red-50']">
                  <div v-if="(wordCloudView === 'positive' ? positiveWords : negativeWords).length"
                    class="flex flex-wrap gap-2">
                    <span v-for="word in wordCloudView === 'positive' ? positiveWords : negativeWords" :key="word.text"
                      :style="{ fontSize: word.size + 'px' }"
                      :class="['font-semibold hover:opacity-70 transition-opacity cursor-pointer', wordCloudView === 'positive' ? 'text-green-700' : 'text-red-700']">
                      {{ word.text }}
                    </span>
                  </div>
                  <p v-else class="text-sm text-gray-400 text-center pt-4">No keywords yet</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════════════════════════════════════════
               PERFORMANCE INSIGHTS — chart + sources
          ══════════════════════════════════════════ -->
          <div id="charts" class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-2xl font-bold text-green-900 flex items-center gap-2">
                <i class="pi pi-chart-line text-gray-600"></i>
                Performance Insights
              </h2>
              <button @click="exportCard('performance')" class="text-gray-600 hover:text-[#008253] transition-colors"
                title="Export">
                <i class="pi pi-file-export text-sm"></i>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Chart -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <select v-model="selectedChartType"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#008253] focus:outline-none focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all">
                    <option value="ratings">Average Ratings Over Time</option>
                    <option value="volume">Review Volume Over Time</option>
                  </select>
                </div>

                <div class="flex gap-2">
                  <button v-for="period in timePeriods" :key="period.value" @click="selectedPeriod = period.value"
                    :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-all', selectedPeriod === period.value ? 'bg-[#008253] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
                    {{ period.label }}
                  </button>
                </div>

                <div class="h-64 bg-gray-50 rounded-lg p-2">
                  <div v-if="currentChart.data.length < 2"
                    class="flex items-center justify-center h-full text-sm text-gray-400">
                    Not enough data for this period yet
                  </div>
                  <!-- viewBox: 0 0 420 260
                       Left margin 55px = room for Y labels + axis title
                       Bottom margin 40px = room for rotated X labels -->
                  <svg v-else class="w-full h-full" viewBox="0 0 420 260">
                    <!-- Y axis line -->
                    <line x1="55" y1="35" x2="55" y2="215" stroke="#e5e7eb" stroke-width="2" />
                    <!-- X axis line -->
                    <line x1="55" y1="215" x2="390" y2="215" stroke="#e5e7eb" stroke-width="2" />

                    <!-- Y axis title (rotated, left side) -->
                    <text x="12" y="125" text-anchor="middle" fill="#6b7280" font-size="9"
                      transform="rotate(-90, 12, 125)">
                      {{ selectedChartType === 'ratings' ? 'Rating' : 'Reviews' }}
                    </text>

                    <!-- Y axis ticks + dashed grid lines + value labels -->
                    <g v-for="tick in currentChart.yTicks" :key="tick.y">
                      <line :x1="51" :y1="tick.y" :x2="55" :y2="tick.y" stroke="#9ca3af" stroke-width="1" />
                      <line :x1="55" :y1="tick.y" :x2="390" :y2="tick.y" stroke="#e5e7eb" stroke-width="1"
                        stroke-dasharray="4,3" />
                      <text :x="49" :y="tick.y + 4" text-anchor="end" fill="#9ca3af" font-size="9">
                        {{ tick.label }}
                      </text>
                    </g>

                    <!-- Data line -->
                    <path :d="currentChart.path" fill="none" stroke="#008253" stroke-width="2.5"
                      class="transition-all duration-500" />

                    <!-- Data points -->
                    <circle v-for="(point, i) in currentChart.points" :key="i" :cx="point.x" :cy="point.y" r="4"
                      fill="#008253" class="transition-all cursor-pointer" />

                    <!-- X axis labels — rotated -40deg so they never overlap -->
                    <text v-for="(label, i) in currentChart.data" :key="i"
                      :x="55 + (i * 335) / (currentChart.data.length - 1)" y="220" text-anchor="end" fill="#6b7280"
                      font-size="9" :transform="`rotate(-40, ${55 + (i * 335) / (currentChart.data.length - 1)}, 220)`">
                      {{ label.period }}
                    </text>
                  </svg>
                </div>
              </div>

              <!-- Review Sources -->
              <div>
                <h2 class="text-base font-bold text-center text-green-900 mb-6">Review Sources</h2>
                <div v-if="reviewSources.length" class="grid grid-cols-2 gap-4">
                  <div v-for="source in reviewSources" :key="source.name"
                    class="bg-gray-50 rounded-lg p-4 pb-2 text-center hover:bg-gray-100 transition-colors">
                    <i :class="['text-3xl mb-2', source.icon, source.color]"></i>
                    <p class="text-xs font-medium text-gray-700">{{ source.name }}</p>
                    <p class="text-xl font-bold text-gray-900">{{ source.count }}</p>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-400 text-center pt-8">No source data yet</p>
              </div>
            </div>
          </div>

          <!-- ══════════════════════════════════════════
               COMPETITIVE BENCHMARKING (unchanged, still sample data
               until competitor comparison is wired up in a future task)
          ══════════════════════════════════════════ -->
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <h2 class="text-2xl font-bold text-purple-900 flex items-center gap-2 mb-2">
                <i class="pi pi-chart-pie text-gray-600"></i>
                Competitive Benchmarking
              </h2>
              <div class="flex items-center mb-10 gap-2">
                <label class="text-sm font-medium text-gray-700">Compare with:</label>
                <select v-model="selectedCompetitor"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#008253] focus:outline-none focus:ring-2 focus:ring-[#008253] focus:border-transparent transition-all">
                  <option v-for="competitor in competitors" :key="competitor.id" :value="competitor.id">
                    {{ competitor.name }} ({{ competitor.rating }}★)
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-14 mb-10">
              <!-- Rating Comparison Table — real data for "Your Business" -->
              <div>
                <h4 class="text-base font-semibold text-purple-900 mb-4">Average Rating (Past 3 Months)</h4>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-gray-100">
                        <th class="text-left text-sm font-semibold text-gray-700 p-3 border border-gray-200">Month</th>
                        <th class="text-center text-sm font-semibold text-gray-700 p-3 border border-gray-200">Your
                          Business</th>
                        <th class="text-center text-sm font-semibold text-gray-700 p-3 border border-gray-200">{{
                          currentCompetitor?.name || 'Competitor' }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(month, index) in monthlyTrend" :key="month.month">
                        <td class="text-sm font-medium text-gray-700 p-3 border border-gray-200">{{ month.month }}</td>
                        <td class="text-center p-3 border border-gray-200">
                          <div class="flex items-center justify-center gap-2">
                            <span class="text-lg font-bold text-[#008253]">{{ month.rating }}</span>
                            <i
                              :class="['pi text-xs', month.change > 0 ? 'pi-arrow-up text-green-600' : month.change < 0 ? 'pi-arrow-down text-red-600' : 'pi-minus text-gray-400']"></i>
                          </div>
                        </td>
                        <td class="text-center p-3 border border-gray-200">
                          <div class="flex items-center justify-center gap-2">
                            <span class="text-lg font-bold text-gray-700">{{
                              currentCompetitorMonthlyTrend[index]?.rating || 'N/A' }}</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Competitor keyword cloud -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-base font-semibold text-purple-900">Competitor Keywords</h4>
                  <div class="inline-flex rounded-lg border border-gray-200 p-1">
                    <button @click="competitorWordCloudView = 'positive'"
                      :class="['px-3 py-1.5 rounded-md text-xs font-medium transition-all', competitorWordCloudView === 'positive' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900']">
                      <i class="pi pi-thumbs-up mr-1"></i>Positive
                    </button>
                    <button @click="competitorWordCloudView = 'negative'"
                      :class="['px-3 py-1.5 rounded-md text-xs font-medium transition-all', competitorWordCloudView === 'negative' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900']">
                      <i class="pi pi-thumbs-down mr-1"></i>Negative
                    </button>
                  </div>
                </div>
                <div
                  :class="['rounded-lg p-3 min-h-[120px]', competitorWordCloudView === 'positive' ? 'bg-blue-50' : 'bg-orange-50']">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="word in currentCompetitorWords" :key="word.text"
                      :style="{ fontSize: word.size / 2.5 + 'px' }"
                      :class="['font-semibold hover:opacity-70 cursor-pointer', competitorWordCloudView === 'positive' ? 'text-blue-700' : 'text-orange-700']">
                      {{ word.text }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════════════════════════════════════════
               SUGGESTIONS (What Improved / Needs Improvement)
               Derived from real aspect data
          ══════════════════════════════════════════ -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- What Improved: top-scored aspects -->
            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-green-900 flex items-center gap-2">
                  <i class="pi pi-thumbs-up text-green-600"></i>
                  Strongest Areas
                </h3>
              </div>
              <div class="space-y-4">
                <div v-if="topAspects.length" v-for="a in topAspects" :key="a.aspect"
                  class="flex gap-3 p-4 bg-green-50 rounded-lg">
                  <div class="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <i class="pi pi-check text-white text-xs"></i>
                  </div>
                  <div>
                    <h4 class="text-base font-semibold text-green-900 capitalize">{{ a.aspect }}</h4>
                    <p class="text-sm text-green-800 mt-1">
                      {{ uniqueOpinions(a.positiveOpinions).length }} positive opinions
                      <span v-if="a.positiveOpinions?.length"> — {{ uniqueOpinionsPreview(a.positiveOpinions) }}</span>
                    </p>
                    <span class="inline-block mt-2 text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded">
                      {{ Math.round(a.sentimentScore * 100) }}% positive sentiment
                    </span>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-400">Not enough data yet</p>
              </div>
            </div>

            <!-- Needs Improvement: lowest-scored aspects -->
            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-orange-900 flex items-center gap-2">
                  <i class="pi pi-exclamation-triangle text-orange-600"></i>
                  Needs Attention
                </h3>
              </div>
              <div class="space-y-4">
                <div v-if="bottomAspects.length" v-for="a in bottomAspects" :key="a.aspect"
                  class="flex gap-3 p-4 bg-orange-50 rounded-lg">
                  <div class="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                    <i class="pi pi-times text-white text-xs"></i>
                  </div>
                  <div>
                    <h4 class="text-base font-semibold text-orange-900 capitalize">{{ a.aspect }}</h4>
                    <p class="text-sm text-orange-800 mt-1">
                      {{ uniqueOpinions(a.negativeOpinions).length }} negative opinions
                      <span v-if="a.negativeOpinions?.length"> — {{ uniqueOpinionsPreview(a.negativeOpinions) }}</span>
                    </p>
                    <span class="inline-block mt-2 text-xs font-medium text-orange-700 bg-orange-200 px-2 py-1 rounded">
                      {{ Math.round((1 - a.sentimentScore) * 100) }}% negative sentiment
                    </span>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-400">No issues detected yet</p>
              </div>
            </div>
          </div>

        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRealAnalytics } from '~/composables/useRealAnalytics'

definePageMeta({ layout: 'business' })

// ── Real analytics ──────────────────────────────────────
const {
  loading,
  error,
  hasData,
  lastCalculatedAt,
  triggering,
  triggerError,
  triggerSuccess,
  lastTriggeredAt,
  triggerAndRefresh,
  load,
  keyMetrics,
  sentimentData,
  positiveWords,
  negativeWords,
  aspects,
  reviewSources,
  monthlyTrend,
  buildChart,
} = useRealAnalytics()

onMounted(() => load())

// ── Chart controls ──────────────────────────────────────
const wordCloudView = ref<'positive' | 'negative'>('positive')
const competitorWordCloudView = ref<'positive' | 'negative'>('positive')
const selectedChartType = ref<'ratings' | 'volume'>('ratings')
const selectedPeriod = ref<'daily' | 'weekly' | 'monthly'>('daily')

const timePeriods: { value: 'daily' | 'weekly' | 'monthly'; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const currentChart = computed(() =>
  buildChart(selectedPeriod.value as 'daily' | 'weekly' | 'monthly', selectedChartType.value)
)

// ── Aspect-derived suggestions ──────────────────────────
// Top 2 highest-scoring aspects → "Strongest Areas"
// Only include aspects where positive is dominant (sentimentScore > 0.5)
const topAspects = computed(() =>
  [...aspects.value]
    .filter(a => a.positiveCount > 0 && a.sentimentScore > 0.5)
    .sort((a, b) => b.sentimentScore - a.sentimentScore)
    .slice(0, 2)
)

// Bottom 2 lowest-scoring aspects → "Needs Attention"
// Exclude any aspect already shown in Strongest Areas to avoid duplication
const bottomAspects = computed(() => {
  const topNames = new Set(topAspects.value.map(a => a.aspect.toLowerCase()))
  return [...aspects.value]
    .filter(a => a.negativeCount > 0 && !topNames.has(a.aspect.toLowerCase()))
    .sort((a, b) => a.sentimentScore - b.sentimentScore)
    .slice(0, 2)
})

// ── Competitor section (sample — future task) ───────────
const selectedCompetitor = ref('competitor1')

const competitors = ref([
  {
    id: 'competitor1', name: 'The Garden Bistro', rating: 4.2,
    positiveWords: [{ text: 'cozy', size: 48 }, { text: 'peaceful', size: 40 }, { text: 'charming', size: 32 }],
    negativeWords: [{ text: 'slow', size: 48 }, { text: 'pricey', size: 44 }],
    monthlyTrend: [{ month: 'September', rating: 4.1, change: -0.1 }, { month: 'October', rating: 4.2, change: 0.1 }, { month: 'November', rating: 4.2, change: 0 }],
  },
  {
    id: 'competitor2', name: 'Sunset Grill', rating: 4.4,
    positiveWords: [{ text: 'scenic', size: 48 }, { text: 'romantic', size: 40 }],
    negativeWords: [{ text: 'crowded', size: 48 }, { text: 'noisy', size: 36 }],
    monthlyTrend: [{ month: 'September', rating: 4.3, change: -0.1 }, { month: 'October', rating: 4.4, change: 0.1 }, { month: 'November', rating: 4.5, change: 0.1 }],
  },
])

const currentCompetitor = computed(() => competitors.value.find(c => c.id === selectedCompetitor.value))
const currentCompetitorWords = computed(() => {
  if (!currentCompetitor.value) return []
  return competitorWordCloudView.value === 'positive'
    ? currentCompetitor.value.positiveWords
    : currentCompetitor.value.negativeWords
})
const currentCompetitorMonthlyTrend = computed(() => currentCompetitor.value?.monthlyTrend ?? [])

// ── Opinion helpers ─────────────────────────────────────
/** Deduplicate an opinion list (Azure AI can return the same phrase twice). */
function uniqueOpinions(opinions: string[]): string[] {
  return [...new Set(opinions)]
}

/** First 2 unique opinions joined for display. */
function uniqueOpinionsPreview(opinions: string[]): string {
  return uniqueOpinions(opinions).slice(0, 2).join(', ')
}

// ── Misc ────────────────────────────────────────────────
const handleMetricClick = (title: string) => {
  const router = useRouter()
  if (title === 'Total Reviews' || title === 'Average Rating') router.push('#charts')
}

const exportCard = (card: string) => {
  console.log(`Exporting ${card}…`)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>