<template>
  <div>
    <Chip
      :value="status"
      class="cursor-pointer transition-all !py-[5px] !capitalize"
      :class="{
        'bg-[#DCFCE7] !text-[green]': status === 'APPROVED',
        'bg-[#FFEDD4] !text-[#C34411]': status === 'REJECTED',
        'bg-[#FEF9C3] !text-[gold]': status === 'AWAITING_MODERATION',
        'bg-[#FEE2E2] !text-[red]': status === 'FLAGGED',
      }"
    >
      <span class="text-[80%]">{{
        status === "AWAITING_MODERATION" ? "AWAITING MODERATION" : status
      }}</span>
    </Chip>
  </div>
</template>

<script setup lang="ts">
defineProps(["status"]);
</script>
