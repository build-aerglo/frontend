import { defineStore } from "pinia";
import type { BusinessProfile } from "~/types/business";

export interface ProfileState {
  profileData: BusinessProfile | null;
}

export const useBusinessProfileStore = defineStore("businessProfile", {
  state: (): ProfileState => ({
    profileData: null,
  }),

  actions: {
    getProfile() {
      return this.profileData;
    },

    setProfileData(profile: BusinessProfile) {
      this.profileData = profile;
    },

    updateProfile(partial: Partial<BusinessProfile>) {
      if (!this.profileData) return;
      this.profileData = { ...this.profileData, ...partial };
    },

    clearProfile() {
      this.profileData = null;
    }
  },

  persist: true,
});
