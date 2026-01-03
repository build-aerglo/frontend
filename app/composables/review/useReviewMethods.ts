import type { UserReview } from "~/types";
import { useReviewStore } from "~/store/review/review";
import useReviewApi from "./useReviewApi";

export default function () {
  const reviewStore = useReviewStore()
  const reviewApi = useReviewApi()
  
  const submitUserReview = async (data: UserReview) => {
    try {
      const res = await reviewApi.post("api/Review", data)
      // Save to store
      reviewStore.setReviewData(res.data);
      return res.data;
    } catch (error: any) {
      console.error("Error saving business profile:", error);
      throw error;
    }
  }

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
