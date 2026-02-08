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
      console.log('Badge API Response:', response);
      return response.data; // ✅ REMOVED .data - api() already returns the data
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
      console.log('Badge Info Response:', response);
      return response.data; // ✅ REMOVED .data - api() already returns the data
    } catch (err: any) {
      console.error('Error fetching badge info:', err);
      throw err;
    }
  };

  /**
   * Get badge color based on type/tier
   */
  const getBadgeColor = (badgeType: string): string => {
    const colorMap: Record<string, string> = {
      // Tier colors
      newbie: 'bg-green-100',
      bronze: 'bg-orange-100',
      silver: 'bg-gray-100',
      gold: 'bg-yellow-100',
      platinum: 'bg-purple-100',
      // Badge type colors
      pioneer: 'bg-purple-100',
      explorer: 'bg-blue-100',
      contributor: 'bg-green-100',
      expert: 'bg-orange-100'
    };

    return colorMap[badgeType.toLowerCase()] ?? 'bg-gray-100';
  };

  /**
   * Map API badges to display format
   * API Response has: { displayName, description, badgeType, earnedAt, ... }
   */
  const mapBadgesToDisplay = (badges: BadgeResponse['badges']): DisplayBadge[] => {
    return badges.map(badge => {
      return {
        name: badge.displayName,              // ✅ Use displayName from API
        icon: badge.icon || 'pi pi-trophy',   // ✅ Use icon if it exists
        color: getBadgeColor(badge.badgeType), // Color based on badgeType
        description: badge.description,        // ✅ Use description from API
        badgeType: badge.badgeType            // Store badgeType for reference
      };
    });
  };

  /**
   * Enrich badges with icon data from badge info API
   * This fetches the icon for each badge type
   */
  const enrichBadgesWithIcons = async (badges: DisplayBadge[]): Promise<DisplayBadge[]> => {
    const enrichedBadges = await Promise.all(
      badges.map(async (badge) => {
        try {
          // Fetch badge info to get the icon
          const info = await getBadgeInfo(badge.badgeType!);
          if (info) {
            console.log(`✅ Got icon for ${badge.badgeType}:`, info.icon);
            return {
              ...badge,
              icon: info.icon // Use icon from API
            };
          }
        } catch (err) {
          console.error(`❌ Failed to fetch icon for ${badge.badgeType}:`, err);
        }
        return badge; // Return with default icon if fetch fails
      })
    );

    return enrichedBadges;
  };

  /**
   * Create tier badge from BadgeInfo response
   */
  const createTierBadge = (badgeInfo: BadgeInfo, tier: string): DisplayBadge => {
    return {
      name: badgeInfo.displayName,
      icon: badgeInfo.icon,
      color: getBadgeColor(tier),
      description: badgeInfo.description,
      tier: tier
    };
  };

  return {
    getUserBadges,
    getBadgeInfo,
    getBadgeColor,
    mapBadgesToDisplay,
    enrichBadgesWithIcons,
    createTierBadge
  };
};