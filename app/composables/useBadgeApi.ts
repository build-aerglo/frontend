import useApi from "~/composables/useApi";
import type { BadgeResponse, BadgeInfo, DisplayBadge } from '~/types/badge';

export const useBadgeApi = () => {
  const api = useApi(); // ← Add () to call it

  /**
   * Fetch user badges by userId
   */
  const getUserBadges = async (userId: string): Promise<BadgeResponse | null> => {
    try {
      const response = await api<BadgeResponse>(`/api/Badge/user/${userId}`, {
        method: 'GET'
      });

      console.log('Badge API Response:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching user badges:', err);
      throw err;
    }
  };

  /**
   * Fetch badge info by badge type
   */
  const getBadgeInfo = async (badgeType: string): Promise<BadgeInfo | null> => {
    try {
      const response = await api<BadgeInfo>(`/api/Badge/info/${badgeType}`, {
        method: 'GET'
      });

      console.log('Badge Info Response:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching badge info:', err);
      throw err;
    }
  };

  /**
   * Map API badges to display format with colors and styling
   * Pure function - no state management
   */
  const mapBadgesToDisplay = (badges: BadgeResponse['badges']): DisplayBadge[] => {
    const tierColors: Record<string, string> = {
      bronze: 'bg-orange-100',
      silver: 'bg-gray-100',
      gold: 'bg-yellow-100',
      platinum: 'bg-purple-100',
      newbie: 'bg-blue-100'
    };

    return badges.map(badge => ({
      name: badge.name,
      icon: badge.icon || 'pi pi-trophy',
      color: tierColors[badge.tier?.toLowerCase()] || 'bg-gray-100',
      tier: badge.tier
    }));
  };

  /**
   * Create tier badge from BadgeInfo response
   */
  const createTierBadge = (badgeInfo: BadgeInfo, tier: string): DisplayBadge => {
    const tierColors: Record<string, string> = {
      newbie: 'bg-green-100',  // ← Changed to green to match your UI
      bronze: 'bg-orange-100',
      silver: 'bg-gray-100',
      gold: 'bg-yellow-100',
      platinum: 'bg-purple-100'
    };

    return {
      name: badgeInfo.displayName,
      icon: badgeInfo.icon,
      color: tierColors[tier.toLowerCase()] || 'bg-green-100',
      tier: tier
    };
  };

  return {
    getUserBadges,
    getBadgeInfo,
    mapBadgesToDisplay,
    createTierBadge
  };
};