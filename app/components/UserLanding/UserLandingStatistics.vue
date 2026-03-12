<template>
  <div v-if="statistics.length > 0">
    <div
      v-for="(i, idx) in statistics"
      :key="idx"
      class="flex flex-col justify-center items-center p-[20px]"
    >
      <div class="font-bold text-[300%] drop-shadow-lg">
        {{ i.count }}
      </div>
      <div>{{ i.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["stats"]);

import useSocketInstances from "~/composables/websocket/useSocketInstances";

const { useStatisticsSocket } = useSocketInstances();
const connection = useStatisticsSocket();

const statistics = ref<any[]>([]);
const key = "statistics";

connection.on("ReceiveStatistics", async (stat) => {
  console.log("fetched statistics");
  await $fetch("/api/page", {
    method: "POST",
    body: {
      key: key,
      data: stat,
    },
  });
});

connection.onclose(() => console.log("WebSocket disconnected"));
connection.onreconnected(() => console.log("WebSocket reconnected"));

onMounted(async () => {
  try {
    const res = await $fetch<any>(`/api/page?key=${key}`, {
      method: "GET",
    });
    if (res.statistics) {
      statistics.value.push({
        title: "Registered Business",
        count: res.statistics.registeredBusinesses,
      });
      statistics.value.push({
        title: "Reviewing Users",
        count: res.statistics.registeredUsers,
      });
      statistics.value.push({
        title: "Uploaded Reviews",
        count: res.statistics.uploadedReviews,
      });
    }

    // start connection
    await connection.start();
  } catch (err) {
    console.error("Connection failed:", err);
  }
});

onUnmounted(async () => {
  await connection.stop();
});

onBeforeMount(() => {
  if (props.stats) {
    statistics.value.push(props.stats);
  }
});
</script>
