

import { ref, computed, watch } from 'vue'
import { useAnalyticsApi } from '~/composables/useAnalyticsApi'
import useBusinessUser from '~/composables/business/useBusinessUser'
import type { AnalyticsDashboard, AspectSentimentData, TimeSeriesPoint } from '~/composables/useAnalyticsApi'

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

/** Map a keyword count to a display font size (clamped 14–44px). */
function keywordSize(count: number, maxCount: number): number {
    if (maxCount === 0) return 18
    return Math.round(14 + ((count / maxCount) * 30))
}

/** Format a decimal trend percentage as a rounded number for display. */
function formatTrend(pct: number): number {
    return Math.round(pct * 10) / 10
}

/**
 * Convert a TimeSeriesPoint array into chart-ready PerformancePoint[].
 * The date field from the API can be "2026-03-10" (daily), "2026-11" (weekly
 * ISO week), or "2026-03" (monthly). We derive a short label for the axis.
 */
function toPerformancePoints(points: TimeSeriesPoint[]): PerformancePoint[] {
    return [...points].reverse().map((p) => {
        // Derive a short axis label
        let label = p.date
        if (p.date.length === 10) {
            // daily: "2026-03-10" → "Mar 10"
            const d = new Date(p.date)
            label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        } else if (p.date.match(/^\d{4}-\d{2}$/)) {
            // monthly: "2026-03" → "Mar"
            const d = new Date(`${p.date}-01`)
            label = d.toLocaleDateString('en-US', { month: 'short' })
        } else if (p.date.match(/^\d{4}-\d{2}$/)) {
            // weekly: "2026-11" → "Wk 11"
            const parts = p.date.split('-')
            label = `Wk ${parts[1]}`
        }

        return {
            period: label,
            rating: Number(p.avgRating),
            reviews: p.count,
        }
    })
}

/** Build SVG path + points from a value array, normalized into a 40–360 x, 40–210 y box. */
function buildChartGeometry(values: number[], maxOverride?: number) {
    if (values.length < 2) {
        return { points: [] as ChartPoint[], path: '' }
    }
    const max = maxOverride ?? Math.max(...values)
    const min = Math.min(...values)
    const range = max === min ? 1 : max - min

    const points: ChartPoint[] = values.map((v, i) => ({
        x: 40 + (i * 320) / (values.length - 1),
        y: 210 - ((v - min) / range) * 170,
    }))

    let path = `M ${points[0]!.x} ${points[0]!.y}`
    for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i]!.x} ${points[i]!.y}`
    }

    return { points, path }
}

// Source name → PrimeIcons icon + color mapping
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

    // ── State ─────────────────────────────────────────────
    const raw = ref<AnalyticsDashboard | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const triggering = ref(false)
    const triggerError = ref<string | null>(null)
    const triggerSuccess = ref(false)
    const lastTriggeredAt = ref<string | null>(null)

    // ── Fetch ─────────────────────────────────────────────

    async function load() {
        const businessId = businessStore.businessId as string | undefined
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

    /**
     * Trigger the AnalyticsFunction to recalculate, then fetch fresh data.
     * Shows a success/error banner for 4 seconds.
     */
    async function triggerAndRefresh() {
        const businessId = businessStore.businessId as string | undefined
        if (!businessId || triggering.value) return

        triggering.value = true
        triggerError.value = null
        triggerSuccess.value = false

        try {
            // The function awaits the full pipeline before responding,
            // so the response arriving means writing is done — fetch immediately.
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

    // ── Derived data (computed) ───────────────────────────

    const metrics = computed(() => raw.value?.metrics ?? null)
    const sentiment = computed(() => metrics.value?.sentiment ?? null)
    const timeSeries = computed(() => metrics.value?.timeSeries ?? null)
    const trends = computed(() => metrics.value?.trends ?? null)
    const engagement = computed(() => metrics.value?.engagement ?? null)
    const response = computed(() => metrics.value?.responseMetrics ?? null)
    const sources = computed(() => metrics.value?.sources ?? {})

    // Key metrics cards
    const keyMetrics = computed((): Metric[] => {
        const r = raw.value
        if (!r) return []

        const ratingTrend = formatTrend(Number(trends.value?.ratingTrendPct ?? 0))
        const reviewTrend = formatTrend(Number(trends.value?.reviewTrendPct ?? 0))
        const responseRate = Number(response.value?.responseRate ?? 0)
        const views = engagement.value?.profileViews ?? 0

        // Use bayesian for the displayed rating — it's the honest number.
        // Show plain average as a subtitle so the owner can see both.
        const bayesian = Number(r.bayesianAverageRating).toFixed(1)
        const plain = Number(r.averageRating).toFixed(1)

        return [
            {
                title: 'Rating (Bayesian)',
                value: bayesian,
                subtitle: `Plain avg: ${plain}`,
                trend: ratingTrend,
                icon: 'pi pi-star-fill',
                iconColor: 'text-yellow-500',
                bgColor: 'bg-yellow-100',
            },
            {
                title: 'Total Reviews',
                value: r.totalReviews.toLocaleString(),
                subtitle: null,
                trend: reviewTrend,
                icon: 'pi pi-comments',
                iconColor: 'text-purple-600',
                bgColor: 'bg-purple-100',
            },
            {
                title: 'Profile Views',
                value: views.toLocaleString(),
                subtitle: null,
                trend: 0,
                icon: 'pi pi-eye',
                iconColor: 'text-blue-600',
                bgColor: 'bg-blue-100',
            },
            {
                title: 'Response Rate',
                value: `${Math.round(responseRate * 100)}%`,
                subtitle: null,
                trend: 0,
                icon: 'pi pi-reply',
                iconColor: 'text-green-600',
                bgColor: 'bg-green-100',
            },
        ]
    })

    // Sentiment bars
    const sentimentData = computed((): SentimentBar[] => {
        if (!sentiment.value) return []
        return [
            { name: 'Positive', value: Number(sentiment.value.positivePct), color: '#10b981' },
            { name: 'Neutral', value: Number(sentiment.value.neutralPct), color: '#f59e0b' },
            { name: 'Negative', value: Number(sentiment.value.negativePct), color: '#ef4444' },
        ]
    })

    // Keyword clouds — sized relative to the most frequent keyword
    const positiveWords = computed((): WordItem[] => {
        const kws = sentiment.value?.keywords?.positive ?? []
        const max = Math.max(...kws.map((k) => k.count), 1)
        return kws.map((k) => ({ text: k.text, size: keywordSize(k.count, max) }))
    })

    const negativeWords = computed((): WordItem[] => {
        const kws = sentiment.value?.keywords?.negative ?? []
        const max = Math.max(...kws.map((k) => k.count), 1)
        return kws.map((k) => ({ text: k.text, size: keywordSize(k.count, max) }))
    })

    // Aspect opinion mining results
    const aspects = computed((): AspectSentimentData[] => {
        return sentiment.value?.aspects ?? []
    })

    // Time-series performance data for chart (keyed by period)
    const performanceDataByPeriod = computed(() => ({
        daily: toPerformancePoints(timeSeries.value?.daily ?? []),
        weekly: toPerformancePoints(timeSeries.value?.weekly ?? []),
        monthly: toPerformancePoints(timeSeries.value?.monthly ?? []),
    }))

    // Review sources array for the sources grid
    const reviewSources = computed((): ReviewSource[] => {
        return Object.entries(sources.value).map(([key, count]) => {
            const { icon, color } = sourceIcon(key)
            const name = key.charAt(0).toUpperCase() + key.slice(1)
            return { name, count, icon, color }
        })
    })

    // Monthly trend (last 3 months) for the comparison table
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

    // Chart geometry builders (called by the template with selectedPeriod + selectedChartType)
    function buildChart(
        period: 'daily' | 'weekly' | 'monthly',
        type: 'ratings' | 'volume'
    ) {
        const data = performanceDataByPeriod.value[period]
        const values = data.map((d) => (type === 'ratings' ? d.rating : d.reviews))
        const maxOverride = type === 'ratings' ? 5 : undefined
        return {
            data,
            ...buildChartGeometry(values, maxOverride),
        }
    }

    // Last calculated time (formatted)
    const lastCalculatedAt = computed(() => {
        if (!raw.value?.lastCalculatedAt) return null
        return new Date(raw.value.lastCalculatedAt).toLocaleString()
    })

    // Whether we have any data at all
    const hasData = computed(() => raw.value !== null && raw.value.metrics !== null)

    return {
        // State
        loading,
        error,
        hasData,
        lastCalculatedAt,

        // Trigger
        triggering,
        triggerError,
        triggerSuccess,
        lastTriggeredAt,
        triggerAndRefresh,

        // Actions
        load,

        // Dashboard-ready data
        keyMetrics,
        sentimentData,
        positiveWords,
        negativeWords,
        aspects,
        reviewSources,
        monthlyTrend,
        performanceDataByPeriod,
        buildChart,
    }
}