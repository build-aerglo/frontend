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
  displayCounts.value = props.statistics.map(() => 0);

  props.statistics.forEach((item, index) => {
    animateCount(item.count, 1500, (val) => {
      displayCounts.value[index] = val;
    });
  });
};

onMounted(runAnimation);

watch(() => props.statistics, runAnimation, { deep: true });
</script>
