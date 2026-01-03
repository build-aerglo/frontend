import { defineStore } from "pinia";
import type { UserReview } from "~/types";

export interface ReviewState {
  reviewData: UserReview | null;
}

export const useReviewStore = defineStore("review", {
  state: (): ReviewState => ({
    reviewData: null,
  }),

  actions: {
    getReview() {
      return this.reviewData;
    },

    setReviewData(profile: UserReview) {
      this.reviewData = profile;
    },

    clearReview() {
      this.reviewData = null;
    }
  },

  persist: true,
});
