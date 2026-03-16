

import useApi from '~/composables/useApi'
import useBusinessUser from '~/composables/business/useBusinessUser'
import useBusinessApi from '~/composables/business/useBusinessApi'


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
    aspects: AspectSentimentData[]   // opinion-mined aspect data
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
     *
     * Targets the function app URL (analyticsFunctionUrl in runtimeConfig),
     * NOT the BusinessService URL — these are different services.
     *
     * Pass businessId to recalculate one business only.
     * Omit to recalculate all businesses (admin use).
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

        // Use the business store token for auth — same token the BusinessService uses.
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