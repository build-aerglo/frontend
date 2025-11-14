import { ref } from 'vue'

export interface BusinessInfo {
  name: string
  category: string
  image: string
  averageRating: number
  totalReviews: number
}

export interface WordCloud {
  text: string
  size: number
}

export interface TimePeriod {
  label: string
  value: string
}

export interface DataPoint {
  label: string
  rating?: number
  count?: number
  clicks?: number
}

export interface ReviewSource {
  name: string
  icon: string
  color: string
  percentage: number
}

export interface Competitor {
  name: string
  rating: number
  isYou: boolean
}

export interface MonthlyData {
  month: string
  rating: number
  change: number
}

export interface Suggestion {
  title: string
  description: string
  suggestion?: string
}

export function useBusinessDashboard() {
  const selectedPeriod = ref<string>('weekly')

  const timePeriods = ref<TimePeriod[]>([
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
  ])

  const businessInfo = ref<BusinessInfo>({
    name: 'The Cozy Cafe',
    category: 'Coffee & Cafes',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop',
    averageRating: 4.5,
    totalReviews: 127
  })

  const positiveWords = ref<WordCloud[]>([
    { text: 'Excellent', size: 32 },
    { text: 'Amazing', size: 28 },
    { text: 'Friendly', size: 24 },
    { text: 'Delicious', size: 26 },
    { text: 'Cozy', size: 22 },
    { text: 'Clean', size: 20 },
    { text: 'Fast', size: 18 },
    { text: 'Quality', size: 24 },
    { text: 'Professional', size: 20 },
    { text: 'Recommend', size: 30 }
  ])

  const negativeWords = ref<WordCloud[]>([
    { text: 'Slow', size: 24 },
    { text: 'Expensive', size: 20 },
    { text: 'Crowded', size: 22 },
    { text: 'Wait', size: 18 },
    { text: 'Noise', size: 16 },
    { text: 'Limited', size: 18 }
  ])

  const sentimentData = ref({
    positive: 68,
    neutral: 22,
    negative: 10
  })

  const ratingOverTime = ref<DataPoint[]>([
    { label: 'Week 1', rating: 4.3 },
    { label: 'Week 2', rating: 4.4 },
    { label: 'Week 3', rating: 4.5 },
    { label: 'Week 4', rating: 4.6 }
  ])

  const reviewVolume = ref<DataPoint[]>([
    { label: 'Week 1', count: 23 },
    { label: 'Week 2', count: 31 },
    { label: 'Week 3', count: 28 },
    { label: 'Week 4', count: 35 }
  ])

  const profileClicks = ref<DataPoint[]>([
    { label: 'Week 1', clicks: 156 },
    { label: 'Week 2', clicks: 189 },
    { label: 'Week 3', clicks: 203 },
    { label: 'Week 4', clicks: 221 }
  ])

  const reviewSources = ref<ReviewSource[]>([
    { name: 'Direct Search', icon: 'pi pi-search', color: 'text-blue-600', percentage: 45 },
    { name: 'Social Media', icon: 'pi pi-share-alt', color: 'text-purple-600', percentage: 30 },
    { name: 'Google Maps', icon: 'pi pi-map', color: 'text-red-600', percentage: 15 },
    { name: 'Referrals', icon: 'pi pi-users', color: 'text-green-600', percentage: 10 }
  ])

  const competitorRatings = ref<Competitor[]>([
    { name: 'Your Business (The Cozy Cafe)', rating: 4.5, isYou: true },
    { name: 'Cafe Neo', rating: 4.3, isYou: false },
    { name: 'Java House', rating: 4.6, isYou: false },
    { name: 'Bean Scene', rating: 4.2, isYou: false }
  ])

  const competitorPositiveWords = ref<WordCloud[]>([
    { text: 'Good', size: 28 },
    { text: 'Nice', size: 24 },
    { text: 'Quick', size: 22 },
    { text: 'Tasty', size: 20 },
    { text: 'Spacious', size: 18 },
    { text: 'Friendly', size: 26 }
  ])

  const competitorNegativeWords = ref<WordCloud[]>([
    { text: 'Pricey', size: 22 },
    { text: 'Slow', size: 20 },
    { text: 'Small', size: 18 },
    { text: 'Noisy', size: 16 }
  ])

  const monthlyComparison = ref<MonthlyData[]>([
    { month: 'September', rating: 4.3, change: -2 },
    { month: 'October', rating: 4.4, change: 2 },
    { month: 'November', rating: 4.5, change: 2 }
  ])

  const improvements = ref<Suggestion[]>([
    {
      title: 'Customer Service Quality',
      description: 'Reviews mentioning "friendly staff" increased by 25% this month.'
    },
    {
      title: 'Speed of Service',
      description: 'Average wait time reduced from 10 to 7 minutes based on customer feedback.'
    },
    {
      title: 'Ambiance & Cleanliness',
      description: 'Positive mentions of "clean" and "cozy" atmosphere up by 18%.'
    }
  ])

  const needsImprovement = ref<Suggestion[]>([
    {
      title: 'Pricing Concerns',
      description: '"Expensive" mentioned in 15% of recent reviews.',
      suggestion: 'Consider introducing loyalty programs or combo deals to improve perceived value.'
    },
    {
      title: 'Peak Hour Crowding',
      description: 'Negative feedback about crowding increased by 12%.',
      suggestion: 'Implement a reservation system or expand seating during peak hours.'
    },
    {
      title: 'Menu Variety',
      description: 'Several reviews mention limited food options.',
      suggestion: 'Survey customers about desired menu additions and test new items monthly.'
    }
  ])

  const handleSignOut = () => {
    console.log('Sign out clicked')
  }

  const handleImageError = (e: Event) => {
    const target = e.target as HTMLImageElement
    target.src = 'https://via.placeholder.com/100'
  }

  const getMaxReviewCount = (): number => {
    return Math.max(...reviewVolume.value.map(v => v.count || 0))
  }

  const getMaxClicks = (): number => {
    return Math.max(...profileClicks.value.map(v => v.clicks || 0))
  }

  return {
    selectedPeriod,
    timePeriods,
    businessInfo,
    positiveWords,
    negativeWords,
    sentimentData,
    ratingOverTime,
    reviewVolume,
    profileClicks,
    reviewSources,
    competitorRatings,
    competitorPositiveWords,
    competitorNegativeWords,
    monthlyComparison,
    improvements,
    needsImprovement,
    handleSignOut,
    handleImageError,
    getMaxReviewCount,
    getMaxClicks
  }
}
