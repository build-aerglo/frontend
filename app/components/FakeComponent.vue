<script setup lang="ts">
import * as signalR from "@microsoft/signalr";
import useSocketInstances from "~/composables/websocket/useSocketInstances";

const { useRecentReviewsSocket } = useSocketInstances();
const connection = useRecentReviewsSocket();
const pushed_data = ref();

connection.on("ReceiveTopReviews", (reviews) => {
  console.log("data:", reviews);
  pushed_data.value = reviews;
});

connection.onclose(() => console.log("WebSocket disconnected"));
connection.onreconnected(() => console.log("WebSocket reconnected"));

onMounted(async () => {
  try {
    await connection.start();
    console.log("WebSocket connected");
  } catch (err) {
    console.error("Connection failed:", err);
  }
});

onUnmounted(async () => {
  await connection.stop();
});
</script>

<template>
  {{ pushed_data }}
</template>
