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
    userId: (state): string | null => {
        // 1. Use the accessToken
        if (!state.accessToken) { 
            return null;
        }
        try {
            const decodedToken = jwtDecode(state.accessToken);
            
            // Get the 'sub' claim, which is the user ID
            const sub = (decodedToken as any).sub as string | null;
            
            if (!sub) {
                return null;
            }
            
            // 2. Remove the provider prefix (e.g., "auth0|")
            const parts = sub.split('|');
            
            // Return the last part of the split string (the actual unique ID)
            // If there's no '|' (e.g., if it's already a clean ID), this returns the whole thing.
            return parts.length > 1 ? parts.pop()! : sub; 

        } catch (error) {
            console.error("Error decoding accessToken:", error);
            return null;
        }
    },
    businessId: (state): string | null => {
      return state.userData?.businessId || null;
    },
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
