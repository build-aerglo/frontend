// Badge API Response Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  tier: string;
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
  desc?: string;
}