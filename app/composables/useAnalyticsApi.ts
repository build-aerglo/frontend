import useBusinessApi from '~/composables/business/useBusinessApi'
import useBusinessUser from '~/composables/business/useBusinessUser'

// ─────────────────────────────────────────────────────────
// Types that mirror BusinessAnalyticsDashboard.cs exactly
// ─────────────────────────────────────────────────────────

export interface KeywordItem {
    text: string
    count: number
}

export interface KeywordData {
    positive: KeywordItem[]
    negative: KeywordItem[]
}

export interface AspectSentimentData {
    aspect: string
    positiveCount: number
    negativeCount: number
    sentimentScore: number           // 0–1; 1 = fully positive
    positiveOpinions: string[]
    negativeOpinions: string[]
}

export interface SentimentMetrics {
    positivePct: number
    neutralPct: number
    negativePct: number
    keywords: KeywordData | null
    aspects: AspectSentimentData[]
}

export interface ResponseMetrics {
    responseRate: number
    weightedResponseRate: number
    avgResponseTimeHours: number
    totalResponses: number
    positiveReplied: number
    neutralReplied: number
    negativeReplied: number
}

export interface TimeSeriesPoint {
    date: string
    count: number
    avgRating: number
    sentimentAvg: number
}

export interface TimeSeriesMetrics {
    daily: TimeSeriesPoint[]
    weekly: TimeSeriesPoint[]
    monthly: TimeSeriesPoint[]
}

export interface EngagementMetrics {
    helpfulVotes: number
    profileViews: number
    qrScans: number
}

export interface TrendMetrics {
    reviewsLast30: number
    reviewsPrev30: number
    ratingLast30: number
    ratingPrev30: number
    reviewTrendPct: number
    ratingTrendPct: number
}

// ─── Competitive Benchmarking types ──────────────────────────────────────────

/**
 * A single row of benchmarking metrics.
 * Used for yourBusiness, top10Percent, and categoryAverage.
 */
export interface BenchmarkRow {
    /** Bayesian average rating (0–5) */
    avgRating: number
    /** Weighted Response Rate as a percentage (0–100) */
    wrr: number
    /** Recency score (0–1): reviews in last 6 months / total reviews */
    recencyScore: number
    /** Percentage of reviews rated ≥ 4 stars */
    positivePct: number
    /** Percentage of reviews rated < 3 stars */
    negativePct: number
}

/**
 * Competitive benchmarking data — populated from the category_benchmark table via JOIN.
 * One row per category; updated whenever any business in the category is processed.
 */
export interface CompetitiveBenchmark {
    yourBusiness: BenchmarkRow
    top10Percent: BenchmarkRow
    categoryAverage: BenchmarkRow
    /** This business's rank in the category (1 = best) */
    yourRank: number
    /** Total businesses in the category with at least 1 review */
    totalBusinessesInCategory: number
    lastUpdatedAt: string
}

// ─────────────────────────────────────────────────────────

export interface AnalyticsMetrics {
    responseMetrics: ResponseMetrics | null
    sentiment: SentimentMetrics | null
    timeSeries: TimeSeriesMetrics | null
    sources: Record<string, number> | null
    engagement: EngagementMetrics | null
    trends: TrendMetrics | null
}

export interface AnalyticsDashboard {
    id: string
    businessId: string
    totalReviews: number
    /** Plain arithmetic average, rounded to 1dp. */
    averageRating: number
    /** Bayesian average, rounded to 1dp. Accounts for review volume. Use this for display. */
    bayesianAverageRating: number
    /**
     * Competitive benchmark — assembled from business_analytics scalar columns (yourBusiness)
     * and the category_benchmark JOIN (top10Percent / categoryAverage).
     * Always fresh: the category_benchmark row is updated whenever ANY business in the
     * category is processed, so all businesses see current data on every dashboard read.
     * Null if the business has no category or no approved reviews yet.
     */
    competitiveBenchmark: CompetitiveBenchmark | null
    metrics: AnalyticsMetrics | null
    lastCalculatedAt: string
    createdAt: string
    updatedAt: string
}

export interface TriggerResponse {
    message: string
    businessId?: string
    processedAt: string
}

// ─────────────────────────────────────────────────────────
// Composable
// ─────────────────────────────────────────────────────────

export function useAnalyticsApi() {
    const api = useBusinessApi()
    const config = useRuntimeConfig()
    const businessStore = useBusinessUser()

    /**
     * Fetch the pre-calculated analytics dashboard for a business.
     * Reads from business_analytics table (written by the Azure Function).
     * Cached 5 minutes on the server side.
     */
    async function fetchDashboard(businessId: string): Promise<AnalyticsDashboard> {
        const { data } = await api.get<AnalyticsDashboard>(
            `/api/businessanalytics/business/${businessId}/dashboard`
        )
        return data
    }

    /**
     * Fetch fresh data, bypassing the server-side cache.
     * Use after triggering a manual recalculation.
     */
    async function fetchLatest(businessId: string): Promise<AnalyticsDashboard> {
        const { data } = await api.get<AnalyticsDashboard>(
            `/api/businessanalytics/business/${businessId}/latest`
        )
        return data
    }

    /**
     * POST to the AnalyticsFunction HTTP trigger to force a recalculation.
     * Targets the function app URL (analyticsFunctionUrl in runtimeConfig).
     */
    async function triggerRecalculation(businessId?: string): Promise<TriggerResponse> {
        const functionUrl = config.public.analyticsFunctionUrl as string

        if (!functionUrl) {
            throw new Error(
                'analyticsFunctionUrl is not configured in runtimeConfig. ' +
                'Add ANALYTICS_FUNCTION_URL to your environment variables.'
            )
        }

        const body = businessId ? { businessId } : {}

        const response = await $fetch<TriggerResponse>(`${functionUrl}/api/trigger`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(businessStore.accessToken
                    ? { Authorization: `Bearer ${businessStore.accessToken}` }
                    : {}),
            },
            body: JSON.stringify(body),
        })

        return response
    }

    return {
        fetchDashboard,
        fetchLatest,
        triggerRecalculation,
    }
}