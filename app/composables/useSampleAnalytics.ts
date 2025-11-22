import { ref, computed } from 'vue'
import { useBusinessDashboard } from '~/composables/useBusinessDashboard'

interface Metric {
  title: string
  value: string
  trend: number
  icon: string
  iconColor: string
  bgColor: string
}

interface PerformanceData {
  period: string
  rating: number
  reviews: number
  clicks: number
}

export function useSampleAnalytics() {
  const selectedMetric = ref('rating')

  const { businessInfo } = useBusinessDashboard()

  const performanceMetrics = [
    { label: 'Ratings', value: 'rating' },
    { label: 'Reviews', value: 'reviews' },
    { label: 'Profile Clicks', value: 'clicks' }
  ]

  const keyMetrics: Metric[] = [
    {
      title: 'Average Rating',
      value: '4.6',
      trend: 8.2,
      icon: 'pi pi-star-fill',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Total Reviews',
      value: '1,248',
      trend: 12.5,
      icon: 'pi pi-comments',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Profile Views',
      value: '8,432',
      trend: 15.3,
      icon: 'pi pi-eye',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Response Rate',
      value: '94%',
      trend: 5.1,
      icon: 'pi pi-reply',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  const sentimentData = [
    { name: 'Positive', value: 65, color: '#10b981' },
    { name: 'Neutral', value: 20, color: '#f59e0b' },
    { name: 'Negative', value: 15, color: '#ef4444' }
  ]

  const positiveWords = [
    { text: 'Excellent', size: 48 },
    { text: 'Great', size: 44 },
    { text: 'Professional', size: 40 },
    { text: 'Quality', size: 36 },
    { text: 'Reliable', size: 32 },
    { text: 'Helpful', size: 28 }
  ]

  const negativeWords = [
    { text: 'Slow', size: 48 },
    { text: 'Expensive', size: 44 },
    { text: 'Delay', size: 40 },
    { text: 'Poor', size: 36 },
    { text: 'Difficult', size: 32 }
  ]

  const performanceData: PerformanceData[] = [
    { period: 'Mon', rating: 4.5, reviews: 12, clicks: 145 },
    { period: 'Tue', rating: 4.3, reviews: 15, clicks: 178 },
    { period: 'Wed', rating: 4.6, reviews: 18, clicks: 192 },
    { period: 'Thu', rating: 4.4, reviews: 14, clicks: 165 },
    { period: 'Fri', rating: 4.7, reviews: 22, clicks: 210 },
    { period: 'Sat', rating: 4.8, reviews: 25, clicks: 235 },
    { period: 'Sun', rating: 4.6, reviews: 20, clicks: 198 }
  ]

  const currentStats = computed(() => ({
    avgRating: '4.6',
    totalReviews: performanceData.reduce((sum, d) => sum + d.reviews, 0),
    totalClicks: performanceData.reduce((sum, d) => sum + d.clicks, 0)
  }))

  const chartPoints = computed(() => {
    const metricKey = selectedMetric.value as keyof PerformanceData
    const values = performanceData.map((d) => d[metricKey] as number)
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min || 1

    return performanceData.map((d, i) => {
      const value = d[metricKey] as number
      const x = 50 + (i * 700) / (performanceData.length - 1)
      const y = 250 - ((value - min) / range) * 200
      return { x, y }
    })
  })

  const chartPath = computed(() => {
    if (!chartPoints.value.length) return ''
    let path = `M ${chartPoints.value[0]!.x} ${chartPoints.value[0]!.y}`
    chartPoints.value.forEach((p, i) => {
      if (i > 0) path += ` L ${p.x} ${p.y}`
    })
    return path
  })

  const reviewSources = [
    { name: 'Google', count: 524, icon: 'pi pi-google', color: 'text-red-600' },
    { name: 'Facebook', count: 312, icon: 'pi pi-facebook', color: 'text-blue-600' },
    { name: 'Website', count: 268, icon: 'pi pi-globe', color: 'text-gray-600' },
    { name: 'App Store', count: 144, icon: 'pi pi-mobile', color: 'text-indigo-600' }
  ]

  const monthlyTrend = [
    { month: 'September', rating: 4.5, change: +0.2 },
    { month: 'October', rating: 4.6, change: +0.1 },
    { month: 'November', rating: 4.4, change: -0.2 }
  ]

  const competitorPositiveWords = [
    { text: 'Affordable', size: 48 },
    { text: 'Quick', size: 46 },
    { text: 'Helpful', size: 40 },
    { text: 'Smooth', size: 38 }
  ]

  const competitorNegativeWords = [
    { text: 'Inconsistent', size: 44 },
    { text: 'Late', size: 40 },
    { text: 'Unresponsive', size: 36 },
    { text: 'Complicated', size: 32 }
  ]

  const improvements = [
    {
      title: 'Faster Delivery',
      description: 'Customers reported significantly faster order processing time.',
      impact: 12
    },
    {
      title: 'Better Communication',
      description: 'More prompt replies to customer inquiries improved satisfaction.',
      impact: 9
    }
  ]

  const issues = [
    {
      title: 'High Pricing Concern',
      description: 'A portion of customers still feel pricing is slightly high.',
      priority: 'Medium'
    },
    {
      title: 'Occasional Delays',
      description: 'Delivery delays occurred during peak hours.',
      priority: 'High'
    }
  ]

  return {
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
  }
}
