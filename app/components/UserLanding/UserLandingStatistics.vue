<template>
  <div :class="[bgClass, 'py-4']">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        <!-- Growing Community - Hidden on mobile, visible on large screens -->
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
            {{ displayCounts[idx] ?? 0 }}
          </div>
          <div class="text-xs sm:text-sm text-center">{{ i.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stats {
  title: string;
  count: number;
}

const props = defineProps<{
  statistics: Stats[];
  bgClass: string;
}>();

// reactive counts for UI
const displayCounts = ref<number[]>([]);
let placeholderTimer: ReturnType<typeof setInterval> | null = null;

const placeholderRanges = [
  { min: 120, max: 420 },
  { min: 900, max: 3600 },
  { min: 1000, max: 8200 },
];

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const normalizedCounts = computed(() =>
  props.statistics.map((item) => {
    const value = Number(item.count);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }),
);

const hasRealData = computed(() =>
  normalizedCounts.value.some((count) => count > 0),
);

const animateCount = (
  target: number,
  duration: number,
  callback: (value: number) => void,
) => {
  const startTime = performance.now();

  const update = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const value = Math.floor(progress * target);
    callback(value);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      callback(target);
    }
  };

  requestAnimationFrame(update);
};

// run animation
const runAnimation = () => {
  // don't reset to 0 — start from current value so there's no flash
  normalizedCounts.value.forEach((count, index) => {
    animateCount(count, 1500, (val) => {
      displayCounts.value[index] = val;
    });
  });
};

const startPlaceholderAnimation = () => {
  if (placeholderTimer) return;

  const tick = () => {
    displayCounts.value = props.statistics.map((_, index) => {
      const range = placeholderRanges[index] || { min: 50, max: 500 };
      return randomBetween(range.min, range.max);
    });
  };

  tick();
  placeholderTimer = setInterval(tick, 900);
};

const stopPlaceholderAnimation = () => {
  if (!placeholderTimer) return;
  clearInterval(placeholderTimer);
  placeholderTimer = null;
};

const syncDisplay = () => {
  if (hasRealData.value) {
    stopPlaceholderAnimation();
    runAnimation();
    return;
  }

  startPlaceholderAnimation();
};

onMounted(syncDisplay);

watch(() => props.statistics, syncDisplay, { deep: true, immediate: true });

onBeforeUnmount(() => {
  stopPlaceholderAnimation();
});
</script>
