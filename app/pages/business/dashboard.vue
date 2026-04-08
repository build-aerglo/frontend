<template>
  <div>
    <div class="min-h-screen bg-green-50 p-4 md:p-6 lg:p-8" data-test="page-content">
      <AnnouncementHandler />

      <div class="max-w-7xl mx-auto space-y-6">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p v-if="lastCalculatedAt" class="text-xs text-gray-500">
              <i class="pi pi-clock mr-1"></i>
              Last updated: {{ lastCalculatedAt }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <transition name="fade">
              <span v-if="triggerSuccess"
                class="text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                <i class="pi pi-check-circle"></i>
                Analytics refreshed at {{ lastTriggeredAt }}
              </span>
            </transition>
            <transition name="fade">
              <span v-if="triggerError"
                class="text-xs text-red-700 bg-red-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                <i class="pi pi-exclamation-circle"></i>
                {{ triggerError }}
              </span>
            </transition>
            <button @click="triggerAndRefresh" :disabled="triggering || loading"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#008253] hover:text-[#008253] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
              <i class="pi text-sm" :class="triggering ? 'pi-spin pi-spinner' : 'pi-refresh'"></i>
              {{ triggering ? 'Refreshing…' : 'Refresh Analytics' }}
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
          <i class="pi pi-spin pi-spinner text-4xl text-[#008253]"></i>
          <p class="text-gray-600 text-sm">Loading analytics…</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-white rounded-lg border border-orange-200 p-8 text-center space-y-3">
          <i class="pi pi-chart-bar text-4xl text-orange-400"></i>
          <p class="text-gray-700 font-medium">{{ error }}</p>
          <button @click="triggerAndRefresh" :disabled="triggering"
            class="mt-2 px-5 py-2 bg-[#008253] text-white rounded-lg text-sm font-medium hover:bg-[#006b43] transition-colors disabled:opacity-50">
            <i class="pi pi-refresh mr-2" :class="{ 'pi-spin': triggering }"></i>
            {{ triggering ? 'Running…' : 'Run Analysis Now' }}
          </button>
        </div>

        <!-- Main dashboard -->
        <template v-else-if="hasData">

          <!-- Key Metrics -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button v-for="metric in keyMetrics" :key="metric.title" @click="handleMetricClick(metric.title)"
              class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all hover:scale-105 text-left cursor-pointer border border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm font-medium">{{ metric.title }}</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ metric.value }}</p>
                  <p v-if="metric.trend !== 0"
                    :class="['text-sm mt-2 flex items-center gap-1', metric.trend > 0 ? 'text-green-600' : 'text-red-600']">
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

          <!-- Sentiment Highlights -->
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

          <!-- Performance Insights -->
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
                  <svg v-else class="w-full h-full" viewBox="0 0 420 260">
                    <line x1="55" y1="35" x2="55" y2="215" stroke="#e5e7eb" stroke-width="2" />
                    <line x1="55" y1="215" x2="390" y2="215" stroke="#e5e7eb" stroke-width="2" />
                    <text x="12" y="125" text-anchor="middle" fill="#6b7280" font-size="9"
                      :transform="`rotate(-90, 12, 125)`">
                      {{ selectedChartType === 'ratings' ? 'Rating' : 'Reviews' }}
                    </text>
                    <g v-for="tick in currentChart.yTicks" :key="tick.y">
                      <line :x1="51" :y1="tick.y" :x2="55" :y2="tick.y" stroke="#9ca3af" stroke-width="1" />
                      <line :x1="55" :y1="tick.y" :x2="390" :y2="tick.y" stroke="#e5e7eb" stroke-width="1"
                        stroke-dasharray="4,3" />
                      <text :x="49" :y="tick.y + 4" text-anchor="end" fill="#9ca3af" font-size="9">{{ tick.label
                        }}</text>
                    </g>
                    <path :d="currentChart.path" fill="none" stroke="#008253" stroke-width="2.5"
                      class="transition-all duration-500" />
                    <circle v-for="(point, i) in currentChart.points" :key="i" :cx="point.x" :cy="point.y" r="4"
                      fill="#008253" class="transition-all cursor-pointer" />
                    <text v-for="(label, i) in currentChart.data" :key="i"
                      :x="55 + (i * 335) / (currentChart.data.length - 1)" y="220" text-anchor="end" fill="#6b7280"
                      font-size="9" :transform="`rotate(-40, ${55 + (i * 335) / (currentChart.data.length - 1)}, 220)`">
                      {{ label.period }}
                    </text>
                  </svg>
                </div>
              </div>
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

          <!-- ══════════════════════════════════════════════════════════════
               COMPETITIVE BENCHMARKING — real data from category analytics
          ══════════════════════════════════════════════════════════════ -->
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 class="text-2xl font-bold text-purple-900 flex items-center gap-2">
                  <i class="pi pi-chart-pie text-gray-600"></i>
                  Competitive Benchmarking
                </h2>
                <p class="text-xs text-gray-500 mt-1">
                  How your business compares within its category
                  <span v-if="competitiveBenchmark">
                    · Ranked #{{ competitiveBenchmark.yourRank }} of {{ competitiveBenchmark.totalBusinessesInCategory
                    }}
                  </span>
                </p>
              </div>
              <span v-if="competitiveBenchmark" class="text-xs text-gray-400">
                Updated {{ formatBenchmarkDate(competitiveBenchmark.calculatedAt) }}
              </span>
            </div>

            <!-- No benchmark data yet -->
            <div v-if="!competitiveBenchmark" class="py-10 text-center space-y-2">
              <i class="pi pi-chart-pie text-3xl text-gray-300"></i>
              <p class="text-sm text-gray-500">
                Benchmarking data will appear after your business receives reviews
                and the analytics function has run.
              </p>
              <button @click="triggerAndRefresh" :disabled="triggering"
                class="mt-2 px-4 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:border-[#008253] hover:text-[#008253] transition-all disabled:opacity-50">
                <i class="pi pi-refresh mr-1" :class="{ 'pi-spin': triggering }"></i>
                Refresh Now
              </button>
            </div>

            <!-- Benchmark table -->
            <div v-else class="space-y-6">

              <!-- Rank badge -->
              <div class="flex items-center gap-3 p-4 rounded-xl" :class="rankBadgeClass">
                <i class="pi pi-trophy text-2xl" :class="rankBadgeIconClass"></i>
                <div>
                  <p class="font-bold text-lg" :class="rankBadgeTextClass">
                    Ranked #{{ competitiveBenchmark.yourRank }}
                    of {{ competitiveBenchmark.totalBusinessesInCategory }} businesses
                  </p>
                  <p class="text-sm" :class="rankBadgeSubClass">{{ rankMessage }}</p>
                </div>
              </div>

              <!-- Comparison table -->
              <div class="overflow-x-auto">
                <table class="w-full border-collapse text-sm">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="text-left p-3 border border-gray-200 font-semibold text-gray-700 w-40">Metric</th>
                      <th class="text-center p-3 border border-gray-200 font-semibold text-[#008253]">Your Business</th>
                      <th class="text-center p-3 border border-gray-200 font-semibold text-purple-700">Top 10% in
                        Category</th>
                      <th class="text-center p-3 border border-gray-200 font-semibold text-gray-600">Category Average
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in benchmarkTableRows" :key="row.label" class="hover:bg-gray-50 transition-colors">
                      <td class="p-3 border border-gray-200 font-medium text-gray-700">
                        {{ row.label }}
                        <span class="block text-xs text-gray-400 font-normal">{{ row.hint }}</span>
                      </td>
                      <!-- Your value -->
                      <td class="p-3 border border-gray-200 text-center">
                        <div class="flex flex-col items-center gap-1">
                          <span class="font-bold text-base text-gray-900">{{ row.yours }}</span>
                          <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', row.vsTop10Class]">
                            {{ row.vsTop10Label }}
                          </span>
                        </div>
                      </td>
                      <!-- Top 10% -->
                      <td class="p-3 border border-gray-200 text-center">
                        <span class="font-semibold text-purple-700">{{ row.top10 }}</span>
                      </td>
                      <!-- Category avg -->
                      <td class="p-3 border border-gray-200 text-center">
                        <span class="font-medium text-gray-600">{{ row.catAvg }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Benchmark legend -->
              <div class="flex flex-wrap gap-4 text-xs text-gray-500 pt-1">
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                  Above top 10%
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block"></span>
                  Within 10% of top 10%
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                  Above category average
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
                  Below category average
                </span>
              </div>
            </div>
          </div>

          <!-- Strongest Areas / Needs Attention -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
import { ref, computed } from 'vue'
import { useRealAnalytics } from '~/composables/useRealAnalytics'
import type { BenchmarkRow } from '~/composables/useAnalyticsApi'

definePageMeta({ layout: 'business' })

const {
  loading, error, hasData, lastCalculatedAt,
  triggering, triggerError, triggerSuccess, lastTriggeredAt,
  triggerAndRefresh, load,
  keyMetrics, sentimentData, positiveWords, negativeWords,
  aspects, reviewSources, monthlyTrend, buildChart,
  competitiveBenchmark,
} = useRealAnalytics()

onMounted(() => load())

// ── Chart controls ───────────────────────────────────────────────────────────
const wordCloudView = ref<'positive' | 'negative'>('positive')
const selectedChartType = ref<'ratings' | 'volume'>('ratings')
const selectedPeriod = ref<'daily' | 'weekly' | 'monthly'>('daily')

const timePeriods: { value: 'daily' | 'weekly' | 'monthly'; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const currentChart = computed(() =>
  buildChart(selectedPeriod.value, selectedChartType.value)
)

// ── Aspect suggestions ───────────────────────────────────────────────────────
const topAspects = computed(() =>
  [...aspects.value]
    .filter(a => a.positiveCount > 0 && a.sentimentScore > 0.5)
    .sort((a, b) => b.sentimentScore - a.sentimentScore)
    .slice(0, 2)
)

const bottomAspects = computed(() => {
  const topNames = new Set(topAspects.value.map(a => a.aspect.toLowerCase()))
  return [...aspects.value]
    .filter(a => a.negativeCount > 0 && !topNames.has(a.aspect.toLowerCase()))
    .sort((a, b) => a.sentimentScore - b.sentimentScore)
    .slice(0, 2)
})

// ── Competitive benchmarking helpers ────────────────────────────────────────

/** Returns a CSS class indicating how 'yours' compares to the top-10% value. */
function vsClass(yours: number, top10: number, catAvg: number, higherIsBetter = true): string {
  const above = higherIsBetter
  if (above ? yours >= top10 : yours <= top10) return 'bg-green-100 text-green-700'
  if (above ? yours >= top10 * 0.9 : yours <= top10 * 1.1) return 'bg-blue-100 text-blue-600'
  if (above ? yours >= catAvg : yours <= catAvg) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-600'
}

function vsLabel(yours: number, top10: number, catAvg: number, higherIsBetter = true): string {
  if (higherIsBetter ? yours >= top10 : yours <= top10) return '▲ Top 10%'
  if (higherIsBetter ? yours >= top10 * 0.9 : yours <= top10 * 1.1) return '≈ Near top'
  if (higherIsBetter ? yours >= catAvg : yours <= catAvg) return '↑ Above avg'
  return '↓ Below avg'
}

/** Build rows for the comparison table from the benchmark data. */
const benchmarkTableRows = computed(() => {
  const b = competitiveBenchmark.value
  if (!b) return []

  const fmt = (v: number, decimals = 1) => v.toFixed(decimals)

  return [
    {
      label: 'Avg Rating',
      hint: 'Bayesian weighted average',
      yours: fmt(b.yourBusiness.avgRating),
      top10: fmt(b.top10Percent.avgRating),
      catAvg: fmt(b.categoryAverage.avgRating),
      vsTop10Class: vsClass(b.yourBusiness.avgRating, b.top10Percent.avgRating, b.categoryAverage.avgRating),
      vsTop10Label: vsLabel(b.yourBusiness.avgRating, b.top10Percent.avgRating, b.categoryAverage.avgRating),
    },
    {
      label: 'Response Rate',
      hint: 'Weighted response rate (%)',
      yours: fmt(b.yourBusiness.wrr) + '%',
      top10: fmt(b.top10Percent.wrr) + '%',
      catAvg: fmt(b.categoryAverage.wrr) + '%',
      vsTop10Class: vsClass(b.yourBusiness.wrr, b.top10Percent.wrr, b.categoryAverage.wrr),
      vsTop10Label: vsLabel(b.yourBusiness.wrr, b.top10Percent.wrr, b.categoryAverage.wrr),
    },
    {
      label: 'Recency Score',
      hint: 'Reviews in last 6 months ÷ total',
      yours: fmt(b.yourBusiness.recencyScore * 100) + '%',
      top10: fmt(b.top10Percent.recencyScore * 100) + '%',
      catAvg: fmt(b.categoryAverage.recencyScore * 100) + '%',
      vsTop10Class: vsClass(b.yourBusiness.recencyScore, b.top10Percent.recencyScore, b.categoryAverage.recencyScore),
      vsTop10Label: vsLabel(b.yourBusiness.recencyScore, b.top10Percent.recencyScore, b.categoryAverage.recencyScore),
    },
    {
      label: 'Positive Reviews',
      hint: 'Percentage rated ≥ 4 stars',
      yours: fmt(b.yourBusiness.positivePct) + '%',
      top10: fmt(b.top10Percent.positivePct) + '%',
      catAvg: fmt(b.categoryAverage.positivePct) + '%',
      vsTop10Class: vsClass(b.yourBusiness.positivePct, b.top10Percent.positivePct, b.categoryAverage.positivePct),
      vsTop10Label: vsLabel(b.yourBusiness.positivePct, b.top10Percent.positivePct, b.categoryAverage.positivePct),
    },
    {
      label: 'Negative Reviews',
      hint: 'Percentage rated < 3 stars',
      yours: fmt(b.yourBusiness.negativePct) + '%',
      top10: fmt(b.top10Percent.negativePct) + '%',
      catAvg: fmt(b.categoryAverage.negativePct) + '%',
      // Lower is better for negative reviews
      vsTop10Class: vsClass(b.yourBusiness.negativePct, b.top10Percent.negativePct, b.categoryAverage.negativePct, false),
      vsTop10Label: vsLabel(b.yourBusiness.negativePct, b.top10Percent.negativePct, b.categoryAverage.negativePct, false),
    },
  ]
})

/** Rank badge colour/message based on percentile position */
const rankPercentile = computed(() => {
  const b = competitiveBenchmark.value
  if (!b || b.totalBusinessesInCategory === 0) return 100
  return Math.round((b.yourRank / b.totalBusinessesInCategory) * 100)
})

const rankBadgeClass = computed(() => {
  const p = rankPercentile.value
  if (p <= 10) return 'bg-green-50 border border-green-200'
  if (p <= 25) return 'bg-blue-50 border border-blue-200'
  if (p <= 50) return 'bg-yellow-50 border border-yellow-200'
  return 'bg-gray-50 border border-gray-200'
})
const rankBadgeIconClass = computed(() => {
  const p = rankPercentile.value
  if (p <= 10) return 'text-green-600'
  if (p <= 25) return 'text-blue-500'
  if (p <= 50) return 'text-yellow-500'
  return 'text-gray-400'
})
const rankBadgeTextClass = computed(() => {
  const p = rankPercentile.value
  if (p <= 10) return 'text-green-800'
  if (p <= 25) return 'text-blue-800'
  if (p <= 50) return 'text-yellow-800'
  return 'text-gray-700'
})
const rankBadgeSubClass = computed(() => {
  const p = rankPercentile.value
  if (p <= 10) return 'text-green-600'
  if (p <= 25) return 'text-blue-600'
  if (p <= 50) return 'text-yellow-600'
  return 'text-gray-500'
})
const rankMessage = computed(() => {
  const p = rankPercentile.value
  if (p <= 10) return 'You are in the top 10% of your category — excellent work!'
  if (p <= 25) return 'You are in the top 25% of your category — keep it up!'
  if (p <= 50) return 'You are above the category average — room to grow.'
  return 'There is an opportunity to improve your standing in this category.'
})

function formatBenchmarkDate(iso: string): string {
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
  catch { return '' }
}

// ── Opinion helpers ──────────────────────────────────────────────────────────
function uniqueOpinions(opinions: string[]): string[] {
  return [...new Set(opinions)]
}
function uniqueOpinionsPreview(opinions: string[]): string {
  return uniqueOpinions(opinions).slice(0, 2).join(', ')
}

// ── Misc ─────────────────────────────────────────────────────────────────────
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