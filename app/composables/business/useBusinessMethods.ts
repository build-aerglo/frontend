import useBusinessApi from "~/composables/business/useBusinessApi";
import useBusinessUser from "./useBusinessUser";
import { useBusinessProfileStore } from "~/store/business/businessProfile";
import type { BusinessPreference, BusinessProfile } from "~/types/business";
export default function () {
  const store = useBusinessUser();
  const businessApi = useBusinessApi();
  const profileStore = useBusinessProfileStore();
  const getCategories = async () => {
    try {
    const res = await businessApi.get("api/Category/top-level"); 
    return res.data;
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }

  };
  const saveBusinessProfile = async (id: string, data: BusinessProfile) => {
    try {
    const res = await businessApi.patch(`api/Business/${id}`, data);
    console.log(res)
      // Save to store
      profileStore.setProfileData(res.data);
      return res.data;

    } catch (error: any) {
      console.error("Error saving business profile:", error);
      throw error;
    }
  };
  
  const saveBusinessPreferences = async (businessId: string, data: BusinessPreference) => {
  try {
    const res = await businessApi.patch(`api/business/${businessId}/settings`, data);
    console.log("Preferences saved:", res.data);

    return res.data;
  } catch (error: any) {
    console.error("Error saving preferences:", error);
    throw error;
  }
};
  return {
    getCategories,
    saveBusinessProfile,
    saveBusinessPreferences
  };
}
