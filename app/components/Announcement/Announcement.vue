<template>
  <div
    v-if="data"
    class="w-full rounded-[5px] shadow-md flex flex-col p-[15px] text-[90%] gap-[15px]"
  >
    <div class="flex justify-end items-start gap-2.5">
      <div class="flex-1">
        <div v-if="data.header" class="font-bold text-[100%]">
          {{ data.header }}
        </div>
        <div class="text-[90%]">{{ data.description }}</div>
      </div>
      <i
        class="pi pi-times rounded-[5px] p-2.5 border-white cursor-pointer"
        v-if="data?.isClosable"
        @click="closeAnnouncement(data?.id)"
      ></i>
    </div>
    <div v-if="data.percentageComplete">
      <ProgressBar
        :value="data.percentageComplete"
        :show-value="false"
        class="h-[10px]"
      ></ProgressBar>
    </div>
    <div v-if="data.hasLink">
      <NuxtLink :to="data.url">
        <Button :label="data.urlLabel" size="lg" input-class="w-max" />
      </NuxtLink>
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
