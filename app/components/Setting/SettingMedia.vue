<template>
  <div>
    <form class="px-6 py-5">
      <h1 class="text-[150%] text-contrast">Media & Branding</h1>
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <InputLabel label="Business Logo"/>
          <FileUpload name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)"  accept="image/*" :maxFileSize="1000000">
              <template #empty>
                  <span>Drag and drop files to here to upload.</span>
              </template>
          </FileUpload>
        </div>
        
        <div class="flex flex-col gap-1">
          <InputLabel label="Media files"/>
          <FileUpload name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
              <template #empty>
                  <span>Drag and drop files to here to upload.</span>
              </template>
          </FileUpload>
        </div>
      </div>
      <ButtonCustom label="Save changes" size="lg" primary="true"
        input-class="p-[10px] text-[15px] mt-4 w-auto" />
    </form>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>