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

export interface NotificationPreferences {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
}

export interface ProfileData {
  userId: string
  username: string
  email: string
  phone: string | null
  address: string | null
  joinDate: string | null
  endUserProfileId: string | null
  socialMedia: string | null
  notificationPreferences: NotificationPreferences | null
  darkMode: boolean | null
  userSettings: any | null
  totalReviews?: number
  createdAt?: string
  updatedAt?: string
}

// ─── New consolidated summary types ───────────────────────────────────────────

export interface PaginatedReviews {
  items: SummaryReview[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface SummaryReview {
  id: string
  businessId: string
  locationId: string
  reviewerId: string | null
  email: string
  starRating: number
  reviewBody: string
  photoUrls: string[]
  reviewAsAnon: boolean
  isGuestReview: boolean
  createdAt: string
  status: string // "APPROVED" | "PENDING" | "REJECTED" | "FLAGGED"
  validatedAt: string | null
  name: string // business name
  logo: string | null
  isVerified: boolean
  businessAddress: string // "City, State"
}

export interface SummaryTopCity {
  city: string
  state: string
  reviewCount: number
  businessCount: number
  averageRating: number
}

export interface SummaryTopCategory {
  categoryId: string
  categoryName: string
  reviewCount: number
  businessCount: number
  averageRating: number
}

export interface SummaryBadge {
  id: string
  userId: string
  badgeType: string
  location: string | null
  category: string | null
  earnedAt: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  icon: string
  description: string
}

export interface SummaryActivity {
  points: number
  transactionType: string
  description: string
  createdAt: string
}

export interface SummaryRedemption {
  points: number
  phoneNumber: string
  network?: string
  redeemedAt: string
  status?: string
}

export interface SummaryReferral {
  code: string
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalPointsEarned: number
  wasReferred: boolean
  referredByUsername: string | null
}

export interface UserSummary {
  userId: string
  email: string
  profile: ProfileData
  reviews: PaginatedReviews
  topCities: SummaryTopCity[]
  topCategories: SummaryTopCategory[]
  tierBadge: SummaryBadge | null
  achievementBadges: SummaryBadge[]

  // Points
  points: number
  rank: number
  streak: number
  lifetimePoints: number
  pointTier: string           // "bronze" | "silver" | "gold" | "platinum" etc.
  longestStreak: number

  // Points breakdown
  reviewPoints: number
  referralPoints: number
  streakPoints: number
  bonusPoints: number
  otherPoints: number

  // Redemptions
  totalPointsRedeemed: number
  remainingRedeemablePoints: number
  recentRedemptions: SummaryRedemption[]

  // Activity & Referral
  recentActivity: SummaryActivity[]
  referral: SummaryReferral
}