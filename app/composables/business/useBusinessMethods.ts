import useBusinessApi from "~/composables/business/useBusinessApi";
import useBusinessUser from "./useBusinessUser";
import { useBusinessProfileStore } from "~/store/business/businessProfile";
import { useBusinessSubscription } from "~/store/business/businessSubscription";
import type {
  BusinessPreference,
  BusinessProfile,
  ClaimData,
} from "~/types/business";
import type { AxiosError } from "axios";
import { encryptJSONNative } from "#imports";
import useAnnouncementMethods from "../announcements/useAnnouncementMethods";

//temp caching
let categories = ref(null);
let plan = ref(null);

export default function () {
  const store = useBusinessUser();
  const businessApi = useBusinessApi();
  const profileStore = useBusinessProfileStore();
  const businessSubscription = useBusinessSubscription();
  const { reverifyPhoneAnnnouncement, createAnnouncement } =
    useAnnouncementMethods();

  const getBusinessUser = () => {
    return profileStore.getProfile()!;
  };

  const getBusinessSubscriptionFromStore = async () => {
    return await businessSubscription.getPlan();
  };

  const getCategories = async () => {
    if (categories.value) return categories.value;
    try {
      const res = await businessApi.get("api/Category/top-level");
      categories.value = res.data;
      return res.data;
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  };

  const saveBusinessProfile = async (id: string, data: BusinessProfile) => {
    try {
      const res = await businessApi.patch(`api/Business/${id}`, data);
      // manage profile store
      if (
        res.data?.businessPhoneNumber !== getBusinessUser().businessPhoneNumber
      ) {
        createAnnouncement(reverifyPhoneAnnnouncement);
      }

      // set store
      profileStore.setProfileData(res.data);
      return res.data;
    } catch (error: any) {
      console.error("Error saving business profile:", error);
      throw error;
    }
  };

  const saveBusinessPreferences = async (
    businessId: string,
    data: BusinessPreference,
  ) => {
    try {
      const res = await businessApi.patch(
        `api/business/${businessId}/settings`,
        data,
      );
      console.log("Preferences saved:", res.data);

      return res.data;
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      throw error;
    }
  };

  // const getBusinessProfile = async (id: string) => {
  //   const biz = getBusinessUser();
  //   if (id === biz.id) {
  //     if (biz !== null && biz.id) {
  //       return {
  //         statusCode: 200,
  //         data: biz,
  //       };
  //     }
  //   }

  //   try {
  //     const res = await businessApi.get(`api/business/${store.id}`);
  //     if (res.status === 200) {
  //       // update store
  //       if (biz !== null && biz.id && id === biz.id) {
  //         profileStore.setProfileData(res.data);
  //       }

  //       return { statusCode: 200, data: res.data };
  //     }

  //     throw new Error("Error fetching profile data: ");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getBusinessProfile = async (id: string, resave?: boolean) => {
    const biz = getBusinessUser();

    if (biz?.id === id) {
      return { statusCode: 200, data: biz };
    }

    try {
      const { data, status } = await businessApi.get(`api/business/${id}`);

      if (status !== 200) {
        throw new Error("Failed to fetch profile");
      }

      if (!resave) {
        profileStore.setProfileData(data);
      }

      return { statusCode: 200, data };
    } catch (error) {
      console.error(error);
      return { statusCode: 500, data: null };
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
      const res = await businessApi.get(
        `api/business-branch/${getBusinessUser().id}`,
      );
      return { statusCode: res.status, data: res.data };
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
        JSON.stringify(data),
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
        JSON.stringify(data),
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

  const getBusinessSettings = async () => {
    try {
      const res = await businessApi.get(`api/business/${store.id}/settings`);
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const updateBusinessSettings = async (
    id: string,
    currentUserId: string,
    data: any,
  ) => {
    try {
      const res = await businessApi.patch(
        `api/business/${id}/settings?currentUserId=${currentUserId}`,
        data,
      );
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const updateBusinessAutoResponse = async (data: {
    positiveResponse: string;
    negativeResponse: string;
    neutralResponse: string;
    allowAutoResponse: boolean;
  }) => {
    try {
      const res = await businessApi.patch(
        `api/BusinessAutoResponse/${store.id}`,
        data,
      );
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const getBusinessAutoResponse = async () => {
    try {
      const res = await businessApi.get(`api/BusinessAutoResponse/${store.id}`);
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  // const getBusinessSubscriptions = async () => {
  //   try {
  //     const res = await businessApi.get(`api/Subscription/plans`);
  //     return {
  //       statusCode: res.status,
  //       data: res.data,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getBusinessSubscriptions = () => {
    return useAsyncData<{ statusCode: number; data: any }>(
      "business-subscriptions",
      async () => {
        const res = await businessApi.get(`api/Subscription/plans`);
        return { statusCode: res.status, data: res.data };
      },
      { getCachedData: (key) => useNuxtApp().payload.data[key] },
    );
  };

  const getBusinessSubscriptionSummary = async (update?: boolean) => {
    if (!update) {
      const biz_subscription = await getBusinessSubscriptionFromStore();
      if (biz_subscription !== null) {
        return {
          statusCode: 200,
          data: biz_subscription,
        };
      }
    }
    try {
      const res = await businessApi.get(
        `api/Subscription/business/${store.id}`,
      );
      if (res.status === 200) {
        const sub = await encryptJSONNative(res.data);
        businessSubscription.setPlanData(sub);
      }
      return {
        statusCode: res.status,
        data: res.data,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const updateEmail = async (email: string, reason: string) => {
    try {
      const res = await businessApi.post("api/auth/request-email-update", {
        emailAddress: email,
        businessId: store.id,
        reason: reason,
      });
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
    getBusinessSettings,
    updateBusinessSettings,
    getBusinessAutoResponse,
    getBusinessSubscriptions,
    getBusinessSubscriptionSummary,
    updateBusinessAutoResponse,
    updateEmail,
    getBusinessSubscriptionFromStore,
  };
}
