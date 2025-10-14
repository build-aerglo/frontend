import { defineStore } from "pinia";
import persist from "pinia-plugin-persistedstate";

interface UserParams {
  id: string;
}
export const useUserStore = defineStore("user-aerglotech", {
  state: () => {
    return {
      loggedIn: false,
      id: "null",
    };
  },

  actions: {
    setUser(data: UserParams) {
      this.$patch((state) => {
        state["loggedIn"] = true;
        state["id"] = data.id;
      });

      return true;
    },

    logOut() {
      this.$reset;
    },
  },

  persist: true,
});
