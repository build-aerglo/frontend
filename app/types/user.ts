export interface Badge {
  name: string
  icon: string
  color: string
}

export interface Review {
  id: number
  businessName: string
  location: string
  date: string
  status?: string
  body: string
  rating: number
  author?: string
}

export interface Ad {
  id: number
  business: string
  image: string
  tagline: string
}

export interface EditFormData {
  username: string
  phoneNumber: string
  address: string
}

export interface ProfileData {
  userId: string
  username: string
  email: string
  phone: string | null
  address: string | null
  socialMedia: string | null
  notificationPreferences: any | null
  darkMode: boolean | null
  userSettings: any | null
  totalReviews: number
}