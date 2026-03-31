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
import { ref, onMounted, onUnmounted, watch } from "vue";
import useSocketInstances from "~/composables/websocket/useSocketInstances";

const props = defineProps<{
  stats?: { title: string; count: number };
}>();

interface Stat {
  title: string;
  count: number;
}

const statistics = ref<Stat[]>([
  { title: "Registered Business", count: 0 },
  { title: "Reviewing Users", count: 0 },
  { title: "Uploaded Reviews", count: 0 },
]);

const key = "statistics";

const { useStatisticsSocket } = useSocketInstances();
const connection = useStatisticsSocket();

const setCoreStats = (data: any) => {
  statistics.value[0]!.count = data.registeredBusinesses ?? 0;
  statistics.value[1]!.count = data.registeredUsers ?? 0;
  statistics.value[2]!.count = data.uploadedReviews ?? 0;
};

const ensureExtraStat = () => {
  if (props.stats && statistics.value.length === 3) {
    statistics.value.push(props.stats);
  }
};

connection.on("ReceiveStatistics", async (stat) => {
  console.log("fetched statistics");

  setCoreStats(stat);
  ensureExtraStat();

  await $fetch("/api/page", {
    method: "POST",
    body: {
      key,
      data: stat,
    },
  });
});

connection.onclose(() => console.log("WebSocket disconnected"));
connection.onreconnected(() => console.log("WebSocket reconnected"));

onMounted(async () => {
  try {
    const res = await $fetch<any>(`/api/page?key=${key}`);

    if (res) {
      setCoreStats(res);
    }

    ensureExtraStat();

    await connection.start();
  } catch (err) {
    console.error("Connection failed:", err);
  }
});

onUnmounted(async () => {
  await connection.stop();
});

watch(
  () => props.stats,
  () => {
    ensureExtraStat();
  },
  { immediate: true },
);
</script>
