import useBusinessApi from "~/composables/api/useReviewApi";
export default function () {
  const api = useBusinessApi();

  const getBusinessReviews = async (id: string, page = 1, limit = 10) => {
    // try {
    //   const res = await api.get(
    //     `/api/Review/business/${id}?_page=${page}&_limit=${limit}`
    //   );
    //   if (res.status === 200) {
    //     return { statusCode: 200, data: res.data };
    //   }
    // } catch (error) {
    //   console.error("Error fetching business reviews:", error);
    //   throw error;
    // }
    return { statusCode: 200, data: reviewConstants };
  };

  const upvoteReview = async (id: string) => {
    try {
      const res = await api.get(`/api/Review/upvote/${id}`);
      if (res.status === 200) {
        return { statusCode: 200 };
      }
    } catch (error) {
      console.error("Error upvoting reviews:", error);
      throw error;
    }
  };

  return {
    getBusinessReviews,
    upvoteReview,
  };
}
