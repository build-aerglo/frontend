<template>
  <div class="card">
    <div class="card-body px-3 py-1">
      <form class="px-6 py-5">
        <h1 class="text-[150%] text-contrast mb-4">Media & Branding</h1>
  
        <div class="flex flex-col gap-4">
          <!-- Single image (Profile Picture) -->
          <div class="flex flex-col gap-1">
            <InputMedia label="Business Logo" />
          </div>
  
          <!-- Multiple images (Media Files) -->
          <div class="flex flex-col gap-1">
            <InputMedia label="Media Files" :multiple="true" :max="5" />
          </div>
        </div>
  
        <ButtonCustom
          label="Upload Images"
          size="lg"
          primary="true"
          input-class="p-[10px] text-[15px] mt-4 w-auto"
        />
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
