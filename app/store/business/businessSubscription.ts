import { defineStore } from "pinia";
import type { BusinessSubscription } from "~/types/business";
import { decryptJSONNative } from "#imports";

export interface ProfileState {
  planData: string;
}

export const useBusinessSubscription = defineStore("businessSubscription", {
  state: (): ProfileState => ({
    planData: "" as string,
  }),

  actions: {
    async getPlan() {
      if (this.planData === "") {
        return null;
      }
      return await decryptJSONNative<BusinessSubscription>(this.planData);
    },

    setPlanData(profile: string) {
      this.planData = profile;
    },

    clearPlan() {
      this.planData = "" as string;
    },
  },

  persist: true,
});
