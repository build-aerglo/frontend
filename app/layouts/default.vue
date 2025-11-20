<template>
    <Toast />
    <div>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user";

const userStore = useUserStore();
// userStore.initTheme();
</script>
