<template>
  <div v-if="data?.length > 0" class="flex flex-col gap-2.5 mb-2.5">
    <div v-for="(i, idx) in data" :key="idx">
      <Announcement :data="i" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Announcement } from "~/store/announcement";
import useAnnouncementMethods from "~/composables/announcements/useAnnouncementMethods";
const { getAnnouncements } = useAnnouncementMethods();

const data = ref<Announcement[]>([]);

onBeforeMount(() => {
  const an = getAnnouncements();
  data.value = an.data();
});
</script>
