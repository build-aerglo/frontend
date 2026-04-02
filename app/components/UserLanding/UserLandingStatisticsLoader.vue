<template>
  <div :class="[bgClass, 'py-4']">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        <!-- Static intro -->
        <div class="hidden lg:flex flex-col justify-center">
          <div class="font-bold text-2xl mb-2 drop-shadow-lg text-gray-700">
            Growing Community
          </div>
          <div class="text-sm">
            Real people. Authentic reviews. Better decisions
          </div>
        </div>

        <!-- Statistics -->
        <div
          v-for="(i, idx) in statistics"
          :key="idx"
          class="flex flex-col justify-center items-center p-4 lg:p-6"
        >
          <div
            class="font-bold text-3xl lg:text-4xl drop-shadow-lg mb-2 text-gray-700"
          >
            {{ (displayCounts[idx] ?? 0).toLocaleString() }}+
          </div>
          <div class="text-xs sm:text-sm text-center">
            {{ i.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["bgClass", "isUser"]);

const statistics = computed(() => [
  { title: "Registered Businesses" },
  { title: props.isUser ? "Reviewing Users" : "Active Reviewers" },
  { title: props.isUser ? "Uploaded Reviews" : "Reviews Uploaded" },
]);

// reactive counts
const displayCounts = ref<number[]>([]);

let animationFrame: number;

const animateLoop = () => {
  const duration = 2000; // time to reach max
  const maxValues = [1000, 800, 1200]; // different max for realism

  const startTime = performance.now();

  const update = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = (elapsed % duration) / duration;

    displayCounts.value = statistics.value.map((_, i) => {
      const max = maxValues[i] || 1000;
      return Math.floor(progress * max);
    });

    animationFrame = requestAnimationFrame(update);
  };

  animationFrame = requestAnimationFrame(update);
};

onMounted(() => {
  displayCounts.value = statistics.value.map(() => 0);
  animateLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
});
</script>
