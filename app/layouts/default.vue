<template>
    <Toast />
    <div>
        <slot />
    </div>
    <LogoutConfirm />
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user";
import LogoutConfirm from '~/components/LogoutConfirm.vue'
const userStore = useUserStore();
// userStore.initTheme();
</script>
