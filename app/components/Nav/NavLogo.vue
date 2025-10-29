<template>
  <img
    src="../../assets/images/b-user-logo.png"
    :class="heightClass"
    alt="Logo"
  />
</template>

<script setup>
const props = defineProps({
  height: {
    type: String,
    default: 'h-[50px]' // default height
  }
})

const heightClass = computed(() => props.height)
</script>
