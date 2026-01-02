import type { UserReview } from "~/types";
import { useReviewStore } from "~/store/review/review";
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

  return {
    submitUserReview
  };
}