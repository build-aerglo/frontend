import useApi from "~/composables/useApi";
import type { BadgeResponse, BadgeInfo, DisplayBadge } from '~/types/badge';

export const useBadgeApi = () => {
  const api = useApi();

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
  const getBadgeInfo = async (
    badgeType: string, 
    location?: string | null, 
    category?: string | null
  ): Promise<BadgeInfo | null> => {
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (category) params.append('category', category);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const response = await api<BadgeInfo>(
        `/api/Badge/info/${badgeType}${queryString}`, 
        { method: 'GET' }
      );

      console.log('Badge Info Response:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching badge info:', err);
      throw err;
    }
  };

  /**
   * Fetch badge info for multiple badges
   */
 const getBadgeInfoBatch = async (
  badges: BadgeResponse['badges']
): Promise<Record<string, BadgeInfo>> => {
  const badgeInfoMap: Record<string, BadgeInfo> = {};

  const uniqueTypes = [...new Set(badges.map(b => b.badgeType))];

  const results = await Promise.all(
    uniqueTypes.map(type =>
      getBadgeInfo(type).catch(() => null)
    )
  );

  uniqueTypes.forEach((type, index) => {
    if (results[index]) {
      badgeInfoMap[type] = results[index]!;
    }
  });

  return badgeInfoMap;
};

  /**
   * Map API badges to display format with icons from badge info
   */
  const mapBadgesToDisplay = (
    badges: BadgeResponse['badges'],
    badgeInfoMap: Map<string, BadgeInfo>
  ): DisplayBadge[] => {
    const tierColors: Record<string, string> = {
      bronze: 'bg-orange-100',
      silver: 'bg-gray-100',
      gold: 'bg-yellow-100',
      platinum: 'bg-purple-100',
      newbie: 'bg-green-100',
      pioneer: 'bg-blue-100',
      explorer: 'bg-teal-100',
      foodie: 'bg-pink-100',
      local_guide: 'bg-indigo-100',
    };

    return badges.map(badge => {
      // Create the same key used when storing in the map
     const badgeInfo = badgeInfoMap.get(badge.badgeType);

      
      return {
        name: badge.displayName,
        icon: badgeInfo?.icon || '🏆',
        color: tierColors[badge.badgeType.toLowerCase()] || 'bg-gray-100',
        tier: badge.badgeType,
        description: badge.description
      };
    });
  };

  return {
    getUserBadges,
    getBadgeInfo,
    getBadgeInfoBatch,
    mapBadgesToDisplay,
  };
};