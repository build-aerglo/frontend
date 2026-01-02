<template>
    <Toast />
    <div class="flex flex-col gap-2.5 min-h-screen">
        <div class="flex justify-between gap-[20px] items-center p-[20px] shadow-md fixed w-full bg-white z-[10000]">
            <img src="~/assets/images/e-user-logo.png" class="w-[96px] h-[40px] object-contain object-center" />
            <div>
                {{ data?.id }}
            </div>
        </div>
        <div class="flex-1 border mt-[80px] sm:px-[100px] px-[30px] py-[30px]">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePageData } from '~/composables/method/usePageData';

const data = usePageData()
</script>
