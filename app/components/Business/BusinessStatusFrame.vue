<template>
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
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
        stroke-width="0.5"
        rx="2"
      />

      <!-- Status triangle at top-left -->
      <polygon
        points="1,1 60,1 1,60"
        :fill="triangleColor"
      />

      <!-- Centered text in triangle -->
      <text
        x="22"
        y="20"
        font-size="2"
        fill="white"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="middle"
        transform="rotate(-45 22 20)"
        style="pointer-events: none; user-select: none; text-transform: lowercase; letter-spacing: 0.2px;"
      >
        {{ statusLabel }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: 'verified' | 'trusted'
}

const props = defineProps<Props>()

const triangleColor = computed(() =>
  props.status === 'trusted' ? '#deae29' : '#008253'
)

const statusLabel = computed(() =>
  props.status === 'trusted' ? 'Trusted' : 'Verified'
)
</script>