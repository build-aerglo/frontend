import useUserProfileApi from "./user/useUserProfileApi";

export default function () {
  const userProfileApi = useUserProfileApi();

  /**
   * Fetch full user summary from single consolidated endpoint.
   * Replaces: getUserProfile, getUserTopCities, getUserTopCategories,
   *           getUserBadges, getBadgeInfo, getEnrichedUserReviews
   */
  const getUserSummary = async (userId: string, page = 1, pageSize = 5, recalculate = false) => {
  const res = await userProfileApi.get(
    `api/User/user-summary/${userId}?page=${page}&pageSize=${pageSize}&recalculate=${recalculate}`
  );
  if (res.status === 200) return { statusCode: 200, data: res.data };
  throw new Error("Error fetching user summary");
};
  return {
    getUserSummary,
  };
}