import type { UserReview } from "~/types";
import type { TopCitiesResponse, TopCategoriesResponse } from "~/types/review";
import useReviewApi from "./useReviewApi";

export default function () {
  const reviewApi = useReviewApi();

  const submitUserReview = async (data: UserReview) => {
    try {
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
      if (reviewerId) params.append("reviewerId", reviewerId);
      if (email) params.append("email", email);

      const res = await reviewApi.get(`api/Review/user?${params.toString()}`);
      return res.data;
    } catch (error: any) {
      console.error("Error fetching user reviews:", error);
      throw error;
    }
  };

  // Get user's top reviewed cities
  const getUserTopCities = async (
    reviewerId?: string,
    email?: string,
  ): Promise<TopCitiesResponse> => {
    try {
      const params = new URLSearchParams();
      if (reviewerId) params.append("reviewerId", reviewerId);
      if (email) params.append("email", email);

      const res = await reviewApi.get(
        `api/Review/user/top-cities?${params.toString()}`,
      );
      return res.data;
    } catch (error: any) {
      console.error("Error fetching top cities:", error);
      throw error;
    }
  };

  // Get user's top reviewed categories
  const getUserTopCategories = async (
    reviewerId?: string,
    email?: string,
  ): Promise<TopCategoriesResponse> => {
    try {
      const params = new URLSearchParams();
      if (reviewerId) params.append("reviewerId", reviewerId);
      if (email) params.append("email", email);

      const res = await reviewApi.get(
        `api/Review/user/top-categories?${params.toString()}`,
      );
      return res.data;
    } catch (error: any) {
      console.error("Error fetching top categories:", error);
      throw error;
    }
  };

  const getDisputeCategories = async () => {
    try {
      const res = await reviewApi.get(`api/Dispute/categories`);
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const postResponse = async (data: {
    reviewId: string;
    responderId: string;
    replyBody: string;
    businessId: string;
  }) => {
    try {
      const res = await reviewApi.post(`api/business-reply`, data);
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const updateResponse = async (data: {
    reviewId: string;
    responderId: string;
    replyBody: string;
  }) => {
    try {
      const res = await reviewApi.put(
        `api/business-reply/${data.reviewId}?responderId=${data.responderId}`,
        {
          replyBody: data.replyBody,
        },
      );
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const deleteResponse = async (data: {
    reviewId: string;
    responderId: string;
  }) => {
    try {
      const res = await reviewApi.delete(
        `api/business-reply/${data.reviewId}?responderId=${data.responderId}`,
      );
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const getReviewManagement = async (
    id: string,
    data: {
      branch: string | null;
      startDate: Date | null;
      endDate: Date | null;
      status?: string | null;
      rating?: string | number | null;
    },
    page = 1,
    pageSize = 10,
  ) => {
    try {
      const res = await reviewApi.get(
        `/api/review-management?businessId=${id}&branch=${data.branch}&startDate=${data.startDate}&endDate=${data.endDate}&page=${page}&pageSize=${pageSize}&status=${data.status ?? null}&rating=${data.rating ?? null}`,
      );
      return {
        ok: true,
        statusCode: res.status,
        data: res.data,
      };
    } catch (error: any) {
      const statusCode = error?.response?.status ?? 500;
      const data = error?.response?.data ?? { message: "Something went wrong" };

      return {
        ok: false,
        statusCode,
        data,
      };
    }
  };

  return {
    submitUserReview,
    getUserReviews,
    getUserTopCities,
    getUserTopCategories,
    getDisputeCategories,
    postResponse,
    updateResponse,
    deleteResponse,
    getReviewManagement,
  };
}
