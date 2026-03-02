import { defineStore } from "pinia";
import type {
  BusinessSubscription,
  BusinessVerification,
} from "~/types/business";
import { decryptJSONNative } from "#imports";

export interface ProfileState {
  planData: string;
  verificationData: string;
}

export const useBusinessSubscription = defineStore("businessSubscription", {
  state: (): ProfileState => ({
    planData: "" as string,
    verificationData: "" as string,
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

    async getVerification() {
      if (this.verificationData === "") {
        return null;
      }
      return await decryptJSONNative<BusinessVerification>(
        this.verificationData,
      );
    },

    setVerificationData(profile: string) {
      this.verificationData = profile;
    },

    clearVerification() {
      this.verificationData = "" as string;
    },
  },

  persist: true,
});
