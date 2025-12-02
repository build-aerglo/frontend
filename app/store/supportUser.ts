import { defineStore } from "pinia";
import type { SupportUser } from "~/types/support";

export interface SupportUserState {
  accessToken: string | null;
  idToken: string | null;
  role: string | null;
  expires_in: Date;
  userData: SupportUser | null;
}

export const useSupportUserStore = defineStore("supportUser", {
  // FIX: Changed store ID to 'businessUser'
  state: (): SupportUserState => ({
    accessToken: null,
    idToken: null,
    role: null,
    expires_in: new Date(),
    userData: null,
  }),

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
    setUserData(user: SupportUser) {
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
