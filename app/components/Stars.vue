<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="8 8 48 48"
    role="img"
  >
    <defs>
      <!-- Partial fill clip -->
      <clipPath :id="clipId">
        <rect
          :x="8"
          y="8"
          :width="fillWidth"
          height="48"
          class="clip-rect"
        />
      </clipPath>

      <!-- Your original filters -->
      <filter id="starDrop" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
          dx="0"
          dy="2.2"
          stdDeviation="2.2"
          flood-color="#000"
          flood-opacity="0.32"
        />
      </filter>

      <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>

    <!-- BASE GREY CIRCLE (always visible) -->
    <circle cx="32" cy="32" r="22" fill="#CECECE" />

    <!-- COLORED CIRCLE (clipped based on decimals) -->
    <circle
      cx="32"
      cy="32"
      r="22"
      :fill="circleColor"
      :clip-path="`url(#${clipId})`"
    />

    <!-- Bottom shadow ellipse -->
    <ellipse cx="32" cy="45" rx="10" ry="3" fill="#000" opacity="0.18" filter="url(#blur)" />

    <!-- STAR ALWAYS WHITE -->
    <path
      d="M32 19
         L36.3 27.5
         L45.5 28.4
         L38.1 34.4
         L40 43.5
         L32 38.9
         L24 43.5
         L25.9 34.4
         L18.5 28.4
         L27.7 27.5 Z"
      fill="#ffffff"
      filter="url(#starDrop)"
    />
  </svg>
</template>

<script setup>
import { computed, defineProps, ref, watch } from "vue"

const props = defineProps({
  value: { type: Number, default: 1 }, // decimal fill: .1–.9
  colorLevel: { type: Number, default: 0 },
})

// Unique ID so multiple stars never collide
const clipId = "clip-" + Math.random().toString(36).substring(2)

// SVG width = 48px (viewBox width)
const MAX_WIDTH = 48

// Partial circle fill width
const fillWidth = computed(() => {
  return MAX_WIDTH * Math.min(Math.max(props.value, 0), 1)
})

const circleColor = computed(() => {
  switch (props.colorLevel) {
    case 0:
      return "#CECECE"
    case 1:
      return "#FF4101"
    case 2:
      return "#FF6F01"
    case 3:
      return "#FE9900"
    case 4:
      return "#C39A28"
    case 5:
      return "#deae29"
    default:
      return "#CECECE"
  }
})
</script>

<style scoped>
.clip-rect {
  transition: width 0.3s ease-in-out;
}
</style>
