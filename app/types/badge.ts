// Badge API Response Types - CORRECTED TO MATCH ACTUAL API

export interface Badge {
  id: string;
  userId: string;
  icon?: string;
  badgeType: string;          // "pioneer", "explorer", etc.
  location: string | null;
  category: string | null;
  earnedAt: string;           // ISO date string
  isActive: boolean;
  displayName: string;        // "Pioneer" - from API
  description: string;        // "Joined in the first 100 days..." - from API
}

export interface BadgeResponse {
  userId: string;
  badges: Badge[];            // Array of earned badges
  totalBadges: number;        // Count of earned badges
  currentTier: string;        // "newbie", "bronze", etc.
}

// Badge Info Response (from /api/Badge/info/{badgeType})
export interface BadgeInfo {
  badgeType: string;
  displayName: string;
  description: string;
  icon: string;              // Emoji like "🌱" or "🏆"
}

// UI Badge Display Type (for BadgeToolTip component)
export interface DisplayBadge {
  name: string;              // Display name
  icon: string;              // Emoji or icon class
  color: string;             // Tailwind class
  description?: string;      // Description for tooltip
  tier?: string;             // Optional tier info
  badgeType?: string;        // Optional badge type
}