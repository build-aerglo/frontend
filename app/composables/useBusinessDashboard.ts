import { ref } from 'vue'

export interface BusinessInfo {
  name: string
  category: string
  image: string
  averageRating: number
  totalReviews: number
}

export function useBusinessDashboard() {
  
  
  const businessInfo = ref<BusinessInfo>({
    name: 'The Cozy Cafe',
    category: 'Coffee & Cafes',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop',
    averageRating: 4.6,
    totalReviews: 1
  })

  return {
    businessInfo,
  }
}
