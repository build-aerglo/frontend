<template>
    <div>
        <img :src="`/svg/stars/${count}-star.svg`" />
    </div>
</template>

<script setup>
const props = defineProps(['count'])
</script>