import { defineStore } from "pinia";
import type { BusinessProfileResponse } from "~/types/business";

export interface ProfileState {
  profileData: BusinessProfileResponse;
}

export const useBusinessProfileStore = defineStore("businessProfile", {
  state: (): ProfileState => ({
    profileData: {} as BusinessProfileResponse,
  }),

  actions: {
    getProfile() {
      return this.profileData;
    },

    setProfileData(profile: BusinessProfileResponse) {
      this.profileData = profile;
    },

    updateProfile(partial: Partial<BusinessProfileResponse>) {
      this.profileData = { ...this.profileData, ...partial };
    },

    clearProfile() {
      this.profileData = {} as BusinessProfileResponse;
    },
  },

  persist: true,
});
