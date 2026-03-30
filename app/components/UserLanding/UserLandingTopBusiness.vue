<template>
  <div v-if="topBusinesses.length > 0">
    {{ topBusinesses }}
  </div>
  <hr />
  <div>
    {{ topBusinesses }}
  </div>
</template>

<script setup lang="ts">
import useSocketInstances from "~/composables/websocket/useSocketInstances";

const { useTopBusinessSocket } = useSocketInstances();
const connection = useTopBusinessSocket();

const topBusinesses = ref<any[]>([]);
const key = "top-business";

connection.on("ReceiveTopBusinesses", async (stat) => {
  console.log("fetched top businesses");

  // set top business
  topBusinesses.value = stat;

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

    topBusinesses.value = res;

    // start connection
    await connection.start();
  } catch (err) {
    console.error("Connection failed:", err);
  }
});

onUnmounted(async () => {
  await connection.stop();
});
</script>
