<template>
  <Card class="">
    <template #content>
      <div
        class="flex min-h-[250px] justify-center items-center w-full flex-col gap-2.5"
      >
        <i :class="`pi pi-${icon ?? 'folder-open'} !text-[500%]`"></i>
        <div>{{ description ?? "Empty" }}</div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
defineProps(["icon", "description"]);
</script>
