<template>
  <NuxtLink :to="to">
  <img
    src="~/assets/images/e-user-logo.png"
    :class="heightClass"
    alt="Logo"
  />
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  height: {
    type: String,
    default: 'h-[50px]' // default height
  },
  to: {
    type: String,
    default: '/'
  }
})

const heightClass = computed(() => props.height)
</script>
