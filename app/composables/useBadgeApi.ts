import type { BadgeResponse, DisplayBadge } from '~/types/badge';

export const useBadgeApi = () => {
  /**
   * Fetch user badges by userId
   * Returns the response directly - component handles loading states
   */
  const getUserBadges = async (userId: string): Promise<BadgeResponse | null> => {
    try {
      // Use relative path - interceptors will add base URL
      const response = await $fetch<BadgeResponse>(
        `/api/Badge/user/${userId}`,
        {
          method: 'GET'
        }
      );

      console.log('Badge API Response:', response);
      return response;
    } catch (err: any) {
      console.error('Error fetching user badges:', err);
      throw err; // Let component handle the error
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

  return {
    getUserBadges,
    mapBadgesToDisplay
  };
};