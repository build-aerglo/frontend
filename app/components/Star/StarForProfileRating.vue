<template>
  <div class="flex items-center gap-2 sm:gap-3">
    <span class="text-[10px] sm:text-xs font-bold text-slate-600 w-2">{{
      star
    }}</span>

    <div
      class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center shrink-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="8 8 48 48"
        class="w-full h-full"
      >
        <defs>
          <filter
            :id="`starDrop-${star}`"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="2.2"
              stdDeviation="2.2"
              flood-color="#000"
              flood-opacity="0.32"
            />
          </filter>
        </defs>
        <circle cx="32" cy="32" r="22" :fill="getStarColor(star)" />
        <path
          d="M32 19 L36.3 27.5 L45.5 28.4 L38.1 34.4 L40 43.5 L32 38.9 L24 43.5 L25.9 34.4 L18.5 28.4 L27.7 27.5 Z"
          fill="#ffffff"
          :filter="`url(#starDrop-${star})`"
        />
      </svg>
    </div>

    <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500"
        :style="{
          width: `${getRatingPercentage(ratingCount, star)}%`,
          backgroundColor: getStarColor(star),
        }"
      ></div>
    </div>
    <span
      class="text-[9px] sm:text-[10px] font-semibold text-slate-400 w-6 sm:w-7 text-right"
    >
      {{ getRatingPercentage(ratingCount, star) }}%
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps(["ratingCount", "star"]);

import type { RatingCounts } from "~/types/business";

const numberToKey = {
  5: "five",
  4: "four",
  3: "three",
  2: "two",
  1: "one",
} as const;

function getRatingPercentage(
  ratings: RatingCounts,
  ratingNumber: keyof typeof numberToKey,
): number {
  const total = Object.values(ratings).reduce((a, b) => a + b, 0);
  if (!total) return 0;

  const key = numberToKey[ratingNumber];
  return Math.round((ratings[key] / total) * 100);
}

const getStarColor = (star: number) => {
  switch (star) {
    case 1:
      return "#FF4101";
    case 2:
      return "#FF6F01";
    case 3:
      return "#FE9900";
    case 4:
      return "#C39A28";
    case 5:
      return "#deae29";
    default:
      return "#CECECE";
  }
};
</script>
