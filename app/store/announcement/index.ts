import { defineStore } from "pinia";

export interface Announcement {
  id: string;
  description: string;
  hasLink: boolean;
  url?: string;
  urlLabel?: string;
  entryDate?: Date;
  isClosable: boolean;
  percentageComplete?: number;
  header?: string;
}

export const useBusinessAnnouncement = defineStore("business-announcements", {
  state: (): Announcement[] => [],

  actions: {
    getAnnouncements() {
      return [...this.$state].sort(
        (a, b) => b.entryDate!.getTime() - a.entryDate!.getTime(),
      );
    },

    setAnnouncement(data: Announcement) {
      data.entryDate = new Date();
      this.$patch((state) => {
        state.push(data);
      });
    },

    deleteAnnouncement(id: string) {
      this.$patch((state) => {
        return state.filter((a: Announcement) => a.id !== id);
      });
    },
  },

  persist: true,
});
