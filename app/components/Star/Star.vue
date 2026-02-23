<template>
  <div class="flex items-center gap-0">
    <div v-for="i in 5" :key="i" class="w-4 h-4 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="8 8 48 48"
        role="img"
        class="w-full h-full"
      >
        <defs>
          <clipPath :id="`clip-${instanceId}-${i}`">
            <rect
              :x="8"
              y="8"
              :width="getFillWidth(i)"
              height="48"
              class="transition-all duration-300"
            />
          </clipPath>

          <filter :id="`starDrop-${instanceId}`" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2.2" stdDeviation="2.2" flood-color="#000" flood-opacity="0.32" />
          </filter>
          <filter :id="`blur-${instanceId}`" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        <circle cx="32" cy="32" r="22" fill="#CECECE" />

        <circle
          cx="32"
          cy="32"
          r="22"
          :fill="getCircleColor"
          :clip-path="`url(#clip-${instanceId}-${i})`"
        />

        <ellipse cx="32" cy="45" rx="10" ry="3" fill="#000" opacity="0.18" :filter="`url(#blur-${instanceId})`" />

        <path
          d="M32 19 L36.3 27.5 L45.5 28.4 L38.1 34.4 L40 43.5 L32 38.9 L24 43.5 L25.9 34.4 L18.5 28.4 L27.7 27.5 Z"
          fill="#ffffff"
          :filter="`url(#starDrop-${instanceId})`"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  count: { type: Number, default: 0 },
  rounded: { type: Boolean, default: false }
});

const instanceId = Math.random().toString(36).substring(2, 7);
const MAX_WIDTH = 48;

const displayRating = computed(() => {
  const rating = props.count;
  
  if (!props.rounded) {
    return rating;
  }
  
  const integerPart = Math.floor(rating);
  const decimalPart = rating - integerPart;
  
  const decimal = Math.round(decimalPart * 100) / 100;
  
  if (decimal <= 0.35) {
    return integerPart;
  } else if (decimal <= 0.65) {
    return integerPart + 0.5;
  } else {
    return integerPart + 1;
  }
});

const getFillWidth = (index) => {
  const diff = displayRating.value - (index - 1);
  const fillPercentage = Math.min(Math.max(diff, 0), 1);
  return MAX_WIDTH * fillPercentage;
};

const getCircleColor = computed(() => {
  const level = Math.floor(displayRating.value);
  switch (level) {
    case 1: return "#FF4101";
    case 2: return "#FF6F01";
    case 3: return "#FE9900";
    case 4: return "#C39A28";
    case 5: return "#deae29";
    default: return "#CECECE";
  }
});
</script>