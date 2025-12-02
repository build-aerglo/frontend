import { defineStore } from "pinia";
import type { BusinessUser, BusinessUserResponse } from "~/types/business";
import { jwtDecode } from 'jwt-decode';
export interface UserState {
  accessToken: string | null;
  idToken: string | null;
  role: string | null;
  expires_in: Date;
  userData: BusinessUserResponse | null;
}

export const useBusinessUserStore = defineStore("businessUser", {
  // FIX: Changed store ID to 'businessUser'
  state: (): UserState => ({
    accessToken: null,
    idToken: null,
    role: null,
    expires_in: new Date(),
    userData: null,
  }),
  getters: {
    /**
     * 🔑 Decodes the idToken to extract the unique User ID (the 'sub' claim).
     * Returns the userId string or null if the token is missing or invalid.
     */
    userId: (state): string | null => {
        if (!state.idToken) {
            return null;
        }
        try {
            const decodedToken = jwtDecode(state.idToken);
            // The unique User ID is stored in the 'sub' (subject) claim
            return (decodedToken as any).sub || null; 
        } catch (error) {
            console.error("Error decoding id_token:", error);
            // Return null if decoding fails (e.g., malformed token)
            return null;
        }
    },
    
    // NOTE: If you prefer to use getUser() as a getter instead of an action,
    // you would move its logic here. For now, it remains an action.
  },
  actions: {
    getUser() {
      return {
        user: this.userData,
        access_token: this.accessToken,
        role: this.role,
        expires: this.expires_in,
      };
    },

    // Called on login
    setLoginData(payload: {
      access_token: string;
      id_token: string;
      role: string;
      expires: Date;
    }) {
      // this.accessToken = payload.access_token
      // this.idToken = payload.id_token
      // this.role = payload.role
      console.log(payload);
      this.$patch((state) => {
        // state["loggedIn"] = true;
        state["accessToken"] = payload.access_token;
        state["idToken"] = payload.id_token;
        state["role"] = payload.role;
        state["expires_in"] = payload.expires;
      });
    },

    // Called on signup
    setUserData(user: BusinessUserResponse) {
      // this.userData = user;
      this.$patch((state) => {
        state["userData"] = user;
      });
    },

    // Optional: clear user info (logout)
    clearUser() {
      this.accessToken = null;
      this.idToken = null;
      this.role = null;
      this.userData = null;
    },
  },

  persist: true,
});
