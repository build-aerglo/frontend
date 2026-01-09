import useUserProfileApi from "./useUserProfileApi";
import useUser from "../useUser";

export default function () {
  const userProfileApi = useUserProfileApi();
  const userStore = useUser();


  const getUserId = () => {
    const user = userStore.getUser();
    return user ? user.id : null;
  }
  /**
   * Fetch end user profile
   */
  const getUserProfile = async (userId: string) => {
    try {
      const res = await userProfileApi.get(`api/user/end-user/${userId}/profile`);
      
      if (res.status === 200) {
        return { statusCode: 200, data: res.data };
      }
      
      throw new Error("Error fetching user profile");
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  };

  /**
   * Update end user profile
   */
  const updateUserProfile = async (userId: string, profileData: any) => {
    try {
      const res = await userProfileApi.put(
        `api/user/end-user/${userId}/profile`,
        profileData
      );
      
      if (res.status === 200 || res.status === 204) {
        console.log("Profile updated successfully");
        return { statusCode: 200, data: res.data };
      }
      
      throw new Error("Error updating user profile");
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  return {
    getUserProfile,
    updateUserProfile,
    getUserId
  };
}