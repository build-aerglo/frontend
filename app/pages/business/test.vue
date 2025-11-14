<template>
    <div>
        {{ store.getUser() }}
    </div>
</template>

<script setup>
import useBusinessUser from "@/composables/useBusinessUser"
const store = useBusinessUser(); 
</script>
