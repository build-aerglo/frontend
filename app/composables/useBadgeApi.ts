import { ref } from 'vue';
import type { BadgeResponse, DisplayBadge } from '~/types/badge';

export const useBadgeApi = () => {
  const config = useRuntimeConfig();
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch user badges by userId
   */
  const getUserBadges = async (userId: string): Promise<BadgeResponse | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<BadgeResponse>(
        `${config.public.apiBaseUrl}/api/Badge/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'accept': '*/*'
          }
        }
      );

      console.log('Badge API Response:', response);
      return response;
    } catch (err: any) {
      console.error('Error fetching user badges:', err);
      error.value = err.message || 'Failed to fetch badges';
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Map API badges to display format with colors and styling
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
    loading,
    error,
    getUserBadges,
    mapBadgesToDisplay
  };
};