<template>
  <Toast />
  <div class="flex flex-col gap-2.5 min-h-screen">
    <div
      class="flex justify-between gap-[20px] items-center p-[20px] shadow-md fixed w-full bg-white z-[100]"
    >
      <NuxtLink to="/">
      <img
        src="/images/logo/b-user-logo.png"
        class="w-[96px] h-[40px] object-contain object-center"
      />
      </NuxtLink> 
      <div class="flex gap-2.5 items-center" v-if="data?.data">
        <NuxtLink :to="`/review/write-review?biz=${data?.data?.id}`">
          <ButtonCustom
            size="lg"
            label="Review Business"
            inputClass="w-max"
            :primary="true"
          />
        </NuxtLink>
      </div>
    </div>
    <div class="flex-1 border mt-[80px] sm:px-[50px] px-[10px] py-[20px]">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageData } from "~/composables/method/usePageData";

const data = usePageData();
</script>
