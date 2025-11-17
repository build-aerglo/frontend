<template>
    <div>
        {{ store.getUser() }}
    </div>
</template>

<script setup>
import useBusinessUser from "~/composables/business/useBusinessUser"
const store = useBusinessUser(); 
</script>
