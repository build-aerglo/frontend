import { defineStore } from "pinia";
import type { BusinessProfileResponse, Tags } from "~/types/business";

export interface ProfileState {
  profileData: BusinessProfileResponse | null;
}

export const useBusinessProfileStore = defineStore("businessProfile", {
  state: () => ({
    profileData: null as BusinessProfileResponse | null,
  }),

  actions: {
    getProfile() {
      return this.profileData;
    },

    setProfileData(profile: BusinessProfileResponse) {
      this.$patch((state) => {
        state.profileData = {
          ...profile,
          tags: [...(profile.tags || [])],
          highlights: [...(profile.highlights || [])],
          media: [...(profile.media || [])],
          faqs: [...(profile.faqs || [])],
        };
      });
      console.log("saved tags: ", this.profileData?.tags);
    },

    updateProfile(partial: Partial<BusinessProfileResponse>) {
      this.$patch((state) => {
        if (!state.profileData) return;
        Object.assign(state.profileData, partial);
      });
    },

    updateProfileTags(data: Tags[]) {
      this.$patch((state) => {
        if (!state.profileData) return;
        state.profileData.tags = data;
      });
    },

    clearProfile() {
      this.profileData = null;
    },
  },

  persist: true,
});
