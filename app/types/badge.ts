// Badge API Response Types
export interface Badge {
  id: string;
  userId: string;
  badgeType: string;  // ← This is what the API returns
  location: string | null;  // ← API returns this
  category: string | null;  // ← API returns this
  earnedAt: string;
  isActive: boolean;  // ← API returns this
  displayName: string;  // ← API returns this
  description: string;
}

export interface BadgeResponse {
  userId: string;
  badges: Badge[];
  totalBadges: number;
  currentTier: string;
}

export interface BadgeInfo {
  badgeType: string;
  displayName: string;
  description: string;
  icon: string;
}

// UI Badge Display Type
export interface DisplayBadge {
  name: string;
  icon: string;
  color: string;
  tier?: string;
  description?: string;  // ← Changed from 'desc' to 'description'
}