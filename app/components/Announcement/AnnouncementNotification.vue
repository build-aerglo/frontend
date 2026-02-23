<template>
  <div class="flex flex-col border rounded-sm hover:shadow-md p-[10px]">
    <div class="flex gap-2.5">
      <i class="pi pi-bell rounded-full p-[2px] text-[90%]"></i>
      <div class="text-[120%] font-bold flex-1">{{ data.header }}</div>
      <div
        v-if="data.isClosable"
        class="cursor-pointer p-[2px]"
        @click="closeAnnouncement(data.id)"
      >
        x
      </div>
    </div>
    <div>{{ data.description }}</div>
    <div class="flex gap-2.5">
      <div class="text-gray-500 text-[80%]">{{ timeAgo(data.entryDate!) }}</div>
      <div class="flex-1" v-if="data.hasLink">
        <NuxtLink
          :to="data.url"
          class="text-[90%] !text-primary mb-[1px] hover:border-b-[1px] hover:border-b-primary"
          >{{ data.urlLabel }}</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAnnouncementMethods from "~/composables/announcements/useAnnouncementMethods";
import type { Announcement } from "~/store/announcement";

const { closeAnnouncement } = useAnnouncementMethods();
const props = defineProps<{
  data: Announcement;
}>();
</script>
