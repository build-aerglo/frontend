import { defineStore } from "pinia";
import type { EndUser } from "~/types";

export interface EndUserState {
  accessToken: string | null;
  idToken: string | null;
  role: string | null;
  expires_in: Date;
  userData: EndUser | null;
}

export const useUserStore = defineStore("EndUser", {
  state: (): EndUserState => ({
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
      },
    // toggleTheme() {
    //   this.theme = this.theme === "light" ? "dark" : "light";

      
    //   if (this.theme === "dark") {
    //     document.documentElement.classList.add("dark");
    //   } else {
    //     document.documentElement.classList.remove("dark");
    //   }
    // },

    // initTheme() {
    //   if (typeof document === "undefined") return;
    //   if (this.theme === "dark") {
    //     document.documentElement.classList.add("dark");
    //   } else {
    //     document.documentElement.classList.remove("dark");
    //   }
    // },
  },

  persist: true,
});
