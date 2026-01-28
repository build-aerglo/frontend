import { defineStore } from "pinia";
import type { EndUser } from "~/types";
// import { jwtDecode } from 'jwt-decode';
export interface EndUserState {
  accessToken: string | null;
  idToken: string | null;
  role: string | null;
  expires_in: Date;
  userData: EndUser | null;
  id: string | null;
}

export const useUserStore = defineStore("EndUser", {
  state: (): EndUserState & { theme: string } => ({
    accessToken: null,
    idToken: null,
    role: null,
    expires_in: new Date(),
    userData: null,
    theme: "light",
    id: null,
  }),
  getters: {
    // userId: (state): string | null => {
    //     if (!state.idToken) {
    //         return null;
    //     }
    //     try {
    //         const decodedToken = jwtDecode(state.idToken);
    //         return (decodedToken as any).sub || null;
    //     } catch (error) {
    //         console.error("Error decoding id_token:", error);
    //         return null;
    //     }
    // },
    isAuthenticated: (state): boolean => {
      return !!state.idToken || !!state.accessToken;
    },

    userId: (state): string | null => {
      if (!state.idToken) return null;
      try {
        // Decode JWT to get user ID from 'sub' claim
        const parts = state.idToken.split('.');
        const base64Url = parts.length > 1 ? parts[1] : null;
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        return decoded.sub || null;
      } catch (error) {
        console.error("Error decoding id_token:", error);
        return null;
      }
    },
  },

  actions: {
    setId(id: string) {
      this.$patch((state) => {
        state["id"] = id;
      });
    },

    getUser() {
      return {
        user: this.userData,
        access_token: this.accessToken,
        role: this.role,
        expires: this.expires_in,
        id: this.id,
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
    setUserData(user: EndUser) {
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
      this.id = null;
    },
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";

      if (this.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },

    initTheme() {
      if (typeof document === "undefined") return;
      if (this.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },

  persist: true,
});
