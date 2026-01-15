import useBusinessApi from "~/composables/business/useBusinessApi";
import useBusinessUser from "./useBusinessUser";
import { useBusinessProfileStore } from "~/store/business/businessProfile";
import type {
  BusinessPreference,
  BusinessProfile,
  ClaimData,
} from "~/types/business";
import type { AxiosError } from "axios";
export default function () {
  const store = useBusinessUser();
  const businessApi = useBusinessApi();
  const profileStore = useBusinessProfileStore();

  const getBusinessUser = () => {
    return {
      id: store.id,
    };
  };

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
      console.log(res);
      // Save to store
      // profileStore.setProfileData(res.data);
      return res.data;
    } catch (error: any) {
      console.error("Error saving business profile:", error);
      throw error;
    }
  };

  const saveBusinessPreferences = async (
    businessId: string,
    data: BusinessPreference
  ) => {
    try {
      const res = await businessApi.patch(
        `api/business/${businessId}/settings`,
        data
      );
      console.log("Preferences saved:", res.data);

      return res.data;
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      throw error;
    }
  };

  const getBusinessProfile = async (id: any) => {
    try {
      const res = await businessApi.get(`api/business/${id}`);
      if (res.status === 200) {
        return { statusCode: 200, data: res.data };
      }

      throw new Error("Error fetching profile data: ");
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoryTags = async (id: string) => {
    try {
      const res = await businessApi.get(`get-category-tags/${id}`);
      if (res.status === 200) {
        return { statusCode: 200, data: res.data };
      }
    } catch (error) {
      console.error("Error fetching category tags:", error);
      throw error;
    }
  };

  const getCategoryWithTags = async () => {
    try {
      const res = await businessApi.get("api/Category/with-tags");
      if (res.status === 200) {
        return { statusCode: 200, data: res.data };
      }
    } catch (error) {
      console.error("Error fetching category tags:", error);
      throw error;
    }
  };
  const getBusinessByCategory = async (id: string) => {
    try {
      const res = await businessApi.get(`api/Business/category/${id}`);
      console.log(res);
      if (res.status === 200) {
        return { statusCode: 200, data: res.data };
      }
    } catch (error) {
      console.error("Error fetching businesses by category:", error);
      throw error;
    }
  };
  const getBusinessByTag = async (tagId: string) => {
    try {
      const res = await businessApi.get(`api/Business/by-tag/${tagId}`);
      console.log(res);
      if (res.status === 200) {
        return { statusCode: 200, data: res.data };
      }
    } catch (error) {
      console.error("Error fetching businesses by category:", error);
      throw error;
    }
  };

  const getBusinessBranches = async (id: string) => {
    try {
      const res = await businessApi.get(`api/business-branch/${id}`);
      if (res.status === 200) {
        return { statusCode: 200, data: res.data };
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      throw error;
    }
  };

  const createBranch = async (data: any) => {
    if (!data.businessId) return null;
    try {
      const res = await businessApi.post(
        "api/business-branch",
        JSON.stringify(data)
      );
      return { statusCode: res.status, data: res.data };
    } catch (error) {
      console.error("Error creating branch:", error);
      throw error;
    }
  };

  const updateBranch = async (data: any) => {
    if (!data.businessId) return null; // ✅ FIXED (was inverted)
    try {
      const res = await businessApi.patch(
        "api/business-branch",
        JSON.stringify(data)
      );
      return { statusCode: res.status, data: res.data };
    } catch (error) {
      console.error("Error updating branch:", error);
      throw error;
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      const res = await businessApi.delete(`api/business-branch/${id}`);
      return { statusCode: res.status, data: res.data };
    } catch (error) {
      console.error("Error deleting branch:", error);
      throw error;
    }
  };

  const claimBusinessAsync = async (data: ClaimData) => {
    try {
      const res = await businessApi.post("api/BusinessClaim", data);
      return { statusCode: res.status, data: res.data };
    } catch (error) {
      const err = error as AxiosError<any>;

      return {
        statusCode: err.response?.status ?? 500,
        data: err.response?.data ?? {
          message: "An error occurred",
        },
      };
    }
  };

  return {
    getCategories,
    saveBusinessProfile,
    saveBusinessPreferences,
    getBusinessProfile,
    getBusinessUser,
    getCategoryTags,
    getBusinessBranches,
    getCategoryWithTags,
    getBusinessByCategory,
    getBusinessByTag,
    claimBusinessAsync,
    createBranch,
    updateBranch,
    deleteBranch,
  };
}
