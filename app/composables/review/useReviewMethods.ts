import type { UserReview } from "~/types";
import useReviewApi from "./useReviewApi";

export default function () {
  const reviewApi = useReviewApi();

  const submitUserReview = async (data: UserReview) => {
    try {
      // Removed geolocation logic
      const res = await reviewApi.post("api/Review", data);
      return res.data;
    } catch (error: any) {
      console.error("Error submitting review:", error.response?.data || error);
      throw error;
    }
  };

  // Get user reviews
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
    getUserReviews,
  };
}