import { defineStore } from "pinia";

export const useUserStore = defineStore("user-aerglotech", {
  state: () => {
    return {
      loggedIn: false,
      id: "null",
    };
  },

  actions: {
    setUser(data) {
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
