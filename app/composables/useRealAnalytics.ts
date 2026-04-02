import { ref, computed } from 'vue'
import { useAnalyticsApi } from '~/composables/useAnalyticsApi'
import useBusinessUser from '~/composables/business/useBusinessUser'
import type {
    AnalyticsDashboard,
    AspectSentimentData,
    TimeSeriesPoint,
    CompetitiveBenchmark,
    BenchmarkRow,
} from '~/composables/useAnalyticsApi'

// ─────────────────────────────────────────────────────────
// Dashboard-specific shapes (what the template consumes)
// ─────────────────────────────────────────────────────────

export interface Metric {
    title: string
    value: string
    subtitle: string | null
    trend: number
    icon: string
    iconColor: string
    bgColor: string
}

export interface SentimentBar {
    name: string
    value: number
    color: string
}

export interface WordItem {
    text: string
    size: number
}

export interface ChartPoint {
    x: number
    y: number
}

export interface PerformancePoint {
    period: string
    rating: number
    reviews: number
}

export interface ReviewSource {
    name: string
    count: number
    icon: string
    color: string
}

export interface MonthlyTrendRow {
    month: string
    rating: number
    change: number
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function keywordSize(count: number, maxCount: number): number {
    if (maxCount === 0) return 18
    return Math.round(14 + ((count / maxCount) * 30))
}

function formatTrend(pct: number): number {
    return Math.round(pct * 10) / 10
}

function toPerformancePoints(
    points: TimeSeriesPoint[],
    periodType?: 'daily' | 'weekly' | 'monthly'
): PerformancePoint[] {
    return [...points].reverse().map((p, i) => {
        let label = p.date

        if (periodType === 'weekly') {
            label = `Week ${i + 1}`
        } else if (p.date.length === 10) {
            const d = new Date(p.date)
            label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        } else if (p.date.match(/^\d{4}-\d{2}$/)) {
            const d = new Date(`${p.date}-01`)
            label = d.toLocaleDateString('en-US', { month: 'short' })
        }

        return {
            period: label,
            rating: Number(p.avgRating),
            reviews: p.count,
        }
    })
}

export interface YTick { y: number; label: string }

function buildChartGeometry(
    values: number[],
    minOverride?: number,
    maxOverride?: number,
    isRating?: boolean,
) {
    if (values.length < 2) {
        return { points: [] as ChartPoint[], path: '', yTicks: [] as YTick[] }
    }

    const scaleMin = minOverride !== undefined ? minOverride : 0
    const scaleMax = maxOverride !== undefined ? maxOverride : Math.max(...values)
    const range = scaleMax === scaleMin ? 1 : scaleMax - scaleMin

    const points: ChartPoint[] = values.map((v, i) => ({
        x: 55 + (i * 335) / (values.length - 1),
        y: 215 - ((v - scaleMin) / range) * 180,
    }))

    let path = `M ${points[0]!.x} ${points[0]!.y}`
    for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i]!.x} ${points[i]!.y}`
    }

    const tickCount = 4
    const yTicks: YTick[] = []
    for (let i = 0; i <= tickCount; i++) {
        const value = scaleMin + (range * i / tickCount)
        const y = 215 - (i / tickCount) * 180
        const label = isRating ? value.toFixed(1) : Math.round(value).toString()
        yTicks.push({ y, label })
    }

    return { points, path, yTicks }
}

const SOURCE_ICON_MAP: Record<string, { icon: string; color: string }> = {
    direct: { icon: 'pi pi-star', color: 'text-green-600' },
    google: { icon: 'pi pi-google', color: 'text-red-600' },
    facebook: { icon: 'pi pi-facebook', color: 'text-blue-600' },
    twitter: { icon: 'pi pi-twitter', color: 'text-sky-500' },
    instagram: { icon: 'pi pi-instagram', color: 'text-pink-500' },
    yelp: { icon: 'pi pi-globe', color: 'text-red-500' },
}

function sourceIcon(key: string): { icon: string; color: string } {
    return SOURCE_ICON_MAP[key.toLowerCase()] ?? { icon: 'pi pi-globe', color: 'text-gray-600' }
}

// ─────────────────────────────────────────────────────────
// Main composable
// ─────────────────────────────────────────────────────────

export function useRealAnalytics() {
    const { fetchDashboard, fetchLatest, triggerRecalculation } = useAnalyticsApi()
    const businessStore = useBusinessUser()

    const raw = ref<AnalyticsDashboard | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const triggering = ref(false)
    const triggerError = ref<string | null>(null)
    const triggerSuccess = ref(false)
    const lastTriggeredAt = ref<string | null>(null)

    async function load() {
        const businessId = businessStore.id as string | undefined
        if (!businessId) {
            error.value = 'No business ID found. Please make sure you are logged in.'
            return
        }

        loading.value = true
        error.value = null

        try {
            raw.value = await fetchDashboard(businessId)
        } catch (e: any) {
            if (e?.response?.status === 404) {
                error.value =
                    'No analytics data yet. The system runs every hour automatically. ' +
                    'You can also trigger a manual recalculation using the Refresh button.'
            } else {
                error.value = 'Failed to load analytics. Please try again.'
            }
        } finally {
            loading.value = false
        }
    }

    async function triggerAndRefresh() {
        const businessId = businessStore.id as string | undefined
        if (!businessId || triggering.value) return

        triggering.value = true
        triggerError.value = null
        triggerSuccess.value = false

        try {
            const result = await triggerRecalculation(businessId)
            raw.value = await fetchLatest(businessId)

            triggerSuccess.value = true
            lastTriggeredAt.value = new Date(result.processedAt).toLocaleTimeString()
            setTimeout(() => { triggerSuccess.value = false }, 4000)
        } catch (e: any) {
            triggerError.value =
                e?.message?.includes('analyticsFunctionUrl')
                    ? 'Analytics function URL is not configured.'
                    : 'Recalculation failed. Please try again shortly.'
            setTimeout(() => { triggerError.value = null }, 5000)
        } finally {
            triggering.value = false
        }
    }

    // ── Derived data ───────────────────────────────────────────────────────

    const metrics = computed(() => raw.value?.metrics ?? null)
    const sentiment = computed(() => metrics.value?.sentiment ?? null)
    const timeSeries = computed(() => metrics.value?.timeSeries ?? null)
    const trends = computed(() => metrics.value?.trends ?? null)
    const engagement = computed(() => metrics.value?.engagement ?? null)
    const response = computed(() => metrics.value?.responseMetrics ?? null)
    const sources = computed(() => metrics.value?.sources ?? {})

    // ── Competitive benchmark ──────────────────────────────────────────────
    // Benchmark lives at the top level of the dashboard response — NOT inside metrics.
    // It reflects the category_benchmark table (shared across all businesses in the category).
    const competitiveBenchmark = computed(
        (): CompetitiveBenchmark | null => raw.value?.competitiveBenchmark ?? null
    )

    // ── Key metrics cards ──────────────────────────────────────────────────
    const keyMetrics = computed((): Metric[] => {
        const r = raw.value
        if (!r) return []

        const ratingTrend = formatTrend(Number(trends.value?.ratingTrendPct ?? 0))
        const reviewTrend = formatTrend(Number(trends.value?.reviewTrendPct ?? 0))
        const responseRate = Number(response.value?.responseRate ?? 0)
        const views = engagement.value?.profileViews ?? 0
        const plain = Number(r.averageRating).toFixed(1)

        return [
            {
                title: 'Average Rating', value: plain, subtitle: null,
                trend: ratingTrend, icon: 'pi pi-star-fill',
                iconColor: 'text-yellow-500', bgColor: 'bg-yellow-100',
            },
            {
                title: 'Total Reviews', value: r.totalReviews.toLocaleString(), subtitle: null,
                trend: reviewTrend, icon: 'pi pi-comments',
                iconColor: 'text-purple-600', bgColor: 'bg-purple-100',
            },
            {
                title: 'Profile Views', value: views.toLocaleString(), subtitle: null,
                trend: 0, icon: 'pi pi-eye',
                iconColor: 'text-blue-600', bgColor: 'bg-blue-100',
            },
            {
                title: 'Response Rate', value: `${Math.round(responseRate)}%`, subtitle: null,
                trend: 0, icon: 'pi pi-reply',
                iconColor: 'text-green-600', bgColor: 'bg-green-100',
            },
        ]
    })

    const sentimentData = computed((): SentimentBar[] => {
        if (!sentiment.value) return []
        return [
            { name: 'Positive', value: Number(sentiment.value.positivePct), color: '#10b981' },
            { name: 'Neutral', value: Number(sentiment.value.neutralPct), color: '#f59e0b' },
            { name: 'Negative', value: Number(sentiment.value.negativePct), color: '#ef4444' },
        ]
    })

    const positiveWords = computed((): WordItem[] => {
        const kws = sentiment.value?.keywords?.positive ?? []
        const max = Math.max(...kws.map(k => k.count), 1)
        return kws.map(k => ({ text: k.text, size: keywordSize(k.count, max) }))
    })

    const negativeWords = computed((): WordItem[] => {
        const kws = sentiment.value?.keywords?.negative ?? []
        const max = Math.max(...kws.map(k => k.count), 1)
        return kws.map(k => ({ text: k.text, size: keywordSize(k.count, max) }))
    })

    const aspects = computed((): AspectSentimentData[] => sentiment.value?.aspects ?? [])

    const performanceDataByPeriod = computed(() => ({
        daily: toPerformancePoints((timeSeries.value?.daily ?? []).slice(0, 7), 'daily'),
        weekly: toPerformancePoints((timeSeries.value?.weekly ?? []).slice(0, 4), 'weekly'),
        monthly: toPerformancePoints((timeSeries.value?.monthly ?? []).slice(0, 6), 'monthly'),
    }))

    const reviewSources = computed((): ReviewSource[] => {
        const SOURCE_NAME_OVERRIDE: Record<string, string> = { direct: 'CleReview' }
        return Object.entries(sources.value).map(([key, count]) => {
            const { icon, color } = sourceIcon(key)
            const name = SOURCE_NAME_OVERRIDE[key.toLowerCase()]
                ?? (key.charAt(0).toUpperCase() + key.slice(1))
            return { name, count, icon, color }
        })
    })

    const monthlyTrend = computed((): MonthlyTrendRow[] => {
        const monthly = timeSeries.value?.monthly ?? []
        return [...monthly]
            .slice(-3)
            .reverse()
            .map((p, i, arr) => {
                const prev = arr[i + 1]
                const d = new Date(`${p.date}-01`)
                const month = d.toLocaleDateString('en-US', { month: 'long' })
                const change = prev
                    ? Math.round((Number(p.avgRating) - Number(prev.avgRating)) * 10) / 10
                    : 0
                return { month, rating: Number(p.avgRating), change }
            })
    })

    function buildChart(period: 'daily' | 'weekly' | 'monthly', type: 'ratings' | 'volume') {
        const data = performanceDataByPeriod.value[period]
        const values = data.map(d => type === 'ratings' ? d.rating : d.reviews)
        const minOverride = type === 'ratings' ? 1 : 0
        const maxOverride = type === 'ratings' ? 5 : Math.max(...values, 1)
        return { data, ...buildChartGeometry(values, minOverride, maxOverride, type === 'ratings') }
    }

    const lastCalculatedAt = computed(() => {
        if (!raw.value?.lastCalculatedAt) return null
        return new Date(raw.value.lastCalculatedAt).toLocaleString()
    })

    const hasData = computed(() => raw.value !== null && raw.value.metrics !== null)

    return {
        // State
        loading, error, hasData, lastCalculatedAt,

        // Trigger
        triggering, triggerError, triggerSuccess, lastTriggeredAt, triggerAndRefresh,

        // Actions
        load,

        // Dashboard-ready data
        keyMetrics, sentimentData, positiveWords, negativeWords,
        aspects, reviewSources, monthlyTrend, performanceDataByPeriod, buildChart,

        // Competitive benchmark (new)
        competitiveBenchmark,
    }
}