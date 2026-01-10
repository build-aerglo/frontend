import type { UserReview } from "~/types";
import useReviewApi from "./useReviewApi";
import useGeolocation from "~/composables/device/useGeolocation";

export default function () {
  const reviewStore = useReviewStore();
  const reviewApi = useReviewApi();
  const { getGeolocation } = useGeolocation();

  const submitUserReview = async (data: UserReview) => {
    try {
      // Get formatted address from geolocation
      const geolocation = await getGeolocation();

      // Create config with geolocation header if available
      const config = geolocation ? {
        headers: {
          'X-Geolocation': geolocation // Format: "Lagos, Lagos State, Nigeria"
        }
      } : {};

      const res = await reviewApi.post("api/Review", data, config);
      reviewStore.setReviewData(res.data);
      return res.data;
    } catch (error: any) {
      console.error("Error submitting review:", error.response?.data || error);
      throw error;
    }
  };

  // ✅ NEW: Get user reviews
  const getUserReviews = async (reviewerId?: string, email?: string) => {
    try {
      const params = new URLSearchParams();
      if (reviewerId) params.append('reviewerId', reviewerId);
      if (email) params.append('email', email);
      
      const res = await reviewApi.get(`api/Review/user?${params.toString()}`);
      return res.data;
    } catch (error: any) {
      console.error("Error fetching user reviews:", error);
      throw error;
    }
  }

  return {
    submitUserReview,
    getUserReviews  // ✅ Export the new method
  };
}