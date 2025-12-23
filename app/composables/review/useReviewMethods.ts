import type { UserReview } from "~/types";
import { useReviewStore } from "~/store/review/review";
import useReviewApi from "./useReviewApi";



export default function () {
  const reviewStore = useReviewStore()
  const reviewApi = useReviewApi()


  const submitUserReview = async (data: UserReview) => {
    try {
      const res = await reviewApi.post("api/Review", data);
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
