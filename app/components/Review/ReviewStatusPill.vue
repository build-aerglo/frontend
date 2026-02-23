<template>
  <div>
    <Chip
      :value="data.status"
      class="cursor-pointer transition-all !text-[90%] text-white !py-[5px] !lowercase"
      :class="{
        'bg-[#DCFCE7] text-[green]': data.status === 'APPROVED',
        'bg-[#FFEDD4] text-[#C34411]': data.status === 'REJECTED',
        'bg-[#FEF9C3] text-[gold]': data.status === 'PENDING',
        'bg-[#FEE2E2] text-[red]': data.status === 'FLAGGED',
      }"
    >
      <span>{{ data.status }}</span>
    </Chip>
  </div>
</template>

<script setup lang="ts">
defineProps(["data"]);
</script>
