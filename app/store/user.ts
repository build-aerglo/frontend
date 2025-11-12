import { defineStore } from "pinia";
import persist from "pinia-plugin-persistedstate";

interface UserParams {
  id: string;
}

export const useUserStore = defineStore("user-aerglotech", {
  state: () => ({
    loggedIn: false,
    id: "null",
    theme: "light", 
  }),

  actions: {
    setUser(data: UserParams) {
      this.loggedIn = true;
      this.id = data.id;
    },

    logOut() {
      this.$reset();
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
