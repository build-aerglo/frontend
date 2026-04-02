<template>
  <div class="flex flex-col items-center pointer-events-none">
    <!-- SVG Badge Frame -->
    <div class="relative w-full">
      <svg
        class="w-full h-full"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Outer frame -->
        <rect
          x="1"
          y="1"
          width="118"
          height="118"
          fill="none"
          stroke="#333"
          stroke-width="0.2"
          rx="2"
        />

        <!-- Status triangle at top-left -->
        <polygon points="1,1 47,1 1,47" :fill="triangleColor" />

        <!-- Centered text in triangle -->
        <text
          x="23"
          y="17"
          fill="white"
          text-anchor="middle"
          dominant-baseline="middle"
          transform="rotate(-45 23 23)"
          style="
            pointer-events: none;
            user-select: none;
            text-transform: lowercase;
            /* letter-spacing: -0.5px; */
            font-size: 67%;
          "
        >
          {{ statusLabel }}
        </text>
      </svg>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  status: "verified" | "trusted";
}

const props = defineProps<Props>();

const triangleColor = computed(() =>
  props.status === "trusted" ? "#deae29" : "#008253",
);

const statusLabel = computed(() =>
  props.status === "trusted" ? "Trusted" : "Verified",
);


</script>
